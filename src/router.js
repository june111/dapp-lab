import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: 'dapp-fun-test/',
  routes: [{
    path: '/',
    component: () =>import('./view/home.vue')
  },{
    path: '/random',
    component: () =>import('./components/random.vue')
  },{
    path: '/lottery',
    component: () =>import('./components/lottery.vue')
  },{
    path: '/record',
    component: () =>import('./components/record.vue')
  },{
    path: '/random-b',
    component: () =>import('./components/random-b.vue')
  },{
    path: '/test',
    component: () =>import('./components/test.vue')
  }]
})