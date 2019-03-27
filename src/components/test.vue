<template>
  <div>
    <p>{{address[0]}}</p>
    <hr><hr>
    <button @click="load">读数据</button>
    <p>读取结果：{{contractBalance}}</p>
    <br><hr><hr>
    <input type="test" v-model="amount">
    <button @click="write">写数据 </button>
    <p>TxHash：{{tx}}</p>
    <br>
    <hr>
    <hr>
    <button @click="requestSignature">单行信息签名 </button>
    <br><br>
    <input v-model="name">
    <input v-model="email">
    <button @click="requestMoreSignature">多行信息签名 </button>
    <br><br>
    <button @click="requestMoreSignature_v3">多行信息签名2 </button>
  </div>
</template>
<script>
import Web3 from 'web3'
import { ABI, contractAddr } from '../contract/info'
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
      casinoContract: undefined,
      casino: undefined,
      tx: '',
      contractBalance: '',

      address: '',
      name:'june',
      email:'123@qq.com'
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
    requestSignature() {

      const from = web3.eth.accounts[0];
      const msg = web3.toHex("Hello from Junezhu.top")
      var params = [msg, from]

      // web3.personal.sign(msg, from, (err, result) => {
      //   alert(result)
      // });

      var method = 'personal_sign'
      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function(err, result) {
        if (err) return console.error(err)
        if (result.error) return console.error(result.error)
        console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

        console.log('recovering...')
        const msgParams = { data: msg }
        msgParams.sig = result.result

        method = 'personal_ecRecover'
        var params = [msg, result.result]
        web3.currentProvider.sendAsync({
          method,
          params,
          from,
        }, function(err, result) {
          var recovered = result.result
          console.log('ec recover called back:')
          console.dir({ err, recovered })
          if (err) return console.error(err)
          if (result.error) return console.error(result.error)


          if (recovered === from) {
            console.log('Successfully ecRecovered signer as ' + from)
            alert('Successfully ecRecovered signer as ' + from)
          } else {
            console.log('Failed to verify signer when comparing ' + result + ' to ' + from)
          }

        })
      })


    },
    requestMoreSignature() {

      const from = web3.eth.accounts[0];
      const msgParams = [
        { type: "string", name: "Msg", value: "Create Account" },
        { type: "string", name: "Name", value: this.name },
        { type: "string", name: "Email", value: this.email }
      ];
      var params = [msgParams, from]
      var method = 'eth_signTypedData'


      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function(err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          alert(result.error.message)
        }
        if (result.error) return console.error(result)
        console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

        const recovered = sigUtil.recoverTypedSignatureLegacy({ data: msgParams, sig: result.result })

        if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
          alert('Successfully ecRecovered signer as ' + from)
        } else {
          alert('Failed to verify signer when comparing ' + result + ' to ' + from)
        }

      })


    },
    requestMoreSignature_v3() {

      const msgParams = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" }
          ],
          Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" }
          ],
          Mail: [
            { name: "from", type: "Person" },
            { name: "to", type: "Person" },
            { name: "contents", type: "string" }
          ]
        },
        primaryType: "Mail",
        domain: { name: "Ether Mail", version: "1", chainId: 3, verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" },
        message: {
          from: { name: "Cow", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826" },
          to: { name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" },
          contents: "Hello, Bob!"
        }
      })


      var from = web3.eth.accounts[0]

      console.log('CLICKED, SENDING PERSONAL SIGN REQ', 'from', from, msgParams)
      var params = [from, msgParams]
      console.dir(params)
      var method = 'eth_signTypedData_v3'

      web3.currentProvider.sendAsync({
        method,
        params,
        from,
      }, function(err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          alert(result.error.message)
        }
        if (result.error) return console.error('ERROR', result)
        console.log('TYPED SIGNED:' + JSON.stringify(result.result))

        const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })

        if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
          alert('Successfully ecRecovered signer as ' + from)
        } else {
          alert('Failed to verify signer when comparing ' + result + ' to ' + from)
        }

      })
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
