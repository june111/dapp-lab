<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">Compile data by ABI</h3>
      </v-card-title>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs7 sm10>
            <v-text-field v-model="amount" label="amount"></v-text-field>
          </v-flex>
          <v-flex xs2 sm2>
            <v-btn color="blue" dark @click="write">Write</v-btn>
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
import abi from 'ethereumjs-abi'

import { ABI, contractAddr } from 'contracts/info'
import {
  getGasPrice,
  estimateGas
} from 'utils/web3'

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
    async write() {

      if (this.isMetamask) {
        let gasPrice = await getGasPrice()
        let encoded = '0x' + abi.simpleEncode('bet(uint256)', 1).toString('hex')

        // 多个变量 
        // inputsTypeA, inputsTypeB是abi中inputs的type，多个用逗号隔开
        // outputsTypeA, outputsTypeB是abi中outputs的type，多个用逗号隔开
        // inputParameterA, inputParameterB是要传过去的参数，多个用逗号隔开
        // const encoded = '0x' + abi.simpleEncode("functionName(inputsTypeA, inputsTypeB):(outputsTypeA, outputsTypeB)", inputParameterA, inputParameterB).toString('hex')
        // 
        // 没有返回，即abi中这个function的outputs为空
        // const encoded = '0x' + abi.simpleEncode("functionName(inputsTypeA)", inputParameterA).toString('hex')
        // 
        // 没有入参
        // const encoded = '0x' + abi.methodID('functionName', []).toString('hex')


        let rawTx = {
          gasPrice: gasPrice,
          value: window.web3.toWei(this.amount, 'ether'),
          from: this.address[0],
          data: encoded,
          to: contractAddr
        }
        let gas = await estimateGas(rawTx)
        rawTx.gas = gas

        this.casino.bet(1, rawTx, (err, result, data) => {
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
