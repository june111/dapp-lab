<template>
  <div>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm6 md6>
          <v-text-field label="Name" placeholder="Name" v-model="zombieName"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 md6>
          <v-text-field label="Description" placeholder="Description" v-model="zombieDescription"></v-text-field>
        </v-flex>
        <template v-for="item in Choice">
          <v-flex xs12>
            <v-subheader class="pl-0">{{item.name}}</v-subheader>
            <v-slider color="red" thumb-color="red" thumb-label="always" v-model="item.typeChoice" :max="item.max" :min="1" :step="1"></v-slider>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
    <!-- <ZombieChar optionalDNA="1337133713371337" :zombieName="zombieName" :zombieDescription="zombieDescription" :skinColorChoice="skinColorChoice" :clothesColorChoice="clothesColorChoice" :eyeColorChoice="eyeColorChoice" :headChoice="headChoice" :shirtChoice="shirtChoice" :eyeChoice="eyeChoice" /> -->
  </div>
</template>
<script>
import {
  ZombieFactoryABI,
  ZombieFeedingABI,
  ZombieAttackABI,
  ZombieHelperABI,
  ZombieOwnershipABI,
  ZombieFactoryRopstenAddr,
  ZombieFeedingRopstenAddr,
  ZombieAttackRopstenAddr,
  ZombieHelperRopstenAddr,
  ZombieOwnershipRopstenAddr
} from 'contracts/cryptozombies/abi'
import { toNum } from 'utils'
import ZombieChar from './ZombieChar.vue'

const Choice = [{
    typeChoice: 1,
    max: 7,
    name: 'Head Gene',
  },
  {
    typeChoice: 1,
    max: 11,
    name: 'Eye Gene',
  },
  {
    typeChoice: 1,
    max: 6,
    name: 'Shirt Gene',
  },
  {
    typeChoice: 1,
    max: 360,
    name: 'Skin Color Gene',
  },
  {
    typeChoice: 1,
    max: 360,
    name: 'Eye Color Gene',
  },
  {
    typeChoice: 1,
    max: 360,
    name: 'Clothes Color Gene',
  }
]
export default {
  created() {
    // this.getWeb3()
    // this.setContract()
  },
  data() {
    return {
      zombiesContract: undefined,
      cryptoZombies: undefined,
slider:1,
      zombieName: 'Noname',
      zombieDescription: '',
      Choice: [{
    typeChoice: 1,
    max: 7,
    name: 'Head Gene',
  },
  {
    typeChoice: 1,
    max: 11,
    name: 'Eye Gene',
  },
  {
    typeChoice: 1,
    max: 6,
    name: 'Shirt Gene',
  },
  {
    typeChoice: 1,
    max: 360,
    name: 'Skin Color Gene',
  },
  {
    typeChoice: 1,
    max: 360,
    name: 'Eye Color Gene',
  },
  {
    typeChoice: 1,
    max: 360,
    name: 'Clothes Color Gene',
  }
],
    }
  },
  components: {
    ZombieChar
  },
  computed: {
    // headChoice: function() {
    //   return this.Choice[0].typeChoice
    // },
    // eyeChoice: function() {
    //   return this.Choice[1].typeChoice
    // },
    // shirtChoice: function() {
    //   return this.Choice[2].typeChoice
    // },
    // skinColorChoice: function() {
    //   return this.Choice[3].typeChoice
    // },
    // eyeColorChoice: function() {
    //   return this.Choice[4].typeChoice
    // },
    // clothesColorChoice: function() {
    //   return this.Choice[5].typeChoice
    // },
  },
  methods: {
    test(){

    },
    getWeb3() {
      this.$store.dispatch('registerWeb3')
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
