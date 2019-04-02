<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm12>
        <v-toolbar color="pink" dark>
          <v-toolbar-title>Feature</v-toolbar-title>
        </v-toolbar>
        <router-view></router-view>
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
                    <router-link :to="content.path">{{content.title}}</router-link>
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
export default {
  name: 'dapp-home',
  data() {
    return {
      list: [{
          title: '博彩',
          detail: [{
            path: '/dice',
            title: '猜数字'
          }]
        },
        {
          title: '合约相关的小功能',
          detail: [{
            path: '/test-collection/basic',
            title: '合约的读与写'
          }, {
            path: '/test-collection/msg-sign',
            title: '合约的消息签名'
          }, {
            path: '/test-collection/contract-info',
            title: '获取合约信息'
          }, {
            path: '/test-collection/random',
            title: '获取随机数'
          }, {
            path: '/test-collection/get-data-code',
            title: '从web3获取发送交易所需的参数'
          },{
            path: '/test-collection/send-raw-transaction',
            title: '直接用私钥发送交易'
          },]
        }
      ]

    }
  },
}

</script>
