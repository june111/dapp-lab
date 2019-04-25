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
          <v-list-tile v-for="(item, i) in items" :key="'menu-'+i" @click="handleSetting(item)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-toolbar-title>My zombies</v-toolbar-title>
    </v-toolbar>
    <v-btn color="info" @click="test">test</v-btn>
    <!-- ---------------- zombies ---------------- -->
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 md6 v-for="item,index in zombieList" :key="'zombieList-'+index">
          <div v-if="showZombie">
            <ZombieChar :zombieName="item.name" :zombieDescription="'Level '+item.level" :skinColorChoice="item.zombieDetails.skinColorChoice" :clothesColorChoice="item.zombieDetails.clothesColorChoice" :eyeColorChoice="item.zombieDetails.eyeColorChoice" :headChoice="item.zombieDetails.headChoice" :shirtChoice="item.zombieDetails.shirtChoice" :eyeChoice="item.zombieDetails.eyeChoice" :hideNameField="false" />
          </div>
        </v-flex>
        <!-- <v-flex xs6> 
          <v-btn color="info" @click="isBattle = true">Battle</v-btn> 
               <div v-if="isBattle == true">
              <ZombieChar :zombieName="targetZombieName" :autoGenerate="true" :hideNameField="false" v-on:currentDna="currentDna" />
            </div> 
           </v-flex> -->
      </v-layout>
      <v-layout v-if="!showZombie">
        <router-link to="/create">Go to create</router-link>
      </v-layout>
    </v-container>
    <!-- ---------------- dialog ---------------- -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Transfer From</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Address" required v-model="transferToAddr"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="handleTransferForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="chooseZombieDialog" scrollable max-width="600px">
      <v-card>
        <v-card-title>Select a zombie to {{textMap[dialogStatus]}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-if="dialogStatus =='levelUp'" v-model="chooseMyZombieId" column>
            <template v-for="item in zombieList">
              <v-radio :label="item.name" :value="item.zombieId"></v-radio>
            </template>
          </v-radio-group>
          <div v-else>
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs6>
                  My zombie
                  <v-radio-group v-model="chooseMyZombieId" column>
                    <template v-for="item in zombieList">
                      <v-radio :label="item.name +' ('+ (toNum(timeNow) > toNum(item.readyTime)*1000? 'Ready':'Not Ready') + ')'" :value="item.zombieId" :disabled="toNum(timeNow) > toNum(item.readyTime)*1000? false:true"></v-radio>
                    </template>
                  </v-radio-group>
                </v-flex>
                <v-flex xs6>
                  target zombie
                  <v-radio-group v-model="chooseTargetZombieId" column>
                    <template v-for="item in targetZombieList">
                      <v-radio :label="item.name +' ('+ (toNum(timeNow) > toNum(item.readyTime)*1000? 'Ready':'Not Ready') + ')'" :value="item.zombieId" :disabled="toNum(timeNow) > toNum(item.readyTime)*1000? false:true"></v-radio>
                    </template>
                  </v-radio-group>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="chooseZombieDialog = false">Close</v-btn>
          <v-btn v-if="dialogStatus =='levelUp'" color="blue darken-1" flat @click="levelUpSubmit">Level Up</v-btn>
          <v-btn v-else color="blue darken-1" flat @click="attackSubmit" :disabled="chooseMyZombieId && chooseTargetZombieId?false:true">Attack</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Loading v-if="isLoading" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import abi from 'ethereumjs-abi'
import {
  ABI,
  ZombieOwnershipRopstenAddr
} from 'contracts/cryptozombies/abi'
import { toNum, random, compareArrayData } from 'utils'
import { getWeb3Filter } from './../utils/handleEventLog'
import {
  callForContract,
  getGasPrice,
  estimateGas
} from 'utils/web3'

import ZombieChar from './../components/ZombieChar.vue'
import Loading from '@/components/loading.vue'
const timeNow = new Date().getTime()
export default {
  name: 'my-zombie',

  data() {
    return {
      items: [
        { title: 'Level Up' },
        { title: 'Transfer' },
        { title: 'Attack' },
      ],
      isLoading: true,
      toNum: toNum,

      timeNow: timeNow,

      zombiesContract: null,
      cryptoZombies: null,

      zombieList: [], // my zombie
      showZombie: false,

      allZombieList: [],
      targetZombieList: [],

      targetZombieDna: '',
      isBattle: false,

      textMap: {
        attack: 'Attack',
        levelUp: 'level up'
      },
      dialogStatus: '',

      dialog: false,
      transferToAddr: '',

      chooseZombieDialog: false,
      chooseMyZombieId: null,
      chooseTargetZombieId: null,

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

    targetZombieName: function() {
      return random(8)
    }
  },
  watch: {
    account: function(newValue, oldValue) {
      console.log('----------- account change -----------')
      if (newValue !== oldValue) this.getZombiesCount(this.account)
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
    test() {


    },


    setZombieContract() {
      // this.zombiesContract = web3.eth.contract(ZombieOwnershipABI);
      // this.cryptoZombies = this.zombiesContract.at(ZombieOwnershipRopstenAddr);

      this.cryptoZombies = web3.eth.contract(ABI).at(ZombieOwnershipRopstenAddr)
      console.log('----------- set Zombie Contract -----------')
      this.getZombiesCount(this.account)
    },

    // ------------------ get Zombies ---------------

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
    // @dev Cannot read property 'getZombiesByOwner' of null
    async getZombiesByOwner(owner) {
      this.cryptoZombies.getZombiesByOwner(owner, async (err, result) => {
        if (err) {
          console.error(err)
        } else {
          const len = result.length
          for (let i = 0; i < len; i++) {
            let index = toNum(result[i])
            let myzombie = await this.getZombiesByIndex(index)
            this.zombieList.push(myzombie)
          }
        }
      })
    },

    getZombiesByIndex(index) {
      return new Promise(async (resolve, reject) => {
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
            resolve(myzombie)
            // console.log(myzombie)
          }
        })
      })
    },

    async getAllZombie() {
      this.isLoading = true

      let eventsList = await getWeb3Filter(5466000, 'latest', ZombieOwnershipRopstenAddr, [web3.sha3('NewZombie(uint256,string,uint256)')], ABI)
      let len = eventsList.length

      for (let i = 0; i < len; i++) {
        let index = eventsList[i].events[0].value
        let myzombie = await this.getZombiesByIndex(index)
        this.allZombieList.push(myzombie)
      }

      this.targetZombieList.length === 0 ? this.targetZombieList = compareArrayData(this.zombieList, this.allZombieList, 'zombieId') : ''
    },

    listAllZombie() {
      this.allZombieList.length === 0 ? this.getAllZombie() : ''
    },

    // ------------------ Attack ---------------

    handleAttack() {
      this.chooseMyZombieId = null
      this.chooseTargetZombieId = null
      this.listAllZombie()
      this.dialogStatus = 'attack'
      this.chooseZombieDialog = true
      this.isLoading = false
    },
    attackSubmit() {
      this.chooseZombieDialog = false
      this.attack(this.chooseMyZombieId, this.chooseTargetZombieId)
    },
    async attack(zombieId, targetId) {
      let gasPrice = await getGasPrice()
      let encoded = '0x' + abi.simpleEncode('attack(uint256,uint256)', zombieId, targetId).toString('hex')
      let rawTx = {
        gasPrice: gasPrice,
        from: this.account,
        data: encoded,
        to: ZombieOwnershipRopstenAddr
      }
      let gas = await estimateGas(rawTx)
      rawTx.gas = gas
      console.log('rawTx', rawTx)
      this.cryptoZombies.attack(zombieId, targetId, rawTx, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
        }
      })
    },

    // ------------------ Level Up ---------------
    getLevelUpFee() {
      const encoded = '0x' + abi.methodID('levelUpFee', []).toString('hex')
      return new Promise(async (resolve, reject) => {
        let result = await callForContract(ZombieOwnershipRopstenAddr, encoded)
        resolve(toNum(result))
      })
    },

    handleLevelUp() {
      this.dialogStatus = 'levelUp'
      this.chooseZombieDialog = true
    },
    levelUpSubmit() {
      this.chooseZombieDialog = false
      this.goLevelUp(this.chooseMyZombieId)

    },
    async goLevelUp(zombieId) {
      let levelUpFee = await this.getLevelUpFee() / Math.pow(10, 18)
      this.levelUp(zombieId, levelUpFee)
    },
    levelUp(zombieId, levelUpFee) {
      this.cryptoZombies.levelUp(zombieId, {
        from: this.account,
        value: web3.toWei(levelUpFee, 'ether'),
        to: ZombieOwnershipRopstenAddr
      }, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
        }
      })
    },


    // ------------------ Transfer ---------------
    handleTransfer() {
      this.dialog = true
    },
    handleTransferForm() {
      this.dialog = false
      this.transferFrom(this.account, this.transferToAddr, 1)
    },
    transferFrom(from, to, zombieId) {
      this.cryptoZombies.transferFrom(from, to, zombieId, {
        from: this.account,
        to: ZombieOwnershipRopstenAddr
      }, (err, result) => {
        if (err) {
          console.error(err)
        } else {
          console.log('result', result)
        }
      })
    },

    handleSetting(item) {
      const type = item.title
      switch (type) {
        case 'Level Up':
          this.handleLevelUp()
          break;
        case 'Transfer':
          this.handleTransfer()
          break;
        case 'Attack':
          this.handleAttack()
          break;
        default:
          console.log('Just wait');
      }

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
<style lang="scss" scoped>
</style>
