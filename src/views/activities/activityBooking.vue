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
            <!-- <v-row justify="space-between" class="headline px-5 my-5 primary--text font-weight-black">
                <v-col cols="11" class="d-flex">
                    <v-img v-if="bookingDetails.package.image" class="mr-5 rounded-lg" :src="bookingDetails.package.image" max-width="150"></v-img>
                    <span>
                        {{bookingDetails.package.title}}
                        <br>
                        <span v-if="bookingDetails.package.start_date" class="caption grey--text">
                        {{new Date(bookingDetails.package.start_date.replaceAll('-', '/')).toDateString()}}
                        </span>
                        <details class="mt-5">
                            <summary class="body-1">overview <v-icon>mdi-chevron-down</v-icon></summary>
                            <p class="body-2 black--text" v-html="bookingDetails.package.overview"></p>
                        </details>
                    </span>
                </v-col>
                <span class="grey--text">$ {{bookingDetails.total_price}}</span>
            </v-row> -->

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
                                    Status
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
                                    {{bookingDetails.status}}
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

            <v-card class="mt-5" v-for="city in bookingDetails.booking_city" :key="city.city_id" outlined>
                <v-card-title class="primary--text" v-if="city.city">
                    {{city.city.name + ' ' + city.nights_number + ' nights'}}
                </v-card-title>
                <v-card-text>

                <v-card-title class="primary--text">Activity Detais</v-card-title>
                <div
                v-for="(activity, i) in city.booking_city_activity"
                :key="'act' + i"
                color="primary"
                small
                >
                    <v-img :src="activity.package_activity.image" class="rounded-lg"></v-img>
                    <h3 :class="`headline font-weight-light mb-4 primary--text`">
                    {{activity.package_activity.title}}
                    </h3>
                    <h4 :class="`headline font-weight-light mb-4 primary--text`">
                    {{activity.package_activity.activity_type}} {{activity.package_activity.duration_digits + ' ' + activity.package_activity.duration_type}}
                    </h4>
                    <div>
                        <details class="mt-5">
                            <summary class="body-1">overview <v-icon>mdi-chevron-down</v-icon></summary>
                            <p class="body-2 black--text" v-html="activity.package_activity.overview"></p>
                        </details>
                        <details class="mt-5">
                            <summary class="body-1">Includes <v-icon>mdi-chevron-down</v-icon></summary>
                            <div v-if="!Array.isArray(activity.package_activity.includes)">
                                <p v-for="(item, i) in activity.package_activity.includes.replaceAll('[', '').replaceAll(']', '').split(',')" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                            <div v-else>
                                <p v-for="(item, i) in activity.package_activity.includes" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                        </details>
                        <details class="mt-5">
                            <summary class="body-1">Excludes <v-icon>mdi-chevron-down</v-icon></summary>
                            <div v-if="!Array.isArray(activity.package_activity.excludes)">
                                <p v-for="(item, i) in activity.package_activity.excludes.replaceAll('[', '').replaceAll(']', '').split(',')" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
                            </div>
                            <div v-else>
                                <p v-for="(item, i) in activity.package_activity.excludes" :key="i"><v-icon>mdi-check</v-icon> {{item}}</p>
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
import { bookingDetails, headers } from '../../links'

export default {
  data () {
    return {
      bookingDetails: null,
      showHotelDetails: false,
      packageHotelDetails: null,
      room: null,
      loading: true
    }
  },
  created () {
    this.$http.get(bookingDetails(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(res => {
      this.bookingDetails = res.body.bookingDetails
    }).catch(() => {}).finally(() => {
      this.loading = false
    })
  }
}
</script>

<style>
/* .v-dialog__content--active {
    z-index: 10001 !important;
} */
</style>
