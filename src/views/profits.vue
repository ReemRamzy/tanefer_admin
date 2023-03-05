<template>
    <v-container>
        <v-snackbar v-model="snackbar" :timeout="5000" top :color="color">
          <v-row justify="space-between">
            <span>{{text}}</span>
            <v-btn icon @click.native="snackbar = false">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-snackbar>
        <v-row>
            <h2 class="orange--text">Profits settings</h2>
        </v-row>
        <v-card v-for="(item, i) in profits" :key="item.title" class="my-5 px-5 pt-5">
            <v-card-title class="orange--text">
                Profits on {{item.target}} booking
            </v-card-title>
            <v-card-subtitle>{{item.description}}</v-card-subtitle>
            <v-row class="pa-5">
                <v-text-field
                v-model="item.amount"
                label="Percentage"
                color="orange"
                outlined
                class="mx-2"
                type="number"
                min="1"
                max="99"
                ></v-text-field>
                <v-btn :loading="i === 0 ? flightLoad : (i === 1 ? hotelLoad : carLoad)"
                height="53"
                color="success"
                @click="update(item.target, item.id, i)"
                >
                    Update Profits
                </v-btn>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { listprofits, updateprofits, headers } from '../links'
export default {
  data () {
    return {
      profits: [],
      flightLoad: false,
      hotelLoad: false,
      carLoad: false,
      color: '',
      snackbar: false,
      text: ''
    }
  },
  methods: {
    update (type, id, i) {
      if (i === 0) this.flightLoad = true
      else if (i === 1) this.hotelLoad = true
      else this.carLoad = true
      this.$http.put(updateprofits(id), { amount: this.profits[i].amount }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (i === 0) this.flightLoad = false
        else if (i === 1) this.hotelLoad = false
        else this.carLoad = false
        if (response.body.status === true) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Property was updated successfully'
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, () => {
        if (i === 0) this.flightLoad = false
        else if (i === 1) this.hotelLoad = false
        else this.carLoad = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong please try again in few seconds'
      })
    }
  },
  created () {
    this.$http.get(listprofits, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === true) {
        this.profits = response.body.data
      }
    })
  }
}
</script>
