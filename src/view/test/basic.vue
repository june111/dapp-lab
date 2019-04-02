<template>
  <div>
    <v-card>
      <v-card-text>
        <v-btn color="blue" dark @click="load">读取合约余额</v-btn>
        <span v-if="contractBalance">合约余额：{{contractBalance}}</span>
      </v-card-text>
      <v-divider></v-divider>
      <v-container grid-list-md text-xs-center>
        <v-layout row>
          <v-flex xs7 sm10>
            <v-text-field v-model="amount" label="amount"></v-text-field>
          </v-flex>
          <v-flex xs2 sm2>
            <v-btn color="blue" dark @click="write">写数据</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-text v-if="tx">
        <p style="word-break: break-all;">TxHash：{{tx}}</p>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Web3 from 'web3'
import { ABI, contractAddr } from '../../contract/info'
import { toNum } from '../../util'

export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  data() {
    return {
      amount: 0.001,
      isMetamask: false,
      casinoContract: undefined,
      casino: undefined,
      tx: '',
      contractBalance: '',

      address: '',

    }
  },
  methods: {
    async getWeb3() {

      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          this.address = await ethereum.enable();
          // Acccounts now exposed
          this.isMetamask = true
        } catch (error) {
          console.log(error)
          // User denied account access...
          this.isMetamask = false
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {

        try {
          window.web3 = new Web3(web3.currentProvider);
          this.isMetamask = true
        } catch (error) {
          // User denied account access...
          alert(error)
          this.isMetamask = false
        }
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        this.isMetamask = false
      }

    },
    setContract() {
      this.casinoContract = window.web3.eth.contract(ABI);
      this.casino = this.casinoContract.at(contractAddr);
      console.log('Set Contract!')
    },
    load() {
      console.log(contractAddr)
      window.web3.eth.getBalance(contractAddr, (error, result) => {
        if (!error) {
          this.contractBalance = toNum(result) / Math.pow(10, 18);
        } else {
          console.error(error);
        }
      });
    },

    write() {
      if (this.isMetamask) {
        this.casino.bet(1, {
          gas: 300000, //Gas Limit 300000
          gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
          value: window.web3.toWei(this.amount, 'ether'),
          from: window.web3.eth.coinbase
        }, (err, result, data) => {
          if (err) {
            console.error(err)
          } else {
            this.tx = result

          }
        })
      }
    }
  }
}

</script>
