<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm12>
        <v-toolbar color="pink" dark>
          <v-toolbar-title>Feature</v-toolbar-title>
        </v-toolbar>
        <!-- <router-view></router-view> -->
      </v-flex>
    </v-layout>
    <template>
      <v-expansion-panel expand popout>
        <v-expansion-panel-content v-for="(item,i) in list" :key="i">
          <template v-slot:header>
            <div>{{item.title}}</div>
          </template>
          <template v-for="content,index in item.detail">
            <v-card>
              <v-card-text>
                <v-list>
                  <v-list-tile-content>
                    <a :href="content.path">{{content.title}}</a>
                  </v-list-tile-content>
                </v-list>
              </v-card-text>
            </v-card>
            <v-divider></v-divider>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>
  </div>
</template>
<script>
const baseUrl = '/dapp-lab'
export default {
  name: 'home',
  data() {
    return {
      list: [{
          title: 'Gambling',
          detail: [{
            path: baseUrl + '/dice.html',
            title: 'Dice'
          }]
        },
        {
          title: 'Interactive function between smart contract and web3',
          detail: [{
            path: baseUrl + '/test.html#/test-collection/basic',
            title: 'Smart contract read and write'
          }, {
            path: baseUrl + '/test.html#/test-collection/msg-sign',
            title: 'Message signing for smart contracts'
          }, {
            path: baseUrl + '/test.html#/test-collection/contract-info',
            title: 'Get information about a specified smart contract'
          }, {
            path: baseUrl + '/test.html#/test-collection/random',
            title: 'Get random number via Oraclize'
          }, {
            path: baseUrl + '/test.html#/test-collection/get-data-code',
            title: 'Compile data by abi'
          }, {
            path: baseUrl + '/test.html#/test-collection/send-raw-transaction',
            title: 'Sign transactions with the private key'
          }]
        }
      ]

    }
  },
}

</script>
