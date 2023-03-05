<template>
    <v-container>
      <v-snackbar v-model="snackbar" :timeout="5000" top :color="color">
        {{text}}
        <v-spacer></v-spacer>
        <v-btn
        icon
        @click="snackbar = false"
        >
          <v-icon right>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <v-card class="pa-3 my-5">
            <v-row class="px-5" justify="space-between">
              <v-select
              :items="$store.state.carStatus"
              label="Booking Status"
              chips
              clearable
              deletable-chips
              item-text="status"
              item-value="id"
              multiple
              solo
              return-object
              :menu-props="{nudgeTop: -50}"
              v-model="bookingStatuses"
              >
              </v-select>
              <v-select
              :items="clients"
              label="Booked From"
              chips
              clearable
              deletable-chips
              item-text="name"
              item-value="id"
              multiple
              solo
              return-object
              :menu-props="{nudgeTop: -50}"
              v-model="selectedClients"
              class="ml-1"
              >
              </v-select>
            </v-row>
            <v-row class="px-5" justify="space-between">
                <div style="display: flex;">
                    <v-switch inset v-model="filters" value="last_week" class="mr-3">
                        <template v-slot:label>
                            <span class="orange--text">Last Week </span>
                        </template>
                    </v-switch>
                    <v-switch inset v-model="filters" value="last_day" class="mr-3">
                        <template v-slot:label>
                            <span class="orange--text">Last Day</span>
                        </template>
                    </v-switch>
                    <v-switch inset v-model="filters" value="last_month" class="mr-3">
                        <template v-slot:label>
                            <span class="orange--text">Last Month</span>
                        </template>
                    </v-switch>
                    <v-switch inset v-model="filters" value="custom_date">
                        <template v-slot:label>
                            <span class="orange--text">Custom Date</span>
                        </template>
                    </v-switch>
                </div>
                <v-btn
                :loading="filterLoad"
                color="orange"
                dark
                class="mt-2"
                @click="applyFilters"
                >
                Apply filters
                </v-btn>
                <v-col cols="12" v-if="dateDialog">
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="dates"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="dates"
                        label="Pick Dates Range"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        solo
                        color="orange"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="dates" color="orange" no-title scrollable range>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
                    </v-date-picker>
                </v-menu>
                </v-col>
            </v-row>
        </v-card>
        <grid
        type="carBookings"
        :headers="carBookingHeaders"
        :items="carBookings"
        :loading="loading"
        :length="lastPage"
        :page="currentPage"
        :total="totalPages"
        :filters="filters"
        :dates="dates"
        :bookingStatuses="bookingStatuses"
        @pageNum="changePage"
        ></grid>
    </v-container>
</template>

<script>
import grid from '../components/tables.vue'
import { listCarBookings, listClients, carStatuses, headers } from '../links'

export default {
  components: {
    grid
  },
  data () {
    return {
      filters: 'last_week',
      dateDialog: false,
      menu: false,
      clients: [],
      selectedClients: [],
      loading: true,
      filterLoad: false,
      dates: [],
      snackbar: false,
      color: '',
      text: '',
      carBookingHeaders: [
        { text: 'Booking', value: 'booking_reference' },
        { text: 'Name', value: 'contact_person' },
        { text: 'Emial', value: 'contact_email' },
        { text: 'Phone', value: 'contact_phone' },
        { text: 'Booked By', value: 'booked_by' },
        { text: 'Booked From', value: 'booked_from' },
        { text: 'Total Price', value: 'price' },
        { text: 'Status', value: 'status' },
        { text: 'Date', value: 'booking_date' }
      ],
      carBookings: [],
      bookingStatuses: [],
      totalPages: 0,
      currentPage: 0,
      currentURL: null,
      lastPage: 0
    }
  },
  watch: {
    filters (val) {
      if (val === 'custom_date') this.dateDialog = true
      else this.dateDialog = false
    }
  },
  methods: {
    applyFilters () {
      let term = 'type=air&page=1&per_page=15'
      if (this.bookingStatuses.length > 0) {
        for (let i = 0; i < this.bookingStatuses.length; i++) {
          term += `&status_id[]=${this.bookingStatuses[i].id}`
        }
      }
      if (this.selectedClients.length > 0) {
        for (let i = 0; i < this.selectedClients.length; i++) {
          term += `&client_id[]=${this.selectedClients[i].id}`
        }
      }
      switch (this.filters) {
        case 'last_week':
          this.getCarsBookings(term)
          break
        case 'last_day':
          term += '&last_day=last_day'
          this.getCarsBookings(term)
          break
        case 'last_month':
          term += '&last_month=last_month'
          this.getCarsBookings(term)
          break
        case 'custom_date':
          term = `custom_date=custom_date&start_date=${this.dates[0]}&end_date=${this.dates[1]}&${term}`
          this.getCarsBookings(term)
          break
        default:
          this.getCarsBookings(term)
          break
      }
    },
    getCarsBookings (term) {
      this.filterLoad = true
      this.loading = true
      this.$http.get(listCarBookings(term), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        this.filterLoad = false
        if (response.body.status === true) {
          this.currentPage = response.body.data.current_page
          this.currentURL = response.body.data.current_url
          this.lastPage = response.body.data.last_page
          this.totalPages = response.body.data.total
          this.carBookings = response.body.data.data
          this.loading = false
          this.filterLoad = false
        } else {
          this.currentPage = 0
          this.lastPage = 0
          this.totalPages = 0
          this.carBookings = []
          this.loading = false
          this.filterLoad = false
        }
      }, () => {
        this.loading = false
        this.filterLoad = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong, please try again in a few seconds'
      })
    },
    changePage (page) {
      const term = this.currentURL.split('?')
      term[1] += `&page=${page}`
      this.getCarsBookings(term[1])
    }
  },
  created () {
    this.getCarsBookings('type=car&page=1&per_page=15')
    if (this.$store.state.carStatus.length === 0) {
      this.$http.get(carStatuses, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status !== false) {
          this.$store.dispatch('setCarStatus', response.body.data)
        }
      })
    }
    this.$http.get(listClients, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status) {
        this.clients = response.body.data
      }
    })
  }
}
</script>
