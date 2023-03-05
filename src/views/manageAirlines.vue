<template>
    <div>
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
            <v-breadcrumbs divider=">" :items="links" large></v-breadcrumbs>
            <v-card class="pa-5 mb-5">
                <v-card-title>
                    <span class="orange--text">Search Airlines By Country</span>
                </v-card-title>
                <v-row>
                    <v-col cols="12" sm="9">
                        <autocomplete type="countries" parent="manageAirlines"></autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-btn block color="orange" height="52" dark :loading="searchLoad" @click="searchByCountry">
                            search
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
            <grid
            :items="airlines"
            :headers="airlinesHeaders"
            type="manageWhiteAirlines"
            class="mb-5"
            :loading="airlineLoad"
            @takeActions="takeAction"
            :blockBtnLoad="blockBtnLoad"
            />
            <grid
            :items="blockedAirlines"
            :headers="airlinesHeaders"
            type="manageBlockedAirlines"
            :loading="blockedAirlineLoad"
            @takeActions="takeAction"
            :unblockBtnLoad="unblockBtnLoad"
            />
        </v-container>
    </div>
</template>

<script>
import autocomplete from '../components/autocomplete.vue'
import { blockAirlineByCountry, unblockAirlineByCountry, countryAirlines, headers } from '../links'
import grid from '../components/tables.vue'

export default {
  components: {
    autocomplete,
    grid
  },
  data () {
    return {
      snackbar: false,
      color: '',
      text: '',
      airlines: [],
      searchLoad: false,
      blockedAirlines: [],
      airlineLoad: false,
      blockedAirlineLoad: false,
      airlinesHeaders: [
        { text: 'Code', value: 'code' },
        { text: 'Name', value: 'name' }
      ],
      links: [
        {
          exact: true,
          href: '/airlines',
          link: true,
          text: 'Airlines',
          to: { name: 'airlines' }
        },
        {
          disabled: true,
          exact: true,
          href: '/airlines/manageAirlines',
          link: true,
          text: 'Manage Airlines',
          to: { name: 'manageAirlines' }
        }
      ],
      blockBtnLoad: false,
      unblockBtnLoad: false
    }
  },
  methods: {
    searchByCountry () {
      this.searchLoad = true
      this.$http.get(countryAirlines(this.$store.state.airlineCountry.CountryCode), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.searchLoad = false
        if (response.body.status !== false) {
          this.airlines = response.body.data.whiteList
          this.blockedAirlines = response.body.data.blackList
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong please try again in a few seconds'
        }
      }, () => {
        this.searchLoad = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong please try again in a few seconds'
      })
    },
    takeAction (type, items) {
      const airlines = []
      items.forEach(item => {
        airlines.push(item.code)
      })
      const body = {
        airlines_codes: airlines,
        country_code: this.$store.state.airlineCountry.CountryCode
      }
      let endpoint
      if (type === 'blockCountryAirline') {
        this.blockBtnLoad = true
        endpoint = blockAirlineByCountry
      } else if (type === 'unblockCountryAirline') {
        this.unblockBtnLoad = true
        endpoint = unblockAirlineByCountry
      }
      this.$http.post(endpoint, body, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (type === 'blockCountryAirline') {
          this.blockBtnLoad = false
        } else if (type === 'unblockCountryAirline') {
          this.unblockBtnLoad = false
        }
        if (response.body.status !== false) {
          this.airlines = response.body.data.whiteList
          this.blockedAirlines = response.body.data.blackList
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong please try again in a few seconds'
        }
      }, () => {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong please try again in a few seconds'
      })
    }
  }
}
</script>
