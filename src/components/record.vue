<template>
  <div class="wrap">
    <h3>Ropsten Only</h3>
    {{countryList}}
    <button @click="getTotalCountry">getTotalCountry</button>
    <img v-if="pending" class="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" />
    <button @click="getNote">List</button>
    <input type="text" @model="createName" />
    <button @click="createNote">Add</button>
    {{createCost}}
    <input type="text" @model="updateName" />
    <button @click="updateNote">Update</button>
    <input type="text" @model="deleteName" />
    <button @click="deleteNote">Delete</button>
  </div>
</template>
<script>
import Web3 from 'web3'
// import abi from 'ethereumjs-abi'
import { parseTime } from '../util'
import {
  recordABI,
  recordContractAddr
} from '../contract/Record/abi'

export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  data() {
    return {
      //初始化web3
      web3: undefined,
      isMetamask: false,

      //合约提供的数据
      //实例化合约
      RecordContract: undefined,
      Record: undefined, // 合约实例

      pending: false,

      myAddress: '',

      createName: '',
      createCost: '',
      updateName: '',
      deleteName: '',
      countryList: [],


    }
  },
  methods: {
    getWeb3() {

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
    },

    setContract() {
      this.RecordContract = window.web3.eth.contract(recordABI);
      this.Record = this.RecordContract.at(recordContractAddr);
      console.log('Set Contract!')
    },
    getAccount() {

      if (this.isMetamask) {
        //设置账户
        window.web3.eth.accounts[0] ? this.myAddress = window.web3.eth.accounts[0] : alert('Please login to Metamask')
      } else {
        window.web3.eth.accounts[0] = this.myAddress
      }
    },
    getTotalCountry() {
      if (this.isMetamask) {
        this.Record.getTotalCountries((err, result) => {
          if (err) {
            console.log(err)
          } else {
            let countryNum = parseInt(result, 16)
            for (var i = 0; i <= countryNum-1; i++) {
              console.log('i', i)
              this.getCountryList(countryNum)
            }

          }
        })

      }
    },
    getCountryList(num) {
      this.Record.countries(num, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log('getCountryList', result)
          let newData = {
            name: result[0],
            leader: result[1],
            population: result[2],
          }
          this.countryList.push(newData)
        }
      })
    },
    getNote() {
      if (this.isMetamask) {

      }
    },
    createNote() {

      if (this.isMetamask) {
        this.Record.insert("aaa", "june", 100, {
            from: window.web3.eth.accounts[0],
          },
          (err, result) => {
            if (err) {
              console.log(err)
            } else {
              console.log('tx', result)
              let start = new Date().getTime()

              let detection = this.Record.CountryEvent()
              detection.watch((err, result) => {
                if (err) {
                  console.error(err)
                } else {
                  this.pending = false

                  console.log('args', result)
                  detection.stopWatching();
                  let end = new Date().getTime(); // 结束时间
                  this.createCost = 'Cost: ' + parseTime((end - start), '{i}:{s}')

                }
              })
            }
          });


      }
    },

    updateNote() {

      if (this.isMetamask) {

      }
    },
    deleteNote() {

      if (this.isMetamask) {

      }
    }

  }
}

</script>
<style>
.wrap {
  margin: 8vh auto;
  text-align: center;
}

.loader {
  display: block;
  width: 30px;
  margin: 0 auto;
}

</style>
