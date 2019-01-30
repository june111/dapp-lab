import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'dapp-fun-test/',
  routes: [{
    path: '/',
    name: 'casino-dapp',
    component: () =>import('./components/dice.vue')

  }]
})