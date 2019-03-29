<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div class="center"> 
          <h3 class="headline mb-0">Ropsten Only</h3>
        </div>
      </v-card-title>
    </v-card>
    <v-card>
      <v-card-title primary-title  >
        <div class="center">
          <h3 class="mb-0">Get random number between 1 and 6 from API</h3>
          <img v-if="getApiRadNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
          <v-btn v-else color="blue" dark @click="getApiRadNum">Generate</v-btn>
          <p v-if="luckyNum">Random Number: {{luckyNum}}</p>
          <p>{{luckyNumTime}}</p>
        </div>
      </v-card-title>
    </v-card>
    <v-card>
      <v-card-title primary-title>
        <div class="center">
          <h3 class="mb-0">Get random number between 0 and 100 from Oraclize's random</h3>
          <img v-if="getOraRadNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
          <v-btn v-else color="blue" dark @click="getOraRadNum">Generate</v-btn>
          <p v-if="oraRadNum">Random Number: {{oraRadNum}}</p>
          <p>{{oraRadNumTime}}</p>
        </div>
      </v-card-title>
    </v-card>
    <v-card>
      <v-card-title primary-title>
        <div class="center">
          <h3 class="mb-0">Get random number between 0 and 100 from Oraclize's WolframAlpha</h3>
          <img v-if="getWolNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
          <v-btn v-else color="blue" dark @click="getWolNum">Generate</v-btn>
          <p v-if="wolNum">Random Number: {{wolNum}}</p>
          <p>{{wolNumTime}}</p>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
import Web3 from 'web3'
import { parseTime } from '../../util'
import { ABI, contractAddr } from '../../contract/OraclizeAPI/abi'
import {
  randomABI,
  randomContractAddr
} from '../../contract/OraclizeRandom/abi'
import {
  wolABI,
  wolContractAddr
} from '../../contract/WolframAlpha/abi'
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
      luckyNum: '',
      luckyNumTime: '',
      getApiRadNumPending: false,

      randomContract: undefined,
      oraRandom: undefined, // 合约实例
      oraRadNum: '',
      oraRadNumTime: '',
      getOraRadNumPending: false,

      wolContract: undefined,
      wolRandom: undefined, // 合约实例
      wolNum: '',
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
      this.luckyNum = ''
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
      this.oraRadNum = ''
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
      this.wolNum = ''
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
<style scoped>
.center{
      margin: 0px auto;
    text-align: center;
}
.loader {
  display: block;
  width: 30px;
  margin: 0 auto;
}

</style>
