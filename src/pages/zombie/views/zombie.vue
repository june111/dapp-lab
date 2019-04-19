<template>
  <div>
    content
    <ZombieChar optionalDNA="1337133713371337" zombieName="June" skinColorChoice="1" eyeColorChoice="2" clothesColorChoice="3" headChoice="3" />
  </div>
</template>
<script>
import Web3 from 'web3'
import { ABI, contractAddr } from 'contracts/cryptozombies/abi'
import { toNum } from 'utils'
import ZombieChar from './ZombieChar.vue'
export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  data() {
    return {
      amount: 0.001,
      isMetamask: false,
      zombiesContract: undefined,
      cryptoZombies: undefined,
      tx: '',
      contractBalance: '',

      address: '',

    }
  },
  components: {
    ZombieChar
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
      this.zombiesContract = window.web3.eth.contract(ABI);
      this.cryptoZombies = this.zombiesContract.at(contractAddr);
      console.log('Set Contract!')
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
    },


    getZombieDetails(id) {
      return this.cryptoZombies.zombies(id).call()
    },
    zombieToOwner(id) {
      return this.cryptoZombies.zombieToOwner(id).call()
    },

    getZombiesByOwner(owner) {
      return this.cryptoZombies.getZombiesByOwner(owner).call()
    },
  }
}

</script>
