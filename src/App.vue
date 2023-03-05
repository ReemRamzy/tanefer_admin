<template>
  <v-app>
    <sidebar v-if="$route.name !== 'login' && $route.name !== 'resetPassword'" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import sidebar from './components/sideBar.vue'
// import { profile, carStatuses, hotelPaymentStatuses, hotelStatuses, headers, pnrStatus, cities, countries } from './links'
import { profile, headers } from './links'
export default {
  name: 'App',
  components: {
    sidebar
  },
  data () {
    return {}
  },
  created () {
    if (!this.$cookies.isKey('userToken')) {
      if (this.$route.name !== 'login') this.$router.push({ name: 'login' })
    } else {
      if (this.$store.state.user === null) {
        this.$http.get(profile, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.body.status) {
            this.$store.dispatch('setUser', response.body.data)
          } else {
            this.$store.dispatch('removeUser')
            this.$cookies.remove('userToken')
            this.$router.push({ name: 'login' })
          }
        })
      }
    }
  }
}
</script>

<style>
.inputNumber input[type='number'] {
    -moz-appearance:textfield;
}
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>
