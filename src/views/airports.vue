<template>
    <v-container fluid>
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
        <v-row>
            <v-col cols="12" md="6" lg="3">
                <v-btn rounded block color="error" @click="dialog = true; action = 'blockCity'">Block by CITY </v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="3">
                <v-btn rounded block color="error" @click="dialog = true; action = 'blockCountry'">Block by Country</v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="3">
                <v-btn rounded block color="success" @click="dialog = true; action = 'unblockCity'">Unblock by city</v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="3">
                <v-btn rounded block color="success" @click="dialog = true; action = 'unblockCountry'">Unblock by country</v-btn>
            </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="12" lg="6">
            <grid
            :items="airports"
            :headers="airportsHeaders"
            type="whiteAirports"
            class="mb-5"
            :loading="airportLoad"
            @takeActions="takeAction"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <grid
            :items="blockedAirports"
            :headers="airportsHeaders"
            type="blockedAirports"
            :loading="blockedAirportLoad"
            @takeActions="takeAction"
            />
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent :width="$vuetify.breakpoint.smAndDown ? '90%' : '40%'">
            <v-card>
                <v-card-text class="text-center">
                    <v-row justify="center">
                        <v-col cols="12">
                            <autocomplete :type="(action === 'blockCity' || action === 'unblockCity') ? 'cities' : 'countries'"></autocomplete>
                        </v-col>
                    </v-row>
                    <v-card-actions class="text-center">
                        <v-btn
                        color="warning"
                        tile
                        @click="dialog = false"
                        >
                        cancel
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                        :color="action === 'blockCity' || action === 'blockCountry' ? 'error' : 'success'"
                        @click="blockUnblockAction()"
                        tile
                        >
                            {{action === 'blockCity' || action === 'blockCountry' ? 'Block' : 'Unblock'}}
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { airportWhitelist, airportBlacklist, blockAirport, unblockAirport, blockAirportsByCountry, unblockAirportsByCountry, blockAirportsByCity, unblockAirportsByCity, headers } from '../links'
import grid from '../components/tables.vue'
import autocomplete from '../components/autocomplete.vue'

export default {
  components: {
    grid,
    autocomplete
  },
  data () {
    return {
      snackbar: false,
      color: '',
      text: '',
      action: '',
      actionOn: 'countries',
      dialog: false,
      airports: [],
      blockedAirports: [],
      airportLoad: true,
      blockedAirportLoad: true,
      airportsHeaders: [
        { text: 'Code', value: 'Code' },
        { text: 'Name', value: 'Name' },
        { text: 'City', value: 'City' },
        { text: 'Country', value: 'Country' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  watch: {
    actionOn (val) {
      if (!val) this.actionOn = 'countries'
    }
  },
  methods: {
    takeAction (type, item) {
      if (type === 'blockAirport') {
        this.$http.post(blockAirport, { code: item.Code }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Airport Blocked Successfully'
            this.blockedAirports = response.body.data.blacklist
            this.airports = this.airports.filter(value => {
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
      } else if (type === 'unblockAirport') {
        this.$http.post(unblockAirport, { code: item.Code }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Airline Unblocked Successfully'
            this.airports = response.body.data.whitelist
            this.blockedAirports = this.blockedAirports.filter(value => {
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
    },
    blockUnblockAction () {
      this.dialog = false
      switch (this.action) {
        case 'blockCountry':
          if (this.$store.state.airportCountry) {
            this.$http.post(blockAirportsByCountry, { countryName: this.$store.state.airportCountry.name }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
              if (response.status === 200) {
                this.snackbar = true
                this.color = 'success'
                this.text = `Airports in ${this.$store.state.airportCountry.name} have been blocked`
                this.blockedAirports = response.body.data.blacklist
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
          } else {
            this.snackbar = true
            this.color = 'warning'
            this.text = 'Please choose a country'
          }
          break
        case 'blockCity':
          if (this.$store.state.airportCity) {
            this.$http.post(blockAirportsByCity, { city: this.$store.state.airportCity.name, country: this.$store.state.airportCity.CountryCode }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
              if (response.status === 200) {
                this.snackbar = true
                this.color = 'success'
                this.text = `Airports in ${this.$store.state.airportCity.name} have been blocked`
                this.blockedAirports = response.body.data.blacklist
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
          } else {
            this.snackbar = true
            this.color = 'warning'
            this.text = 'Please choose a city'
          }
          break
        case 'unblockCountry':
          if (this.$store.state.airportCountry) {
            this.$http.post(unblockAirportsByCountry, { countryName: this.$store.state.airportCountry.name }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
              if (response.status === 200) {
                this.snackbar = true
                this.color = 'success'
                this.text = `Airports in ${this.$store.state.airportCountry.name} have been unblocked`
                this.airports = response.body.data.whitelist
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
          } else {
            this.snackbar = true
            this.color = 'warning'
            this.text = 'Please choose a country'
          }
          break
        case 'unblockCity':
          if (this.$store.state.airportCity) {
            this.$http.post(unblockAirportsByCity, { city: this.$store.state.airportCity.name, country: this.$store.state.airportCity.CountryCode }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
              if (response.status === 200) {
                this.snackbar = true
                this.color = 'success'
                this.text = `Airports in ${this.$store.state.airportCity.name} have been unblocked`
                this.airports = response.body.data.whitelist
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
          } else {
            this.snackbar = true
            this.color = 'warning'
            this.text = 'Please choose a city'
          }
          break
      }
    }
  },
  beforeCreate () {
    this.$http.get(airportWhitelist, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === true) {
        this.airports = response.body.data
        this.airportLoad = false
        this.$store.dispatch('setAirports', response.body.data)
      } else {
        this.airportLoad = false
      }
    })
    this.$http.get(airportBlacklist, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === true) {
        this.blockedAirports = response.body.data
        this.blockedAirportLoad = false
        this.$store.dispatch('setBlockedAirports', response.body.data)
      } else {
        this.blockedAirportLoad = false
      }
    })
  }
}
</script>
