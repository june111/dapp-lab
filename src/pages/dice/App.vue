<template>
  <div class="casino" id="app">
    <!-- 检查当前网络的按钮 -->
    <!-- <button @click="checkNetwork" class="networkBtn">Network</button>
    <div v-if="showEnv" class="network">
      <p>Welcome to the <span v-if="isMetamask">Metamask</span></p>
      <p>{{network}}</p>
    </div> -->
    <!-- 标题   -->
    <v-container grid-list-lg class="text-xs-center">
      <v-layout row wrap>
        <v-flex xs12 sm12>
          <v-toolbar color="pink" dark>
            <v-toolbar-title>Welcome to the Casino</v-toolbar-title>
          </v-toolbar>
        </v-flex>
      </v-layout>
      <!-- <p>TX: {{tx}}</p> -->
      <v-list two-line>
        <v-flex xs12 sm12 offset-sm4>
          <v-list-tile>
            <p class="title">Prize pool：{{contractBalance}} ETH</p>
          </v-list-tile>
        </v-flex>
        <v-divider></v-divider>
        <v-flex xs12 sm12 offset-sm5>
          <v-card-title primary-title>
            Guess（1～10）
          </v-card-title>
        </v-flex>
        <v-flex xs12>
          <p>You can get a 1-to-1 odds on the winning bet </p>
        </v-flex>
        <v-divider></v-divider>
        <v-flex xs12 sm6 offset-sm3>
          <v-list-tile>
            <v-text-field v-model="amount" label="Bet" required></v-text-field>Ether
          </v-list-tile>
        </v-flex>
      </v-list>
      <!-- loding图 -->
      <img v-if="pending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
      <!-- 用户信息 -->
      <p class="address">Address：{{myAddress}}</p>
      <p>Balance：{{accountBalance}} ETH</p>
      <p v-if="isChooseNum">The number you guess is：{{chooseNum}}</p>
      <div class="event" v-if="winEvent">
        <p>Lucky number is {{luckyNum}}</p>
        <p v-if="winEvent._status" class="green">
          Excellent!!! Get {{winEvent._amount}} ETH
        </p>
        <p v-else class="red-text">
          OH NO ~ Try again
        </p>
      </div>
      <!-- 猜数字 -->
      <v-layout row wrap>
        <v-flex xs3 sm2 v-for="item,index in Numbers" :key="'dice-'+index">
          <v-hover>
            <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" class="mx-auto" width="50" @click="clickNumber(item)">
              <v-card-title>{{item}}</v-card-title>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import Web3 from 'web3'
import abi from 'ethereumjs-abi'
import EthereumTx from 'ethereumjs-tx'
import { toNum } from 'utils'
import { ABI, contractAddr } from 'contracts/dice/abi'
import { estimateGas } from 'utils/web3'
export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  mounted() {
    this.$nextTick(function() {
      this.checkHouseEdge()
      this.checkCasinoBalance()
      let time = setInterval(() => {
        // if (this.flag === true) { clearInterval(time) }
        this.getAccount()
      }, 1000)
    })
  },
  data() {
    return {
      //初始化web3
      web3: undefined,
      isMetamask: false,
      network: '',

      //合约提供的数据
      ABI: null,
      contractAddr: '',
      //实例化合约
      casinoContract: undefined,
      casino: undefined,

      myAddress: '',
      myPrivateKey: '',

      odds: null,

      amount: 0.001,
      pending: false,
      winEvent: null,

      showEnv: false,

      accountBalance: null,
      contractBalance: 0,

      chooseNum: null,
      isChooseNum: false,
      luckyNum: null,

      Numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      tx: null,

    }
  },
  methods: {
    getWeb3() {

      this.ABI = ABI

      this.contractAddr = contractAddr

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
      this.showNetwork()
    },
    showNetwork() {
      const NETWORKS = {
        '1': 'Main Net',
        '2': 'Deprecated Morden test network',
        '3': 'Ropsten test network',
        '4': 'Rinkeby test network',
        '42': 'Kovan test network',
        '4447': 'Truffle Develop Network',
        '5777': 'Ganache Blockchain'
      }
      var version = window.web3.version.network;
      this.network = NETWORKS[version]
    },
    setContract() {
      this.casinoContract = window.web3.eth.contract(this.ABI);
      this.casino = this.casinoContract.at(this.contractAddr);
      console.log('Set Contract!')
    },

    checkHouseEdge() {

      //不能这样调合约方法，本地的私链会成功，但测试网络失败
      // this.casino.houseEdge();

      // function signature
      var encoded = '0x' + abi.methodID('houseEdge', []).toString('hex')
      //调用合约方法
      window.web3.eth.call({
        to: this.contractAddr,
        data: encoded
      }, (error, result) => {
        if (!error) {
          this.odds = parseInt(result, 16);
        } else
          console.error(error);
      });
    },

    async clickNumber(number, event) {

      var encoded = '0x' + abi.simpleEncode("bet(uint256)", number).toString('hex')
      let rawTx = {
        gasPrice: window.web3.toWei('0.00000001', 'ether'), // 10 Gwei
        value: window.web3.toWei(this.amount, 'ether'),
        from: window.web3.eth.coinbase,
        data:encoded,
        to:this.contractAddr
      }
      let gas = await estimateGas(rawTx)
      rawTx.gas = gas
      
      this.chooseNum = number
      this.isChooseNum = true
      let pay = this.amount * this.odds
      this.amount <= 0 ? alert('No way! There are too few bets.') : ''
      this.contractBalance <= pay ? alert('The prize pool is not enough, please reduce the bet.') : ''
      if (this.contractBalance > pay && this.amount > 0) {
        this.winEvent = null
        this.pending = true
        if (this.isMetamask) {
          this.casino.bet(number, rawTx, (err, result, data) => {
            if (err) {
              this.pending = false
              console.error(err)
            } else {
              this.tx = result
              //捕捉 event
              let Won = this.casino.Won()
              Won.watch((err, result) => {
                if (err) {
                  this.pending = false
                  console.error(err)
                } else {
                  this.pending = false
                  this.amount = 0
                  let winningNumber = result.blockNumber % 10 + 1 // % 取余数
                  this.luckyNum = winningNumber
                  this.winEvent = result.args
                  this.winEvent._amount = parseInt(result.args._amount, 10) / Math.pow(10, 18);
                  this.checkCasinoBalance()
                  // 停止捕捉
                  Won.stopWatching();
                }
              })
            }
          })
        } else {
          alert('Please log in to Metamask')
        }
      }

    },

    checkNetwork() {
      this.showEnv ? this.showEnv = false : this.showEnv = true
    },
    getAccount() {

      if (this.isMetamask) {
        //设置账户
        window.web3.eth.accounts[0] ? this.myAddress = window.web3.eth.accounts[0] : alert('Please log in to Metamask')
      } else {

        window.web3.eth.accounts[0] = this.myAddress

      }

      window.web3.eth.getBalance(this.myAddress, (error, result) => {
        if (!error) {
          this.accountBalance = toNum(result) / Math.pow(10, 18);
        } else {
          console.error(error);
        }
      });

    },
    checkCasinoBalance() {
      window.web3.eth.getBalance(this.contractAddr, (error, result) => {
        if (!error) {
          this.contractBalance = toNum(result) / Math.pow(10, 18);
        } else {
          console.error(error);
        }
      });
    }
  }
}

</script>
<style scoped>
input {
  width: 45px;
}

ul {
  padding: 0;

  list-style-type: none;
}

/*.block-number {
  display: flex;

  margin: 0 auto;

  justify-content: center;
  flex-wrap: wrap;
}*/

.block-number li {
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 20px;

  cursor: pointer;

  color: #bbb6b6;
  border: 1px solid #bbb6b6;
  border-radius: 50%;
  background-color: #fff;

  width: 6%;

  text-align: center;
}

.block-number li:hover {
  color: white;
  border: 1px solid rgb(244, 198, 20);
  background-color: rgb(244, 198, 20);
  box-shadow: 0 0 rgb(244, 198, 20);
}

.block-number li:active {
  opacity: .7;
}

.casino {
  margin: 0 auto;
  max-width: 1000px;

  text-align: center;
}

.networkBtn,
.network {
  position: absolute;
  right: 10px;
}

.network {
  top: 75px;
}

.network p {
  margin: 0;
}

.loader {
  width: 150px;
}

.address {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.green {
  color: green;
}

.red-text {
  color: red;
}

</style>
