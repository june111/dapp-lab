<template>
  <div>
    <p>小彩票中大奖</p>
    <p>奖池：{{pool}} ETH</p>
    <p>彩票价格：0.1 ETH</p>
    <button v-if="!isOwner" @click="buy">买彩票</button>
    <p>获奖地址：{{winnerAddr}}</p>
    <div v-if="isOwner">
      <button @click="getWinner">开奖</button>
      <button @click="killIt">删除</button>
    </div>
  </div>
</template>
<script>
import abi from 'ethereumjs-abi'
import { toNum, parseTime } from '../util'
import { loadFromContract, getETHBalance } from '../util/web3'
import { ABI, contractAddr } from '../contract/Lottery/abi'
export default {
  name: 'lottery',
  data() {
    return {
      //初始化web3
      web3: undefined,
      isMetamask: false,

      myContract: null, // 合约
      contractInstance: null, // 实例化合约

      isOwner: false,
      pool: 0,
      winnerAddr: '',
    }
  },

  created() {
    this.getWeb3()
    this.setContract()
  },
  mounted: function() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
    })
  },
  methods: {
    getWeb3() {

      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          ethereum.enable();
          // Acccounts now exposed
          this.isMetamask = true

        } catch (error) {
          // User denied account access...
          this.isMetamask = false
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        this.isMetamask = true
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        this.isMetamask = false
      }

      console.log('Get Web3!')
    },
    // 实例化主合约
    // 拿主页面数据
    setContract() {
      if (this.isMetamask) {
        this.myContract = window.web3.eth.contract(ABI);
        this.contractInstance = this.myContract.at(contractAddr);
        this.checkOwner()
        this.checkPool()
      }
    },
    buy() {
      if (this.isMetamask) {
        this.contractInstance.enter({
          gas: 300000, //Gas Limit 300000
          gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
          value: window.web3.toWei(0.1, 'ether'),
          from: window.web3.eth.coinbase
        }, (err, result, data) => {
          if (err) {
            console.error(err)
          } else {
            console.log('result', result)
          }

        })
      }
    },
    killIt() {
      if (this.isMetamask) {
        this.contractInstance.kill((err, result, data) => {
          if (err) {
            console.error(err)
          } else {
            console.log('result', result)
          }

        })
      }
    },
    getWinner() {
      if (this.isMetamask) {
        this.contractInstance.startChooseWinnerProcess({
          value: window.web3.toWei('0.005', 'ether'),
        }, (err, result, data) => {
          if (err) {
            console.error(err)
          } else {
            console.log('result', result)
            let OraclizeCallback = this.contractInstance.LogOraclizeCallback();
            OraclizeCallback.watch((error, result) => {
              if (!error)
                console.log('OraclizeCallback', result);
            });

            let WinnerSelected = this.contractInstance.WinnerSelected();
            WinnerSelected.watch((error, result) => {
              if (!error)
                console.log('WinnerSelected', result);
            });

            let NewRoundStarted = this.contractInstance.NewRoundStarted();
            NewRoundStarted.watch((error, result) => {
              if (!error)
                console.log('NewRoundStarted', result);
            });

            let LogOraclizeFailure = this.contractInstance.LogOraclizeFailure();
            LogOraclizeFailure.watch((error, result) => {
              if (!error)
                console.log('LogOraclizeFailure', result);
            });

            let logRandom = this.contractInstance.logRandom();
            logRandom.watch((error, result) => {
              if (!error)
                console.log('logRandom', result);
            });

          }
        })
      }

    },
    checkOwner() {
      let encoded = '0x' + abi.methodID('isOwner', []).toString('hex')
      loadFromContract(contractAddr, encoded).then(res => {
        this.isOwner = Boolean(toNum(res))
      })
    },
    checkWinner() {
      let encoded = '0x' + abi.methodID('winner', []).toString('hex')
      loadFromContract(contractAddr, encoded).then(res => {
        console.log('winner', res)
      })
    },
    checkPool() {
      getETHBalance(contractAddr).then(price => {
        this.pool = price
      })
    }
  }
}

</script>
