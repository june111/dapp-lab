import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'materialize-css' // js

// import 'materialize-css/dist/css/materialize.min.css'

Vue.config.productionTip = false
import './assets/style/common.scss'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import Vuetify from 'vuetify'

Vue.use(Vuetify, {
  iconfont: 'md' // 'md' || 'mdi' || 'fa' || 'fa4'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
