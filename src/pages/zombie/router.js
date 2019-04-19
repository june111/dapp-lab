import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: 'dapp-lab/',
  routes: [
  {
    path: '/',
    component: () => import('./views/layout.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('./views/zombie.vue'),
    }, ]
  }, {
    path: '*',
    component: () => import('@/components/404.vue')
  }]
})
