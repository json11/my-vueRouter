import Vue from 'vue'
import Home from './views/Home.vue'

import VueRouter from './vue-router'
// import VueRouter from 'vue-router';
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(from,to,next){
        console.log(`beforEnterHome from ${from} to ${to}`)
        setTimeout(()=>{
          next()
        },1000)
        // next()
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
