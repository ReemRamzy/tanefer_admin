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
            <v-row justify="space-between" class="headline px-5 my-5 primary--text font-weight-black">
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
            </v-row>

            <v-expansion-panels>
                <v-expansion-panel v-if="bookingDetails.package.includes">
                    <v-expansion-panel-header>
                        Includes
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-if="!Array.isArray(bookingDetails.package.includes)">
                            <p v-for="item in bookingDetails.package.includes.replaceAll('[', '').replaceAll(']', '').split(',')" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                        </div>
                        <div v-else>
                            <p v-for="item in bookingDetails.package.includes" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-if="bookingDetails.package.excludes">
                    <v-expansion-panel-header>
                        Excludes
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-if="!Array.isArray(bookingDetails.package.excludes)">
                            <p v-for="item in bookingDetails.package.excludes.replaceAll('[', '').replaceAll(']', '').split(',')" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                        </div>
                        <div v-else>
                            <p v-for="item in bookingDetails.package.excludes" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

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
                                    {{bookingDetails.booking_data.contact_name}}
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
                <v-card-title class="primary--text">
                    {{city.city.name + ' ' + city.nights_number + ' nights'}}
                </v-card-title>
                <v-card-text>
                    <v-row v-if="city.package_hotel">
                        <v-col cols="12" md="3">
                            <v-img height="100%" :src="city.package_hotel.image" v-if="city.package_hotel" class="rounded-lg"></v-img>
                        </v-col>
                        <v-col cols="12" md="9">
                            <div>
                                <div class="headline font-weight-bold mb-2">{{city.package_hotel.name}}</div>
                                <div class="body-1 mb-2"><v-icon>mdi-map-marker</v-icon> {{city.package_hotel.address}}</div>
                                <div class="body-1" v-html="city.package_hotel.description"></div>
                            </div>
                            <v-btn tile color="primary" @click="packageHotelDetails = city.package_hotel; room = city.package_hotel_room; showHotelDetails = true;">Show Rooms</v-btn>
                        </v-col>
                    </v-row>

                    <v-expansion-panels class="mt-5" dense outlined v-if="city.booking_city_activity.length">
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                            Activities
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-timeline>
                                    <v-timeline-item
                                    v-for="(activity, i) in city.booking_city_activity"
                                    :key="'act' + i"
                                    color="primary"
                                    small
                                    >
                                        <template v-slot:opposite>
                                            <span
                                            :class="`headline font-weight-bold primary--text`"
                                            v-text="'Day ' + activity.day_number "
                                            ></span>
                                        </template>
                                        <v-card class="pa-4">
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
                                        </v-card>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>

            <v-dialog v-model="showHotelDetails" fullscreen>
                <v-card v-if="packageHotelDetails" tile>
                    <v-card-title class="primary white--text">
                        <v-btn icon color="white" large @click="showHotelDetails = false">
                        <v-icon>mdi-close</v-icon>
                        </v-btn>
                        Hotel Details
                    </v-card-title>
                    <v-img :src="packageHotelDetails.image" max-height="200"></v-img>
                    <v-card-text class="pa-5">
                        <v-row justify="space-between" align="end">
                            <div>
                            <h3>{{packageHotelDetails.name}}</h3>
                            <p class="grey--text"><v-icon>mdi-map-marker</v-icon> {{packageHotelDetails.address}}</p>
                            <p class="grey--text"><v-icon>mdi-phone</v-icon> {{packageHotelDetails.phone}}</p>
                            </div>
                            <div>
                                <v-rating
                                v-model="packageHotelDetails.stars"
                                background-color="orange lighten-3"
                                color="orange"
                                ></v-rating>
                            </div>
                        </v-row>
                        <p v-html="packageHotelDetails.description"></p>
                        <v-row justify="space-around">
                            <div>
                                <h4>Facilities</h4>
                                <div v-if="!Array.isArray(packageHotelDetails.facilities)">
                                    <p v-for="item in packageHotelDetails.facilities.replaceAll('[', '').replaceAll(']', '').split(',')" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                </div>
                                <div v-else>
                                    <p v-for="item in packageHotelDetails.facilities" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                </div>
                            </div>
                            <div>
                                <h4>Policies</h4>
                                <div v-if="!Array.isArray(packageHotelDetails.policies)">
                                    <p v-for="item in packageHotelDetails.policies.replaceAll('[', '').replaceAll(']', '').split(',')" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                </div>
                                <div v-else>
                                    <p v-for="item in packageHotelDetails.policies" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                </div>
                            </div>
                        </v-row>

                        <v-card class="mb-3">
                            <h4>Room</h4>
                            <v-card-title class="primary white--text">{{room.type}}, {{room.occupancy}}</v-card-title>
                            <v-card-text class="pa-3">
                                <v-row justify="space-around">
                                    <div>
                                        <h4>Aminities</h4>
                                        <div v-if="!Array.isArray(room.amenities)">
                                            <p v-for="item in room.amenities.replaceAll('[', '').replaceAll(']', '').split(',')" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-for="item in room.amenities" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4>Inclusions</h4>
                                        <div v-if="!Array.isArray(room.inclusions)">
                                            <p v-for="item in room.inclusions.replaceAll('[', '').replaceAll(']', '').split(',')" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                        </div>
                                        <div v-else>
                                            <p v-for="item in room.inclusions" :key="item"><v-icon>mdi-check</v-icon> {{item}}</p>
                                        </div>
                                    </div>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-dialog>
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
