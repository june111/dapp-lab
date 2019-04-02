<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">使用私钥发送交易</h3>
      </v-card-title>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs7 sm10>
            <v-text-field v-model="amount" label="amount"></v-text-field>
          </v-flex>
          <v-flex xs2 sm2>
            <v-btn color="blue" dark @click="write">发送</v-btn>
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
import EthereumTx from 'ethereumjs-tx'

import { ABI, contractAddr } from '../../contract/info'
import { toNum } from '../../util'
import {
  getGasPrice,
  estimateGas,
  getNonce
} from '../../util/web3'

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

      myAddress: '0x43a0603430c049e862fe4fd0985da9f9d735a138',
      myPrivateKey: '3b7525aeaad45f9eaa26406d0df55f9bd10f49b7ea55b5e1909aad4704f8a799',

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

      let encoded = '0x' + abi.simpleEncode("bet(uint256)", 1).toString('hex')
      let web3Nonce = await getNonce(this.myAddress)
      let gasPrice = await getGasPrice()

      // gas,gasPrice,value 单位是wei
      let txParams = {
        nonce: web3Nonce,
        gasPrice: gasPrice,
        value: web3.fromDecimal(web3.toWei(this.amount, 'ether')),
        to: contractAddr,
        from: this.myAddress,
        data: encoded,
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 3
      }
      let gas = await estimateGas(txParams)
      txParams.gas = gas

      const privateKey = Buffer.from(this.myPrivateKey, 'hex')
      const tx = new EthereumTx(txParams)
      tx.sign(privateKey)
      const serializedTx = tx.serialize()

      web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, result, data) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
          this.tx = result
        }
      });
    }
  }
}

</script>
