<template>
  <div class="RNG">
    <h3>Ropsten Only</h3>
    <button @click="entry">参加</button>
    <p>Get random number </p>
    <img v-if="getApiRadNumPending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
    <button v-else @click="getApiRadNum">Generate</button>
    <p>Random Number: {{luckyNum}}</p>
    <p>{{luckyNumTime}}</p>
    <input v-model="historyNum"><button @click="getHistory">历史</button>
  </div>
</template>
<script>
    // "web3": "^1.0.0-beta.48"
import Web3 from 'web3'
import { parseTime } from '../util'
import { ABI, contractAddr } from '../contract/Lottery/abi'

export default {
  created() {
    this.getWeb3()
  },
  data() {
    return {
      // 初始化web3
      web3: undefined,
      isMetamask: false,

      // 合约提供的数据
      // 实例化合约
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
      historyNum: '',

    }
  },
  methods: {
    async getWeb3() {

      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          ethereum.enable();
          // Acccounts now exposed
          this.isMetamask = true
          await ethereum.enable();
          var accounts = await web3.eth.getAccounts();
          this.myAddress = accounts[0]
          console.log('accounts', accounts)
          console.log('Get Web3!')
          this.setContract()

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

    },

    setContract() {
      console.log('cc')
      var myContract = new web3.eth.Contract(ABI, contractAddr);
      this.RNG = myContract
    },
    getAccount() {

      if (this.isMetamask) {
        //设置账户
        window.web3.eth.accounts[0] ? this.myAddress = window.web3.eth.accounts[0] : alert('Please log in to Metamask')
      } else {

        window.web3.eth.accounts[0] = this.myAddress

      }

    },
    entry() {
      this.RNG.methods.enter.send({
          value: window.web3.utils.toWei('0.1', 'ether'),
          from: this.myAddress
        })
        .on('error', (error) => { console.error(error) })
        .on('transactionHash', (hash) => {
          console.log('交易哈希', hash)

        })
    },
    getApiRadNum() {
      this.luckyNum = 'empty'
      this.getApiRadNumPending = true
      let start, end
      if (this.isMetamask) {
        // console.log('eth', window.web3.eth)
        this.RNG.methods.startChooseWinnerProcess.send({
            value: window.web3.utils.toWei('0.01', 'ether'),
            from: this.myAddress
          })
          .on('error', (error) => { console.error(error) })
          .on('transactionHash', (hash) => {
            console.log('交易哈希', hash)
            start = new Date().getTime()

          })

          .on('confirmation', (confirmationNumber, receipt) => {
            this.getApiRadNumPending = false
            console.log('确认的区块数', confirmationNumber)
            if (confirmationNumber === 1) {
              this.RNG.events.logRandom({
                fromBlock: receipt.blockNumber
              }, (error, result) => {
                if (!error) {
                  console.log('logRandom', result);
                  if (result.returnValues.dice) this.luckyNum = result.returnValues.dice
                } else {
                  console.log(error);
                }
              });

              // this.RNG.events.WinnerSelected({
              //   fromBlock: receipt.blockNumber
              // }, (error, result) =>{
              //   if (!error) {
              //     console.log('WinnerSelected',result);
              //   } else {
              //     console.log(error);
              //   }
              // });

              this.RNG.events.NewRoundStarted({
                fromBlock: receipt.blockNumber
              }, (error, result) => {
                if (!error) {
                  console.log('NewRoundStarted', result.returnValues.timestamp);
                } else {
                  console.log(error);
                }
              });
            }
            // console.log('confirmation receipt2', receipt)
          })
          .on('receipt', (receipt) => {
            console.log('receipt1', receipt)
            end = new Date().getTime(); // 结束时间
            this.luckyNumTime = 'Cost: ' + parseTime((end - start), '{i}:{s}')
          })

      }
    },
    getHistory() {

      this.RNG.methods.getHistory(this.historyNum).call().then(res => {
        console.log('res', res)
      })
    }

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
