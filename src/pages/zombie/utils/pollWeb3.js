/**
 * 导入 web3，这样我们就不依赖于 Metamask 实例
 */
import Web3 from 'web3'
/**
 * 导入我们的 store，这样我们就可以进行数据对比和分发操作
 */
import store from './../store'

let pollWeb3 = function(state) {
  /**
   * 设置一个间隔来检查地址是否发生了变化
   * 如果地址有变化，则更新地址
   * 余额每秒更新一次
   * 更新 store
   *
   * @param    {string} [web3.eth.accounts[0]] 当前账户地址
   * @param    {string} [store.state.web3.account] 存储的账户地址
   *
   * @Author   June
   * @DateTime 2018-09-07
   */
  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      // 钱包地址变了，更改account 
      if (typeof(web3.eth.accounts[0]) !== 'undefined' && web3.eth.accounts[0] !== store.state.web3.account) {
        let newAccount = web3.eth.accounts[0]
        web3.eth.defaultAccount = newAccount
        console.log('newAccount', newAccount)
        store.dispatch('pollWeb3', {
          account: newAccount,
        })
        // 钱包地址没变
      } else {

      }
    }
  }, 3000)
}

export default pollWeb3
