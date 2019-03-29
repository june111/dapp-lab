<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">合约信息</h3>
        <p>分别从第三方接口和合约获得指定 token 合约的信息，包括 token 的名字，符号，精度，总量等</p>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-title primary-title>
      <div>
        <h3 class="mb-0">使用 Ethplorer API</h3>
      </div>
    </v-card-title>
    <v-container grid-list-md text-xs-center>
      <v-layout row>
        <v-flex xs7 sm10>
          <v-text-field v-model="address" label="address"></v-text-field>
        </v-flex>
        <v-flex xs2 sm2>
          <v-btn color="blue" dark @click="checkAPI">查询合约信息</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-text v-if="logEthplorerRes">
      <div v-html="logEthplorerRes"></div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title primary-title>
      <div>
        <h3 class="mb-0">使用合约</h3>
      </div>
    </v-card-title>
    <v-container grid-list-md text-xs-center>
      <v-layout row>
        <v-flex xs7 sm10>
          <v-text-field v-model="contractAddr" label="address"></v-text-field>
        </v-flex>
        <v-flex xs2 sm2>
          <v-btn color="blue" dark @click="checkContract">查询合约信息</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card-text v-if="logContractRes">
      <div v-html="logContractRes"></div>
    </v-card-text>
  </v-card>
</template>
<script type="text/javascript">
import Web3 from 'web3'
import { toNum, syntaxHighlight, hex2str } from '../../util'

export default {
  data() {
    return {
      myContract: null,
      contractIns: null,

      address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      contractAddr: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      logEthplorerRes: '',
      logContractRes: '',
      selected: [2],
      items: [{
        action: '15 min',
        headline: 'Brunch this weekend?',
        title: 'Ali Connors',
        subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      }, ]
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getWeb3()

    })
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
    checkContract() {
      const minABI = [
        { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" },
      ];

      this.myContract = window.web3.eth.contract(minABI);
      this.contractIns = this.myContract.at(this.contractAddr);

      let decimals = new Promise((resolve, reject) => {
        this.contractIns.decimals((error, decimals) => {
          resolve(toNum(decimals))
        })
      })
      let symbol = new Promise((resolve, reject) => {
        this.contractIns.symbol((error, symbol) => {
          resolve(symbol)
        })
      })
      let name = new Promise((resolve, reject) => {
        this.contractIns.name((error, name) => {
          resolve(name)
        })
      })
      let totalSupply = new Promise((resolve, reject) => {
        this.contractIns.totalSupply((error, totalSupply) => {
          resolve(toNum(totalSupply))
        })
      })
      let owner = new Promise((resolve, reject) => {
        this.contractIns.owner((error, owner) => {
          resolve(owner)
        })
      })
      Promise.all([decimals, symbol, name, totalSupply, owner]).then(res => {
        let data = {
          address: this.contractAddr,
          name: hex2str(res[2]),
          decimals: res[0],
          symbol: hex2str(res[1]),
          totalSupply: res[3],
          owner: res[4],
        }
        this.logContractRes = syntaxHighlight(data)
      })

    },

    checkAPI() {
      let res = new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('post', 'https://api.ethplorer.io/getTokenInfo/' + this.address + '?apiKey=freekey')
        request.onload = function() {
          let res = JSON.parse(request.response)
          resolve(res)
        };
        request.send()
      })

      res.then(data => {
        this.logEthplorerRes = syntaxHighlight(data)
      })

    }
  },

}

</script>
<style>
pre {
  outline: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}

.string {
  color: green;
}

.number {
  color: darkorange;
}

.boolean {
  color: blue;
}

.null {
  color: magenta;
}

.key {
  color: red;
}

</style>
