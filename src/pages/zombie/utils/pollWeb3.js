/**
 * 导入 web3，这样我们就不依赖于 Metamask 实例
 */
import Web3 from 'web3'
/**
 * 导入我们的 store，这样我们就可以进行数据对比和分发操作
 */
import store from './../store'
// console.log('pollWeb3')
let pollWeb3 = function(state) {
  /**
   * [web3 创建 web3 实例]
   * @type {obj}
   */
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)

  /**
   * 设置一个间隔来检查地址是否发生了变化，如果没有，检查余额是否发生了变化
   * 如果地址有变化，则更新地址
   * 余额每秒更新一次
   * 更新 store
   *
   * @param    {string} [web3.eth.accounts[0]] 当前账户地址
   * @param    {string} [store.state.web3.account] 存储的账户地址
   * @return   {bignumber} [balance] eth余额
   *
   * @Author   June
   * @DateTime 2018-09-07
   */
  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      // 钱包地址变了
      if (typeof(web3.eth.accounts[0]) !== 'undefined' && web3.eth.accounts[0] !== store.state.web3.account) {
        let newAccount = web3.eth.accounts[0]
        web3.eth.defaultAccount = newAccount
        console.log('newAccount', newAccount)
        web3.eth.getBalance(newAccount, function(err, newBalance) {
          if (err) {
            console.log(err)
          } else {
            store.dispatch('pollWeb3', {
              account: newAccount,
              // balance: parseInt(newBalance, 10)
              balance: newBalance
            })
          }
        })
      } else {
        // 钱包地址没变
        web3.eth.getBalance(store.state.web3.account, (err, polledBalance) => {
          if (err) {
            console.log(err)
          } else if (polledBalance !== store.state.web3.balance) {
            let account = web3.eth.accounts[0]
            web3.eth.defaultAccount = account // metamask 调用合约方法会用到defaultAccount，若不用会出现invalid address 报错
            // console.log('account', account)
            store.dispatch('pollWeb3', {
              account: store.state.web3.account,
              balance: polledBalance
            })
          }
        })
      }
    }
  }, 3000)
}

export default pollWeb3
