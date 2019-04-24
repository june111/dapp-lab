import Web3 from 'web3'
/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */

let getWeb3 = new Promise((resolve, reject) => {
    // Check for injected web3 (mist/metamask)

    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        ethereum.enable()
        console.log('----------account access------------')
        // Acccounts now exposed
        resolve({
          injectedWeb3: window.web3.isConnected(),
          hvProvider: true,
          web3() {
            return web3
          }
        })
      } catch (error) {
        // User denied account access...
        console.log('User denied account access')
        resolve({
          injectedWeb3: web3.isConnected(),
          hvProvider: false,
          web3() {
            return web3
          }
        })
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('Legacy dapp browsers')
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      // alert(web3.currentProvider.enable())
      // web3.currentProvider.enable()
      resolve({
        injectedWeb3: web3.isConnected(),
        hvProvider: true,
        web3() {
          return web3
        }
      })
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      alert('nono')
      resolve({
        injectedWeb3: web3.isConnected(),
        hvProvider: false,
        web3() {
          return web3
        }
      })
    }
  })

  /**
   * 获取networkId
   */
  // .then(result => {
  //     return new Promise(function(resolve, reject) {
  //         // Retrieve network ID
  //         result.web3().version.getNetwork((err, networkId) => {
  //             if (err) {
  //                 // If we can't find a networkId keep result the same and reject the promise
  //                 reject(new Error('Unable to retrieve network ID'))
  //             } else {
  //                 // Assign the networkId property to our result and resolve promise
  //                 result = Object.assign({}, result, { networkId })
  //                 resolve(result)
  //             }
  //         })
  //     })
  // })

  /**
   * 获取账户地址
   */
  .then(result => {
    console.log('----------get Accounts------------')
    return new Promise(function(resolve, reject) {
      // Retrieve account

      result.web3().eth.getAccounts((err, account) => {
        if (err) {
          reject(new Error('Unable to retrieve account'))
        } else {
          if (account.length === 0) {
            reject(new Error('Unable to connect to Metamask'))
          } else {
            // clearInterval(t)
            result = Object.assign({}, result, { account })
            console.log('----------get Accounts result------------')
            resolve(result)
          }
        }
      })
    })
  })

export default getWeb3
