import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueResource from 'vue-resource'
import JsonExcel from 'vue-json-excel'
import VueCookies from 'vue-cookies'
import * as VueGoogleMaps from 'vue2-google-maps'
import wysiwyg from 'vue-wysiwyg'
Vue.use(wysiwyg, {}) // config is optional. more below

Vue.component('downloadExcel', JsonExcel)

Vue.use(VueGoogleMaps, {
  load: {
    // AIzaSyDsLetsUHTBMnvWTx_kd8ccGwrvvVBJDEU
    key: 'AIzaSyCMpLmI6ZbrtqkEA_hIP7aWCJvRsCLz11c',
    libraries: 'places'
  }
})

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueCookies)

Vue.http.interceptors.push(request => {
  // modify timeout
  request.timeout = 20000
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
