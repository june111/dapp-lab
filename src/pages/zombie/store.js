import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import getWeb3 from './utils/getWeb3'
import pollWeb3 from './utils/pollWeb3'
import { toNum } from '@/utils'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    web3: {
      isInjected: false,
      web3Instance: null,
      networkId: null,
      account: null || Cookies.get('account'), // 账户地址
      balance: null || Cookies.get('balance'), // eth余额
      error: null
    },
    hvProvider: false || Cookies.get('hvProvider')

    // Socket
    // stompClient,
    // socketConnect: false,

  },
  mutations: {

    // SET_Metamask: (state, hvProvider) => {
    //   state.hvProvider = hvProvider
    // },

    // Socket
    // SET_Socket: (state, stompClient) => {
    //     state.stompClient = stompClient
    // },
    // SET_SocketConnect: (state, socketConnect) => {
    //     state.socketConnect = socketConnect
    // },

    /**
     * web3 实例初始化
     *
     * @return   {obj} [web3]
     *
     * @Author   June
     * @DateTime 2018-09-10T09:49:12+0800
     */
    registerWeb3Instance(state, payload) {
      // console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.account = result.account[0]
      web3Copy.networkId = result.networkId
      web3Copy.balance = result.balance
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
      state.hvProvider = result.hvProvider
      // alert(result.hvProvider)
      Cookies.set('hvProvider', result.hvProvider)
      pollWeb3()
    },

    /**
     * 每隔1s, 轮询更新，查一次账户地址和账户余额
     *
     * @return   {string} [account] 账户地址
     * @return   {bignumber} [balance] 账户余额
     *
     * @Author   June
     * @DateTime 2018-09-10T09:47:36+0800
     */
    pollWeb3Instance(state, payload) {
      // console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.account = payload.account
      state.web3.balance = payload.balance
      // console.log('------------pollWeb3Instance---------')
      Cookies.set('account', payload.account)
      Cookies.set('balance', payload.balance)
    }

  },
  actions: {

    /**
     * @param    {obj} getWeb3 账户地址，账户余额
     * @return   {obj} account，balance，injectedWeb3，web3
     *
     * @Author   June
     * @DateTime 2018-09-07
     */
    registerWeb3({ commit }) {
      console.log('registerWeb3 Action being executed')
      getWeb3.then(result => {
        console.log('--------------------------------------------')
        console.log('committing result to registerWeb3Instance mutation')
        commit('registerWeb3Instance', result)
      }).catch(e => {
        console.log('error in action registerWeb3', e)
      })
    },

    /**
     * 修改当前账户地址，余额
     *
     * @param    {obj} payload
     * @param    {string} account 账户地址
     * @param    {bignumber} balance 余额
     *
     * @Author   June
     * @DateTime 2018-09-07
     */
    pollWeb3({ commit }, payload) {
      // console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    }

    // loopWeb3({ commit }, payload) {
    //     console.log('loopWeb3 action being executed')
    //     commit('loopWeb3Instance', payload)
    // },

  },
  getters: {
    balance: state => {
      return toNum(state.web3.balance) / Math.pow(10, 18)
    }

  }
})
