import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: 'dapp-lab/',
  routes: [
  // {
  //   path: '/',
  //   component: () => import('./views/home.vue')
  // }, {
  //   path: '/dice',
  //   component: () => import('./views/dice/dice.vue')
  // }, {
  //   path: '/record',
  //   component: () => import('./components/record.vue')
  // }, {
  //   path: '/random-b',
  //   component: () => import('./components/random-b.vue')
  // }, {
  //   path: '/test',
  //   component: () => import('./components/test.vue')
  // }, 
  {
    path: '/test-collection',
    component: () => import('./views/layout.vue'),
    redirect: '/test-collection/basic',
    children: [{
      path: 'basic',
      component: () => import('./views/basic.vue'),
    }, {
      path: 'msg-sign',
      component: () => import('./views/msgsign.vue'),
    }, {
      path: 'contract-info',
      component: () => import('./views/contractinfo.vue'),
    }, {
      path: 'random',
      component: () => import('./views/random.vue')
    }, {
      path: 'get-data-code',
      component: () => import('./views/get-data-code.vue')
    }, {
      path: 'send-raw-transaction',
      component: () => import('./views/send-raw-transaction.vue')
    },]
  }, {
    path: '*',
    component: () => import('./../../view/404.vue')
  }]
})
