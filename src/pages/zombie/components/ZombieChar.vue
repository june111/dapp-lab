<template>
  <div class="zombie-char" v-images-loaded="zombieLoaded">
    <div class="zombie-loading zombie-parts" v-show="!isZombieLoaded"></div>
    <div class="zombie-parts-bg" v-show="isZombieLoaded" :class="partsVisible">
      <div class="zombie-parts" >
        <img :style="clothesColor" v-show="!catMode" class="left-feet" src="./../assets/zombieparts/left-feet-1@2x.png">
        <img :style="clothesColor" v-show="!catMode" class="right-feet" src="./../assets/zombieparts/right-feet-1@2x.png">
        <img :style="clothesColor" v-show="!catMode" class="left-leg" src="./../assets/zombieparts/left-leg-1@2x.png">
        <img :style="clothesColor" v-show="!catMode" class="right-leg" src="./../assets/zombieparts/right-leg-1@2x.png">
        <img :style="clothesColor" v-show="!catMode" class="left-thigh" src="./../assets/zombieparts/left-thigh-1@2x.png">
        <img :style="clothesColor" v-show="!catMode" class="right-thigh" src="./../assets/zombieparts/right-thigh-1@2x.png">
        <img :style="headColor" class="left-forearm" src="./../assets/zombieparts/left-forearm-1@2x.png">
        <img :style="headColor" class="right-forearm" src="./../assets/zombieparts/right-forearm-1@2x.png">
        <img :style="headColor" class="right-upper-arm" src="./../assets/zombieparts/right-upper-arm-1@2x.png">
        <img :style="clothesColor" class="torso" src="./../assets/zombieparts/torso-1@2x.png">
        <img :style="clothesColor" v-show="catMode" class="cat-legs" src="./../assets/zombieparts/catlegs.png">
        <img :style="clothesColor" :class="shirtClass(shirtChoice)"  :src="shirtSrc(shirtChoice)">
        <img :style="headColor" class="left-upper-arm" src="./../assets/zombieparts/left-upper-arm-1@2x.png">
        <img :style="headColor" class="left-forearm" src="./../assets/zombieparts/left-forearm-1@2x.png">
        <img :style="headColor" class="right-forearm" src="./../assets/zombieparts/right-forearm-1@2x.png">
        <img :style="headColor" class="left-hand" src="./../assets/zombieparts/hand1-1@2x.png">
        <img :style="headColor" class="right-hand" src="./../assets/zombieparts/hand-2-1@2x.png">
        <img :style="headColor" :class="headClass(headChoice)"  :src="headSrc(headChoice)">
        <img :style="eyeColor" :class="eyeClass(eyeChoice)"  :src="eyeSrc(eyeChoice)">
        <img class="mouth" src="./../assets/zombieparts/mouth-1@2x.png">
    </div>
      </div>
      <div :class="hideNameFieldClass">
        <div class="card-header bg-dark">
          <strong>{{zombieName}}</strong>
        </div>
        <small>{{currentZombieDescription}}</small>
      </div>
    </div>
</template>
<script>
import sha3 from 'js-sha3'
import bigInt from 'big-integer'
import imagesLoaded from 'vue-images-loaded'

export default {
  name: 'ZombieChar',
  directives: {
    imagesLoaded
  },
  props: {
    optionalDNA: {
      default: '',
      type: String
    },
    zombieName: {
      default: 'Billy',
      type: String
    },
    zombieDescription: String,
    hideNameField: {
      default: true,
      type: Boolean
    },
    skinColorChoice: {
      default: 1,
      type: [Number, String]
    },
    eyeColorChoice: {
      default: 1,
      type: [Number, String]
    },
    clothesColorChoice: {
      default: 1,
      type: [Number, String]
    },
    headChoice: {
      default: 1,
      type: [Number, String]
    },
    eyeChoice: {
      default: 1,
      type: [Number, String]
    },
    shirtChoice: {
      default: 1,
      type: [Number, String]
    },
    autoGenerate: {
      default: false,
      type: Boolean
    },
    catMode: {
      default: false,
      type: Boolean
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.$emit('currentDna', this.currentDna)

    })
  },
  data() {
    return {
      isZombieLoaded: false,
    }
  },
  computed: {
    currentDna: function() {
      if (this.optionalDNA) {
        return this.optionalDNA
      } else {
        let name = this.zombieName
        let hash = sha3.keccak256(name)
        let num = bigInt(hash, 16)
        num = num.mod(Math.pow(10, 16))
        let dnaStr = String(num)
        while (dnaStr.length < 16)
          dnaStr = "0" + dnaStr
        return dnaStr
      }

    },
    currentHeadChoice() {
      return this.autoGenerate ? (parseInt(this.currentDna.substring(0, 2)) % 7 + 1) : this.headChoice
    },
    currentEyeChoice() {
      return this.autoGenerate ? (parseInt(this.currentDna.substring(2, 4)) % 11 + 1) : this.eyeChoice
    },
    currentShirtChoice() {
      return this.autoGenerate ? (parseInt(this.currentDna.substring(4, 6)) % 6 + 1) : this.shirtChoice
    },
    currentSkinColorChoice() {
      return this.autoGenerate ? (parseInt(this.currentDna.substring(6, 8)) / 100 * 360) : this.skinColorChoice
    },
    currentEyeColorChoice() {
      return this.autoGenerate ? (parseInt(this.currentDna.substring(8, 10)) / 100 * 360) : this.eyeColorChoice
    },
    currentClothesColorChoice() {
      return this.autoGenerate ? (parseInt(this.currentDna.substring(10, 12)) / 100 * 360) : this.clothesColorChoice
    },
    headColor() {
      return this.getColor(this.currentSkinColorChoice);
    },
    eyeColor() {
      return this.getColor(this.currentEyeColorChoice);
    },
    clothesColor() {
      return this.getColor(this.currentClothesColorChoice);
    },
    partsVisible() {
      const headVisible = `head-visible-${this.currentHeadChoice}`
      const eyeVisible = `eye-visible-${this.currentEyeChoice}`
      const shirtVisible = `shirt-visible-${this.currentShirtChoice}`

      return `${headVisible} ${eyeVisible} ${shirtVisible}`
    },
    hideNameFieldClass() {
      return (!!this.hideNameField || !this.isZombieLoaded) ? "hide" : "zombie-card card bg-shaded"
    },
    currentZombieDescription() {
      return this.zombieDescription || 'default Zombie Description'
    }
  },
  methods: {
    headSrc(i) {
      return require("./../assets/zombieparts/head-" + i + "@2x.png")
    },
    eyeSrc(i) {
      return require("./../assets/zombieparts/eyes-" + i + "@2x.png")
    },
    shirtSrc(i) {
      return require("./../assets/zombieparts/shirt-" + i + "@2x.png")
    },
    headClass(i) {
      return `head head-part-${i}`;
    },
    eyeClass(i) {
      return `eye eye-part-${i}`;
    },
    shirtClass(i) {
      return `shirt shirt-part-${i}`;
    },
    zombieLoaded(instance) {
      var self = this;
      window.setTimeout(function() {
        self.isZombieLoaded = true
      }, 2050);
    },
    getColor(deg) {
      return `filter: hue-rotate(${deg}deg);`
    },
  },
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.zombie-loading {
  background: url('./../assets/zombieparts/zombierun.png') left center;
  // https://cryptozombies.io/course/static/img/zombierun.png
  background-size: cover;
  height: 287px;
  width: 192px;
  position: absolute;
  left: 16vh;
  animation: play 0.7s steps(24) infinite;
}

@keyframes play {
  100% {
    background-position: -4608px;
  }
}

// @dev name and description place
.zombie-card {
  text-align: center;
  position: relative;
  bottom: 12vh;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  width: 200px;
  margin: 0 auto;
  padding: 5px;
}

.hide {
  display: none;
}

.zombie-char {
  position: relative;
}


.zombie-parts-bg,.zombie-char {
  width: 450px;
}

.zombie-parts-bg {
  height: 550px;
  background: url('/dapp-lab/img/tester-bg@2x.2a4a2235.png') center no-repeat;
  background-size: contain;
}

.zombie-parts {
  position: relative;
  margin-left: -2vh;
  top: 15vh;

  .head {
    width: 28vh;
    position: absolute;
    left: 13vh;
    top: -4vh;
  }

  .eye {
    width: 13vh;
    position: absolute;
    left: 23vh;
    top: 8vh;
  }


  .shirt {
    width: 13vh;
    position: absolute;
    left: 15.6vh;
    top: 13vh;
  }
}


.mouth {
  width: 6vh;
  position: absolute;
  left: 26.6vh;
  top: 15vh;
}

.torso {
  width: 13vh;
  position: absolute;
  left: 15.6vh;
  top: 13vh;
}

.left-thigh {
  width: 6vh;
  position: absolute;
  left: 17.3vh;
  top: 22vh;
}

.right-thigh {
  width: 6vh;
  position: absolute;
  left: 20.4vh;
  top: 22vh;
}

.cat-legs {
  width: 10vh;
  position: absolute;
  left: 15.4vh;
  top: 18vh;
}

.left-hand {
  width: 4vh;
  position: absolute;
  left: 24.3vh;
  top: 19vh;
}

.right-hand {
  width: 4vh;
  position: absolute;
  left: 28.4vh;
  top: 19vh;
}

.left-forearm {
  width: 4vh;
  position: absolute;
  left: 22.3vh;
  top: 20vh;
}

.right-forearm {
  width: 4vh;
  position: absolute;
  left: 26.4vh;
  top: 20vh;

}

.left-upper-arm {
  width: 6vh;
  position: absolute;
  left: 19.3vh;
  top: 16vh;
}

.right-upper-arm {
  width: 6vh;
  position: absolute;
  left: 23.4vh;
  top: 16vh;
}

.left-leg {
  width: 4vh;
  position: absolute;
  left: 18.3vh;
  top: 27vh;
}

.right-leg {
  width: 3.3vh;
  position: absolute;
  left: 22.3vh;
  top: 27.6vh;
}

.left-feet {
  width: 4vh;
  position: absolute;
  left: 18.3vh;
  top: 30vh;
}

.right-feet {
  width: 3.3vh;
  position: absolute;
  left: 22.3vh;
  top: 30.3vh;
}


.zombie-name {
  text-transform: uppercase;
  font-weight: bold;
  text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2)
}

.zombie-details {
  position: absolute;
  bottom: 5%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  text-align: center;
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.zombie-name {
  font-weight: bold;
}

</style>
