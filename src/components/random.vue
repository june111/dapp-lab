<template>
  <div class="RNG">
    <h3>Ropsten Only</h3>
    <p>Get random number between 1 and 6 from API</p>
    <img v-if="getApiRadNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
    <button v-else @click="getApiRadNum">Generate</button>
    <p>Random Number: {{luckyNum}}</p>
    <p>{{luckyNumTime}}</p>
    <br>
    <p>Get random number between 0 and 100 from Oraclize's random</p>
    <img v-if="getOraRadNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
    <button v-else @click="getOraRadNum">Generate</button>
    <p>Random Number: {{oraRadNum}}</p>
    <p>{{oraRadNumTime}}</p>
    <br>
    <p>Get random number between 0 and 100 from Oraclize's WolframAlpha</p>
    <img v-if="getWolNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
    <button v-else @click="getWolNum">Generate</button>
    <p>Random Number: {{wolNum}}</p>
    <p>{{wolNumTime}}</p>
  </div>
</template>
<script>
import Web3 from 'web3'
import { parseTime } from '../util'
import { ABI, contractAddr } from '../contract/OraclizeAPI/abi'
import {
  randomABI,
  randomContractAddr
} from '../contract/OraclizeRandom/abi'
import {
  wolABI,
  wolContractAddr
} from '../contract/WolframAlpha/abi'
export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  data() {
    return {
      //初始化web3
      web3: undefined,
      isMetamask: false,

      //合约提供的数据
      //实例化合约
      RNGContract: undefined,
      RNG: undefined, // 合约实例
      luckyNum: 'empty',
      luckyNumTime: '',
      getApiRadNumPending: false,

      randomContract: undefined,
      oraRandom: undefined, // 合约实例
      oraRadNum: 'empty',
      oraRadNumTime: '',
      getOraRadNumPending: false,

      wolContract: undefined,
      wolRandom: undefined, // 合约实例
      wolNum: 'empty',
      wolNumTime: '',
      getWolNumPending: false,

      myAddress: '',


    }
  },
  methods: {
    async getWeb3() {

      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          await ethereum.enable();
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

    setContract() {
      this.RNGContract = window.web3.eth.contract(ABI);
      this.RNG = this.RNGContract.at(contractAddr);
      this.oraRadNumContract = window.web3.eth.contract(randomABI);
      this.oraRandom = this.oraRadNumContract.at(randomContractAddr);
      this.wolContract = window.web3.eth.contract(wolABI);
      this.wolRandom = this.wolContract.at(wolContractAddr);
      console.log('Set Contract!')
    },
    getAccount() {

      if (this.isMetamask) {
        //设置账户
        window.web3.eth.accounts[0] ? this.myAddress = window.web3.eth.accounts[0] : alert('Please log in to Metamask')
      } else {

        window.web3.eth.accounts[0] = this.myAddress

      }

    },
    getApiRadNum() {
      this.luckyNum = 'empty'
      this.getApiRadNumPending = true

      if (this.isMetamask) {
        // console.log('eth', window.web3.eth)
        this.RNG.getNumber({
          value: window.web3.toWei('0.01', 'ether'),
          from: window.web3.eth.accounts[0]
        }, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log('tx', result)
            let start = new Date().getTime()

            let event = this.RNG.LogNewOraclizeQuery();
            // watch for changes
            event.watch(function(error, result) {
              if (!error)
                console.log(result.args.description);
            });

            let fetchNum = this.RNG.LogNumberUpdated()
            fetchNum.watch((err, result) => {
              if (err) {
                console.error(err)
              } else {
                this.getApiRadNumPending = false

                // console.log('args', result.args)
                this.luckyNum = result.args.dice
                fetchNum.stopWatching();
                event.stopWatching();
                let end = new Date().getTime(); // 结束时间
                this.luckyNumTime = 'Cost: ' + parseTime((end - start), '{i}:{s}')

              }
            })
          }
        })
      }
    },

    getOraRadNum() {
      this.oraRadNum = 'empty'
      this.getOraRadNumPending = true
      if (this.isMetamask) {
        // console.log('eth', window.web3.eth)
        this.oraRandom.update({
          value: window.web3.toWei('0.01', 'ether'),
          from: window.web3.eth.accounts[0]
        }, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log('tx', result)
            let start = new Date().getTime()

            let fetchNum = this.oraRandom.logRandom()
            fetchNum.watch((err, result) => {
              if (err) {
                console.error(err)
              } else {
                this.getOraRadNumPending = false
                // console.log('args', result.args)
                this.oraRadNum = result.args.dice
                fetchNum.stopWatching();
                let end = new Date().getTime(); // 结束时间
                this.oraRadNumTime = 'Cost: ' + parseTime((end - start), '{i}:{s}')

              }
            })

          }
        })
      }
    },

    getWolNum() {
      this.wolNum = 'empty'
      this.getWolNumPending = true
      if (this.isMetamask) {
        // console.log('eth', window.web3.eth)
        this.wolRandom.update({
          value: window.web3.toWei('0.01', 'ether'),
          from: window.web3.eth.accounts[0]
        }, (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log('tx', result)
            let start = new Date().getTime()

            let event = this.wolRandom.newOraclizeQuery();
            // watch for changes
            event.watch(function(error, result) {
              if (!error)
                console.log(result.args.description);
            });

            let fetchNum = this.wolRandom.logRrandomNum()
            fetchNum.watch((err, result) => {
              if (err) {
                console.error(err)
              } else {
                this.getWolNumPending = false
                // console.log('args', result.args)
                this.wolNum = result.args.randomNum
                fetchNum.stopWatching();
                let end = new Date().getTime(); // 结束时间
                this.wolNumTime = 'Cost: ' + parseTime((end - start), '{i}:{s}')

              }
            })

          }
        })
      }

    },

  }
}

</script>
<style>
.RNG {
  margin: 8vh auto;
  text-align: center;
}

.loader {
  display: block;
  width: 30px;
  margin: 0 auto;
}

</style>
