

let Vue;


class Router {
  static install(_Vue) {
    Vue = _Vue;
    Vue.mixin({
      beforeCreate() {
        if(this.$options.router) { // 此时的router 是 new Vue({router)
          Vue.prototype.$routerMsg = '路由加载完毕';
          Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      }
    })
  }
  constructor(options) {
    this.$options = options;
    // 创建路由隐射表
    this.routeMap = {};
    // 将当前路由current 响应式化
    this.app = new Vue({
      data: {
        current: '/'
      }
    })
  }

  init() {
    this.bindEvents();
    this.createRouteMap(this.$options);
    this.initComponent(Vue);
  }

  bindEvents() {
    window.addEventListener('load', this.onHashChange.bind(this), false);
    window.addEventListener('hashchange', this.onHashChange.bind(this), false);
  }

  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item
    });
  }

  // 注册组件
  initComponent(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h('a', {
          attrs: {
            href: '#' + this.to
          }
        }, [
          this.$slots.default
        ])
      }
    });

    Vue.component('router-view', {
      render: h => {
        var component = this.routeMap[this.app.current].component;
        return h(component)
      }
    });
  }

  push(url) {
    window.location.hash = url;
  }

  getFrom(e) {
    let from, to;
    if(e.newURL) {
      from = e.oldURL.split('#')[1];
      to = e.newURL.split('#')[1];
    } else {
      from = '';
      to = location.hash;
    }

    return {from, to};
  }

  getHash() {
    return window.location.hash.slice(1) || '/'
  }

  onHashChange(e) {
    let {from, to} = this.getFrom(e);
    let hash = this.getHash();
    let router = this.routeMap[hash];
    console.log('current router--', router);
    if(router.beforeEnter) {
      router.beforeEnter(from, to, () => {
        this.app.current = this.getHash();
      });
    } else {
      this.app.current = this.getHash();
    }
  }

}

export default Router;
