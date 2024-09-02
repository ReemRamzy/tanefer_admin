<template>
    <div>
        <div class="text-center my-10" v-if="loading">
            <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
            ></v-progress-circular>
        </div>
        <p v-if="!loading && !bookingDetails" class="my-10 text-center">Couldn't get the booking details <router-link to="/">Back home</router-link> </p>
        <v-container v-if="!loading && bookingDetails">
            <v-card outlined>
                <v-card-title class="primary--text">Booking Info</v-card-title>

                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Adults
                                </th>
                                <th class="text-left">
                                    Children
                                </th>
                                <th class="text-left">
                                    Date
                                </th>
                                <th class="text-left">
                                    Total Price
                                </th>
                                <th class="text-left">
                                    Status
                                </th>
                                <th class="text-left">
                                    Action Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left">
                                    {{bookingDetails.adults}}
                                </td>
                                <td class="text-left">
                                    {{bookingDetails.children}}
                                </td>
                                <td class="text-left">
                                    {{bookingDetails.start_date}}
                                </td>
                                <td class="text-left">
                                    ${{bookingDetails.total_price}}
                                </td>
                                <td class="text-left">
                                    {{ bookingDetails.status === null ? 'pending' : bookingDetails.status }}
                                </td>
                                <td class="text-left">
                                    <span v-if="bookingDetails.status === null">
                                        <v-btn
                                            tile
                                            :loading="btnLoad"
                                            :disabled="disableButtonEmail"
                                            color="blue white--text"
                                            @click="sendEmail"
                                        >
                                            Accept
                                        </v-btn>
                                        <!-- <span> | </span>
                                        <v-btn
                                            tile
                                            :loading="btnLoad"
                                            :disabled="disableButtonEmail"
                                            color="blue white--text"
                                            @click="sendRejectEmail"
                                        >
                                            Refuse
                                        </v-btn> -->
                                    </span>
                                    <span v-else>
                                        {{bookingDetails.status}}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-divider></v-divider>

                <v-card-title class="primary--text">Contact Info</v-card-title>

                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Phone
                                </th>
                                <th class="text-left">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left">
                                    {{bookingDetails.booking_data.contact_name}}
                                </td>
                                <td class="text-left">
                                    {{bookingDetails.booking_data.contact_phone}}
                                </td>
                                <td class="text-left">
                                    {{bookingDetails.booking_data.contact_email}}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-divider></v-divider>

                <v-card-title class="primary--text">Travellers</v-card-title>

                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Title
                                </th>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Gender
                                </th>
                                <th class="text-left">
                                    Birth Date
                                </th>
                                <th class="text-left">
                                    Passport Number
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in bookingDetails.booking_traveler" :key="item.id">
                                <td class="text-left">
                                    {{item.passengerTitle || '-'}}
                                </td>
                                <td class="text-left">
                                    {{item.passengerFirstName + ' ' + item.passengerLastName}}
                                </td>
                                <td class="text-left">
                                    {{item.passengerGender}}
                                </td>
                                <td class="text-left">
                                    {{new Date(item.date_of_birth.replaceAll('-', '/')).toDateString()}}
                                </td>
                                <td class="text-left">
                                    {{item.passport_number}}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>

            <v-card class="mt-5" v-if="bookingDetails.cruise" outlined>
                <v-card-title class="primary--text" v-if="bookingDetails.cruise.name">
                    {{bookingDetails.cruise.name + ' ' + bookingDetails.cruise.number_of_nights + ' nights'}}
                </v-card-title>
                <v-card-text>

                <v-card-title class="primary--text">Cruise Detais</v-card-title>
                <div color="primary" small>
                    <v-img :src="bookingDetails.cruise.master_image" class="rounded-lg"></v-img>
                    <h3 :class="`headline font-weight-light mb-4 primary--text`">
                    {{bookingDetails.cruise.name}}
                    </h3>
                    <div>
                        <details class="mt-5">
                            <summary class="body-1">Description <v-icon>mdi-chevron-down</v-icon></summary>
                            <p class="body-2 black--text" v-html="bookingDetails.cruise.description"></p>
                        </details>
                        <details class="mt-5">
                            <summary class="body-1">Includes <v-icon>mdi-chevron-down</v-icon></summary>
                            <div v-if="!Array.isArray(bookingDetails.cruise.includes)">
                                <p v-for="(item, i) in bookingDetails.cruise.includes.replaceAll('[', '').replaceAll(']', '').split(',')" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                            <div v-else>
                                <p v-for="(item, i) in bookingDetails.cruise.includes" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                        </details>
                        <details class="mt-5">
                            <summary class="body-1">Excludes <v-icon>mdi-chevron-down</v-icon></summary>
                            <div v-if="!Array.isArray(bookingDetails.cruise.excludes)">
                                <p v-for="(item, i) in bookingDetails.cruise.excludes.replaceAll('[', '').replaceAll(']', '').split(',')" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                            <div v-else>
                                <p v-for="(item, i) in bookingDetails.cruise.excludes" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                        </details>
                        <details class="mt-5">
                            <summary class="body-1">Facilities <v-icon>mdi-chevron-down</v-icon></summary>
                            <div v-if="!Array.isArray(bookingDetails.cruise.facilities)">
                                <p v-for="(item, i) in bookingDetails.cruise.facilities.replaceAll('[', '').replaceAll(']', '').split(',')" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                            <div v-else>
                                <p v-for="(item, i) in bookingDetails.cruise.facilities" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                        </details>
                    </div>
                </div>
                </v-card-text>
            </v-card>

        </v-container>
    </div>
</template>

<script>
import { bookingDetails, headers, sendEmailCruise } from '../../links'

export default {
  data () {
    return {
      bookingDetails: null,
      showHotelDetails: false,
      packageHotelDetails: null,
      room: null,
      loading: true,
      disableButtonEmail: false
    }
  },
  created () {
    this.$http.get(bookingDetails(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(res => {
      this.bookingDetails = res.body.bookingDetails
    }).catch(() => {}).finally(() => {
      this.loading = false
    })
  },
  methods: {
    sendEmail () {
      const formData = new FormData()
      formData.append('book_id', this.bookingDetails.id)
      formData.append('price', this.bookingDetails.total_price)
      formData.append('status', 'accept')

        this.$http.post(sendEmailCruise, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.btnLoad = false
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Email was Sent'
            this.disableButtonEmail = true
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
            this.disableButtonEmail = false
          }
        }, err => {
          this.snackbar = true
          this.color = 'error'
          this.text = err.body.message
          this.btnLoad = false
      })
    },
    sendRejectEmail () {
      const formData = new FormData()
      formData.append('book_id', this.bookingDetails.id)
      formData.append('price', this.bookingDetails.total_price)
      formData.append('status', 'reject')

      this.$http.post(sendEmailCruise, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.btnLoad = false
        if (response.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Email was Sent'
          this.disableButtonEmail = true
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
          this.disableButtonEmail = false
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
        this.btnLoad = false
      })
    }
  }
}
</script>

<style>
/* .v-dialog__content--active {
    z-index: 10001 !important;
} */
</style>
