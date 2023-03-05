<template>
    <v-container>
        <v-snackbar
          v-model="snackbar"
          :color="color"
          :timeout="5000"
          top
        >
          <v-row>
            <span>{{text}}</span>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="snackbar = false">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-snackbar>
        <v-row justify="end" class="my-5">
          <v-btn @click="$router.push({ name: 'manageAirlines' })" dark rounded class="mr-5" color="blue">
            <v-icon color="white" left>mdi-cog</v-icon>
            Manage Airlines by country
          </v-btn>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="12" lg="6">
            <grid
            :items="airlines"
            :headers="airlinesHeaders"
            type="whiteAirlines"
            class="mb-5"
            :loading="airlineLoad"
            @takeActions="takeAction"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <grid
            :items="blockedAirlines"
            :headers="airlinesHeaders"
            type="blockedAirlines"
            :loading="blockedAirlineLoad"
            @takeActions="takeAction"
            />
          </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { airlineWhitelist, airlineBlacklist, blockAirline, unblockAirline, headers } from '../links'
import grid from '../components/tables.vue'

export default {
  components: {
    grid
  },
  data () {
    return {
      snackbar: false,
      color: '',
      text: '',
      airlines: [],
      blockedAirlines: [],
      airlineLoad: true,
      blockedAirlineLoad: true,
      airlinesHeaders: [
        { text: 'Code', value: 'code' },
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  methods: {
    takeAction (type, item) {
      if (type === 'blockAirline') {
        this.$http.post(blockAirline, { code: item.code }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Airline Blocked Successfully'
            this.blockedAirlines = response.body.data.blacklist
            this.airlines = this.airlines.filter(value => {
              return value !== item
            })
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Something went wrong, please try again in a few seconds'
          }
        }, () => {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong, please try again in a few seconds'
        })
      } else if (type === 'unblockAirline') {
        this.$http.post(unblockAirline, { code: item.code }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Airline Unblocked Successfully'
            this.airlines = response.body.data.whitelist
            this.blockedAirlines = this.blockedAirlines.filter(value => {
              return value !== item
            })
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Something went wrong, please try again in a few seconds'
          }
        }, () => {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong, please try again in a few seconds'
        })
      }
    }
  },
  beforeCreate () {
    this.$http.get(airlineWhitelist, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === true) {
        this.airlines = response.body.data
        this.airlineLoad = false
        this.$store.dispatch('setAirlines', response.body.data)
      } else {
        this.airlineLoad = false
      }
    })
    this.$http.get(airlineBlacklist, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === true) {
        this.blockedAirlines = response.body.data
        this.blockedAirlineLoad = false
        this.$store.dispatch('setBlockedAirlines', response.body.data)
      } else {
        this.blockedAirlineLoad = false
      }
    })
  }
}
</script>
