<template>
  <div>
    <p>{{address}}</p>
    <button @click="load">读数据</button>
    <p>读取结果：{{contractBalance}}</p>
    <br>
    <input type="test" v-model="amount">
    <button @click="write">写数据 </button>
    <p>TxHash：{{tx}}</p>
  </div>
</template>
<script>
import Web3 from 'web3'
import { ABI, contractAddr } from '../contract/info'
import { toNum } from '../util'
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

      address: ''
    }
  },
  methods: {
    async getWeb3() {

      // Modern dapp browsers...
      if (window.ethereum) {
        alert('111111111');
        window.web3 = new Web3(ethereum);
        try {
          alert('111112222222');
          // Request account access if needed
          this.address = await ethereum.enable();
          // Acccounts now exposed
          this.isMetamask = true
        } catch (error) {
          alert('11111333333');
          alert(error);
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
          window.web3.enable();
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
