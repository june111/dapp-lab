<template>
  <div>
    <p>{{address[0]}}</p>
    <hr>
    <button @click="load">读数据</button>
    <p>读取结果：{{contractBalance}}</p>
    <br>
    <button @click="loadNo">期数</button>
  </div>
</template>
<script>
import Web3 from 'web3'
import { ABI, contractAddr } from '../contract/test/abi'
import { toNum } from '../util'

var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util')
export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  data() {
    return {
      amount: 0.001,
      isMetamask: false,
      myContract: undefined,
      contractIns: undefined,
      tx: '',
      contractBalance: '',

      address: '',
      name: 'june',
      email: '123@qq.com'
    }
  },
  methods: {
    async getWeb3() {

      // Modern dapp browsers...
      if (window.ethereum) {
        // alert('111111111');
        window.web3 = new Web3(ethereum);
        try {
          // alert('111112222222');
          // Request account access if needed
          this.address = await ethereum.enable();
          // Acccounts now exposed
          this.isMetamask = true
        } catch (error) {
          alert('11111333333');
          alert(error);
          console.log(error)
          // User denied account access...
          this.isMetamask = false
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        alert('222222111111');
        // window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        // this.isMetamask = true
        try {
          alert('222222222222')
          window.web3 = new Web3(web3.currentProvider);
          // window.web3.enable();
          this.isMetamask = true
        } catch (error) {
          // User denied account access...
          alert('222222333333')
          alert(error)
          this.isMetamask = false
        }
      }
      // Non-dapp browsers...
      else {
        alert('333333333333')
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        this.isMetamask = false
      }

      console.log('Get Web3!')
    },
    setContract() {
      this.myContract = window.web3.eth.contract(ABI);
      this.contractIns = this.myContract.at(contractAddr);
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
    loadNo() {
      this.contractIns.getGuessNum((err, result, data) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', toNum(result))
          let a = 0x0000000000000000000000000000000000000000000000000000000000000479
          console.log('a', toNum(a))
          

        }
      })
    },

  }
}

</script>
