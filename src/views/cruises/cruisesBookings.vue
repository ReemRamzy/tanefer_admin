<template>
    <v-container>
        <v-snackbar
        v-model="snackbar"
        :color="color"
        :timeout="3000"
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
        <grid
        :items="bookings"
        :headers="headers"
        type="cruisesBookings"
        :loading="loading"
        />
    </v-container>
</template>

<script>
import { cruisesBookings, headers } from '../../links'
import grid from '../../components/tables.vue'

export default {
  components: { grid },
  data () {
    return {
      bookings: [],
      loading: false,
      snackbar: false,
      headers: [
        { text: 'Booking ID', value: 'id' },
        { text: 'Adults', value: 'adults' },
        { text: 'Children', value: 'children' },
        { text: 'Price $', value: 'total_price' },
        { text: 'Date', value: 'created_at' }
      ],
      color: '',
      text: ''
    }
  },
  methods: {
    getBookings () {
      this.loading = true
      this.$http.get(cruisesBookings, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.bookings = response.body
      }).catch(err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created () {
    this.getBookings()
  }
}
</script>
