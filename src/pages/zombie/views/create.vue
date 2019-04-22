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
import { mapState, mapGetters } from 'vuex'
import {
  ZombieOwnershipABI,
  ZombieOwnershipRopstenAddr
} from 'contracts/cryptozombies/abi'
import ZombieChar from './../components/ZombieChar.vue'

export default {
  name: 'create-zombie',
  created() {
    // this.getWeb3()
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
  watch: {
    hvProvider: function(newValue, oldValue) {
      if (newValue) {
        // this.setZombieContract()
      }
    },
  },
  computed: {
    ...mapState({
      // 账户地址
      account: state => state.web3.account,
      hvProvider: state => state.hvProvider

    }),
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
    getWeb3() {
      this.$store.dispatch('registerWeb3')
    },
    setZombieContract() {
      this.zombiesContract = web3.eth.contract(ZombieOwnershipABI);
      this.cryptoZombies = this.zombiesContract.at(ZombieOwnershipRopstenAddr);
      console.log('Set Contract!')
    },


    handleCreate() {
      this.cryptoZombies.createRandomZombie(this.zombieName, {
        gas: 300000, //Gas Limit 300000
        gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
        from: this.account
      }, (err, result, data) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
        }
      })
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
