import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: 'dapp-lab/',
  routes: [
  // {
  //   path: '/record',
  //   component: () => import('./components/record.vue')
  // }, {
  //   path: '/random-b',
  //   component: () => import('./components/random-b.vue')
  // },
  {
    path: '/',
    component: () => import('./views/layout.vue'),
    redirect: '/test-collection',
    children: [{
      path: 'test-collection',
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
    component: () => import('@/components/404.vue')
  }]
})
