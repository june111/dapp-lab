import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'dapp-fun-test/',
  routes: [{
    path: '/',
    component: () =>import('./components/random.vue')
  },{
    path: '/record',
    component: () =>import('./components/record.vue')
  },{
    path: '/test',
    component: () =>import('./components/test.vue')
  }]
})