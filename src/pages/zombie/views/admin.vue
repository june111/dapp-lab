<template>
  <div>
    <v-toolbar color="pink" dark>
      <!-- ---------------- setting ---------------- -->
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn dark icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile v-for="(item, i) in items" :key="i" @click="">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-toolbar-title>Admin</v-toolbar-title>
    </v-toolbar>
    <!-- ---------------- zombies ---------------- -->
    <v-container fluid grid-list-lg>
      <template v-for="item in zombieList">
        <v-layout row wrap >
          <v-flex xs6>
            <ZombieChar :zombieName="item.name" :zombieDescription="'Level '+item.level" :skinColorChoice="item.zombieDetails.skinColorChoice" :clothesColorChoice="item.zombieDetails.clothesColorChoice" :eyeColorChoice="item.zombieDetails.eyeColorChoice" :headChoice="item.zombieDetails.headChoice" :shirtChoice="item.zombieDetails.shirtChoice" :eyeChoice="item.zombieDetails.eyeChoice" :hideNameField="false" />
          </v-flex>
       
        </v-layout>
      </template>
  
    </v-container>
    <Loading v-if="isLoading" />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import abi from 'ethereumjs-abi'
import {
  ABI,
  ZombieOwnershipRopstenAddr
} from 'contracts/cryptozombies/abi'
import { toNum, random } from 'utils'
import { callForContract } from 'utils/web3'

import ZombieChar from './../components/ZombieChar.vue'
import Loading from '@/components/loading.vue'
export default {
  name: 'admin',

  data() {
    return {
      items: [
        { title: 'Change DNA' },
        { title: 'Change Name' },
      ],
      isLoading: true,

      zombiesContract: undefined,
      cryptoZombies: undefined,

      zombieList: [],

    }
  },
  components: {
    ZombieChar,
    Loading
  },
  computed: {
    ...mapState({
      // 账户地址
      account: state => state.web3.account,
      hvProvider: state => state.hvProvider

    }),
    ...mapGetters([
      // 账户eth余额
      'balance'
    ]),
  
  },
  watch: {
    account: function(newValue, oldValue) {
      if (newValue !== oldValue) this.getZombiesCount(this.account)
    },
    balance: function(newValue, oldValue) {
      console.log('-----------oldValue-----------', oldValue)
    },
  },

  beforeCreate() {
    console.log('registerWeb3 Action dispatched from my-zombie')
    this.$store.dispatch('registerWeb3')
  },
  created() {
    let time = setInterval(() => {
      if (this.account) clearInterval(time)
      this.setZombieContract()
    }, 1000)
    console.log('-----------balance-----------', this.balance)

  },
  mounted() {},
  beforeDestroy() {
    this.zombiesContract = null
    this.cryptoZombies = null
    console.log('destroyed')
  },

  methods: {
    // getWeb3() {
    //   this.$store.dispatch('registerWeb3')
    // },

    setZombieContract() {
      // this.zombiesContract = web3.eth.contract(ZombieOwnershipABI);
      // this.cryptoZombies = this.zombiesContract.at(ZombieOwnershipRopstenAddr);

      this.cryptoZombies = web3.eth.contract(ZombieOwnershipABI).at(ZombieOwnershipRopstenAddr)
      console.log('setZombieContract')
      this.getZombiesCount(this.account)
    },
    async getZombiesCount(owner) {
      this.zombieList = []
      console.log('owner', owner)
      let encoded = '0x' + abi.simpleEncode('balanceOf(address):(uint256)', owner).toString('hex')
      this.isLoading = false

      let result = await callForContract(ZombieOwnershipRopstenAddr, encoded)
      let count = toNum(result)
      this.getZombies(count)

    },
    getZombies(count) {
      if (count === 0) {
        this.showZombie = false
      } else {
        this.showZombie = true
        this.getZombiesByOwner(this.account)
      }
    },
    // @dev 多个的情况
    getZombiesByOwner(owner) {
      this.cryptoZombies.getZombiesByOwner(owner, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          // for(let i in result){

          // }
          let index = toNum(result)
          this.getZombiesByIndex(index)
        }
      })
    },
    getZombiesByIndex(index) {
      this.cryptoZombies.zombies(index, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          let myzombie = {
            zombieId: index,
            name: result[0],
            dna: String(toNum(result[1])),
            level: toNum(result[2]),
            readyTime: toNum(result[3]),
            winCount: toNum(result[4]),
            lossCount: toNum(result[5]),
            zombieDetails: this.generateZombie(result[0], String(toNum(result[1])))
          }
          this.zombieList.push(myzombie)
          console.log(myzombie)
        }
      })
    },
    // take the Zombie dna, and update our image
    generateZombie(name, dna) {
      let dnaStr = String(dna)
      // pad DNA with leading zeroes if it's less than 16 characters
      while (dnaStr.length < 16)
        dnaStr = "0" + dnaStr

      let zombieDetails = {
        // first 2 digits make up the head. We have 7 possible heads, so % 7
        // to get a number 0 - 6, then add 1 to make it 1 - 7. Then we have 7
        // image files named "head1.png" through "head7.png" we load based on
        // this number:
        headChoice: dnaStr.substring(0, 2) % 7 + 1,
        // 2nd 2 digits make up the eyes, 11 variations:
        eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
        // 6 variations of shirts:
        shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
        // last 6 digits control color. Updated using CSS filter: hue-rotate
        // which has 360 degrees:
        skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
        eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
        clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
        zombieName: name,
        zombieDescription: "A Level 1 CryptoZombie",
      }
      return zombieDetails
    },

    currentDna(currentDna) {
      this.targetZombieDna = currentDna
      console.log('currentDna', currentDna)
    },



  }
}

</script>
<style lang="scss">
</style>
