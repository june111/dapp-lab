import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: 'dapp-fun-test/',
  routes: [{
    path: '/',
    component: () => import('./view/home.vue')
  }, {
    path: '/dice',
    component: () => import('./view/dice.vue')
  }, {
    path: '/record',
    component: () => import('./components/record.vue')
  }, {
    path: '/random-b',
    component: () => import('./components/random-b.vue')
  }, {
    path: '/test',
    component: () => import('./components/test.vue')
  }, {
    path: '/test-collection',
    component: () => import('./view/test/layout.vue'),
    redirect: '/test-collection/basic',
    children: [{
      path: 'basic',
      component: () => import('./view/test/basic.vue'),
    }, {
      path: 'msg-sign',
      component: () => import('./view/test/msgsign.vue'),
    }, {
      path: 'contract-info',
      component: () => import('./view/test/contractinfo.vue'),
    }, {
      path: 'random',
      component: () => import('./view/test/random.vue')
    }, ]
  }, {
    path: '*',
    component: () => import('./view/404.vue')
  }]
})
