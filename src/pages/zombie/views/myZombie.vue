<template>
  <div>
    <v-toolbar color="pink" dark>
      <v-toolbar-title>My zombies</v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-lg>
      <template v-for="item in zombieList">
        <v-layout row wrap v-if="showZombie">
          <v-flex xs6>
            <ZombieChar :zombieName="item.name" :zombieDescription="'Level '+item.level" :skinColorChoice="item.zombieDetails.skinColorChoice" :clothesColorChoice="item.zombieDetails.clothesColorChoice" :eyeColorChoice="item.zombieDetails.eyeColorChoice" :headChoice="item.zombieDetails.headChoice" :shirtChoice="item.zombieDetails.shirtChoice" :eyeChoice="item.zombieDetails.eyeChoice" :hideNameField="false" />
          </v-flex>
          <v-flex xs6>
            <v-btn color="info" @click="isBattle = true">Battle</v-btn>
            <v-btn color="error" @click="handleAttack">Attack</v-btn>
            <div v-if="isBattle == true">
              <ZombieChar :zombieName="targetZombieName" :autoGenerate="true" :hideNameField="false" v-on:currentDna="currentDna" />
            </div>
          </v-flex>
        </v-layout>
      </template>
      <v-layout v-if="!showZombie">
        <!-- <router-link to="/create">Go to create</router-link> -->
        <router-link to="/home">Go to create</router-link>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import abi from 'ethereumjs-abi'
import {
  ZombieOwnershipABI,
  ZombieOwnershipRopstenAddr
} from 'contracts/cryptozombies/abi'
import { toNum, random } from 'utils'
import { callForContract } from 'utils/web3'

import ZombieChar from './../components/ZombieChar.vue'

export default {
  name: 'my-zombie',

  data() {
    return {
      zombiesContract: undefined,
      cryptoZombies: undefined,

      zombieList: [],
      showZombie: false,

      targetZombieDna: '',
      isBattle: false,

    }
  },
  components: {
    ZombieChar
  },
  computed: {
    ...mapState({
      // 账户地址
      account: state => state.web3.account,
      hvProvider: state => state.hvProvider

    }),
    targetZombieName: function() {
      return random(8)
    }
  },
  watch: {

  },

  beforeCreate() {
    console.log('registerWeb3 Action dispatched from my-zombie')
    this.$store.dispatch('registerWeb3')
  },
  created() {},
  beforeDestroy() {
    this.zombiesContract = null
    this.cryptoZombies = null
    console.log('destroyed')
  },
  mounted() {
    let time = setInterval(() => {
      if (this.account) clearInterval(time)
      this.setZombieContract()
    }, 1000)

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
      console.log('this.account', this.account)

    },
    async getZombiesCount(owner) {
      console.log('owner', owner)
      let encoded = '0x' + abi.simpleEncode('balanceOf(address):(uint256)', owner).toString('hex')

      // let result = await callForContract(ZombieOwnershipRopstenAddr, encoded)
      // let count = toNum(result)
      // this.getZombies(count)

    },
    getZombies(count) {
      if (count === 0) {
        this.showZombie = false
      } else {
        this.showZombie = true
        for (let i = 0; i < count; i++) {
          // this.getZombiesByContract(i)
        }
      }
    },

    getZombiesByContract(index) {
      this.cryptoZombies.zombies(index, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          let myzombie = {
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
    handleAttack() {
      this.attack(0, 0)
    },
    attack(_zombieId, _targetId) {
      this.cryptoZombies.attack(_zombieId, _targetId, {
        from: this.account,
        to: ZombieOwnershipRopstenAddr
      }, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
        }
      })
    }

  }
}

</script>
<style lang="scss">
</style>
