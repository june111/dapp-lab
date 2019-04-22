<template>
  <div>
    <v-toolbar color="pink" dark>
      <v-toolbar-title>Create a zombie</v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs6>
          <ZombieChar :zombieName="zombieName" :zombieDescription="zombieDescription" :skinColorChoice="skinColorChoice" :clothesColorChoice="clothesColorChoice" :eyeColorChoice="eyeColorChoice" :headChoice="headChoice" :shirtChoice="shirtChoice" :eyeChoice="eyeChoice" :hideNameField="true" />
          <div class="action-zombie">
            <v-flex xs12>
              <v-text-field label="Name" v-model="zombieName"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Description" v-model="zombieDescription"></v-text-field>
            </v-flex>
            <v-btn color="success" @click="handleCreate">Create Random Zombie</v-btn>
          </div>
        </v-flex>
        <v-flex xs6>
          <template v-for="item in Choice">
            <v-flex xs12>
              <v-subheader class="pl-0">{{item.name}}</v-subheader>
              <v-slider color="red" thumb-color="red" thumb-label v-model="item.typeChoice" :max="item.max" :min="1" :step="1"></v-slider>
            </v-flex>
          </template>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import {
  ZombieOwnershipABI,
  ZombieOwnershipRopstenAddr
} from 'contracts/cryptozombies/abi'
import { toNum } from 'utils'
import ZombieChar from './../components/ZombieChar.vue'

export default {
  created() {
    this.setZombieFactoryContract()
  },
  data() {
    return {
      zombiesContract: undefined,
      cryptoZombies: undefined,
      zombieName: 'Bob',
      zombieDescription: 'A Level 1 CryptoZombie',
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
    headChoice: function() {
      return this.Choice[0].typeChoice
    },
    eyeChoice: function() {
      return this.Choice[1].typeChoice
    },
    shirtChoice: function() {
      return this.Choice[2].typeChoice
    },
    skinColorChoice: function() {
      return this.Choice[3].typeChoice
    },
    eyeColorChoice: function() {
      return this.Choice[4].typeChoice
    },
    clothesColorChoice: function() {
      return this.Choice[5].typeChoice
    },
    optionalDNA: function() {

      function addZero(str) {
        str < 10 ? str = '0' + str : str
        return str
      }

      function trans2dna(str) {
        str >= 100 ? str = Math.ceil(str / 360 * 100) : str
        return str
      }

      let dna = addZero(this.headChoice) + addZero(this.eyeChoice) + addZero(this.shirtChoice) + trans2dna(this.skinColorChoice) + trans2dna(this.eyeColorChoice) + trans2dna(this.clothesColorChoice) + '9999'

      return dna
    },
  },
  methods: {
    handleCreate() {
      this.cryptoZombies.createRandomZombie(this.zombieName, {
        gas: 300000, //Gas Limit 300000
        gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
        from: window.web3.eth.coinbase
      }, (err, result, data) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
        }
      })
    },
   
    setZombieFactoryContract() {
      this.zombiesContract = window.web3.eth.contract(ZombieFactoryABI);
      this.cryptoZombies = this.zombiesContract.at(ZombieOwnershipRopstenAddr);
      console.log('Set Contract!')
    },
    // take the Zombie dna, and update our image
    generateZombie(id, name, dna) {
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
<style lang="scss">
.action-zombie {
  position: relative;
  top: 300px;
}
</style>
