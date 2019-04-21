<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline mb-0">Message signing for smart contracts</h3>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      Sign for "Hello from Junezhu.top"
      <v-btn color="blue" dark @click="requestSignature">单行信息签名</v-btn>
    </v-card-text>
    <v-divider></v-divider>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs6 sm4>
          <v-text-field v-model="name" label="name"></v-text-field>
        </v-flex>
        <v-flex xs6 sm5>
          <v-text-field v-model="email" label="email"></v-text-field>
        </v-flex>
        <v-flex xs12 sm3>
          <v-btn color="blue" dark @click="requestMoreSignature">多行信息签名</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-divider></v-divider>
    <v-card-title>
      <v-btn color="blue" dark @click="requestMoreSignature_v3">信息带对象的签名</v-btn>
    </v-card-title>
  </v-card>
</template>
<script>
import Web3 from 'web3'
import { toNum } from 'utils'

var sigUtil = require('eth-sig-util')
var ethUtil = require('ethereumjs-util')
export default {
  created() {

  },
  data() {
    return {
      name: 'june',
      email: '123@qq.com'
    }
  },
  methods: {

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

  }
}

</script>
