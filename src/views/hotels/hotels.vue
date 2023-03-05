<template>
    <div>
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
        <v-container>
            <grid
            :items="hotels"
            :headers="hotelHeaders"
            type="hotels"
            :loading="loading"
            :page="page"
            :total="totalHotels"
            @pageNum="changePage"
            @removeHotel="removeHotel"
            />
        </v-container>
    </div>
</template>

<script>
import { allHotels, headers, removeHotel } from '../../links'
import grid from '../../components/tables.vue'

export default {
  components: {
    grid
  },
  data () {
    return {
      hotels: [],
      page: 1,
      totalHotels: 0,
      itemsPerRow: 15,
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      hotelHeaders: [
        { text: 'Image', value: 'hotelImage' },
        { text: 'Name', value: 'hotelName' },
        { text: 'Address', value: 'hotelAddress' },
        { text: 'Phone', value: 'hotelPhone' },
        { text: 'Remove', value: 'removeHotel', align: 'end' }
      ]
    }
  },
  methods: {
    getHotels (rows, page) {
      this.loading = true
      this.$http.get(allHotels(rows, page), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.body.status === 200) {
          this.hotels = response.body.data.hotelList
          this.totalHotels = response.body.data.hotelTotal
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
        this.loading = false
      })
    },
    changePage (num) {
      this.getHotels(15, num)
      this.page = num
    },
    removeHotel (id) {
      this.$http.delete(removeHotel(id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.getHotels(15, this.page)
          this.snackbar = true
          this.color = 'success'
          this.text = 'Deleted Successfully'
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    }
  },
  created () {
    this.getHotels(15, 1)
    this.page = 1
  }
}
</script>
