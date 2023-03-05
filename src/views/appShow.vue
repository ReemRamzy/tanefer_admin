<template>
    <div>
        <v-progress-linear
        indeterminate
        color="orange"
        :active="loaded"
        height="6"
        ></v-progress-linear>
        <v-container v-if="details !== null && loaded === false">
            <v-snackbar v-model="snackbar" :timeout="5000" top :color="color">
                <v-row justify="space-between">
                {{text}}
                <v-btn
                icon
                @click="snackbar = false"
                >
                    <v-icon right>mdi-close</v-icon>
                </v-btn>
                </v-row>
            </v-snackbar>
            <v-card class="pa-5 mt-5">
                <v-card-title class="orange--text">
                    <v-row justify="space-between">
                        Application Details
                        <v-btn elevation="0" class="mr-5" color="blue white--text" @click="updateDialog = true">
                            <v-icon left>mdi-pencil</v-icon>
                            Edit Application
                        </v-btn>
                    </v-row>
                </v-card-title>
                <v-row class="mt-5">
                    <v-simple-table dense style="width: 100%;">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Name</th>
                                <th class="text-left">URL or Secret</th>
                                <th class="text-left">Terms URL</th>
                                <th class="text-left">Main App</th>
                                <th class="text-left">Date</th>
                                <th class="text-left">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ details.name }}</td>
                                <td>{{ details.urlOrSecret }}</td>
                                <td>{{ details.termsUrl }}</td>
                                <td>{{ details.parentClient }}</td>
                                <td>{{ details.createdAt.substring(0,10) }}</td>
                                <td>{{ details.createdAt.substring(11,20) }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                    <v-simple-table dense style="width: 100%;" class="mt-5">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Email</th>
                                <th class="text-left">Email To</th>
                                <th class="text-left">Email CC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ details.email }}</td>
                                <td>{{ details.emails.to }}</td>
                                <td>{{ details.emails.cc }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-row>
            </v-card>
            <v-card class="pa-5 mt-5">
                <v-card-title class="orange--text">Application Users</v-card-title>
                <!-- <v-row class="mt-5"> -->
                    <v-data-table
                    :headers="userHeaders"
                    :items="details.users"
                    :items-per-page="5"
                    >
                        <template v-slot:item.name="{ item }">
                            <v-btn text small color="blue lighten--1" @click="$router.push({ name: 'user', params: { id: item.id } })">{{ item.name }}</v-btn>
                        </template>
                    </v-data-table>
                    <!-- <v-simple-table dense style="width: 100%;">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Name</th>
                                <th class="text-left">Email</th>
                                <th class="text-left">Phone</th>
                                <th class="text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody v-if="details.users.length > 0">
                            <tr v-for="user in details.users" :key="user.id">
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone }}</td>
                                <td>{{ user.role }}</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr class="text-center">
                                <td colspan="4">No users listed for this application</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table> -->
                <!-- </v-row> -->
            </v-card>
            <v-expansion-panels accordion class="mt-5">
                <v-expansion-panel>
                    <v-expansion-panel-header>Flights Bookings</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p v-if="details.flightBookings.length === 0" class="display-1 font-weight-thin">No flights bookings found</p>
                        <v-data-table
                        v-if="details.flightBookings.length > 0"
                        :items="details.flightBookings"
                        :headers="headers"
                        :items-per-page="10"
                        class="elevation-1"
                        >
                            <template v-slot:item.booking_reference="{ item }">
                                <v-btn text small color="blue lighten--1" @click="$router.push({ name: 'onePnr', params: { id: item.id } })">{{ item.booking_reference }}</v-btn>
                            </template>
                            <template v-slot:item.price="{ item }">
                                <span>${{item.price}}</span>
                            </template>
                            <template v-slot:item.booking_date="{ item }">
                                <p>{{ getThisDate(item.booking_date) }}</p>
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>Hotels Bookings</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p v-if="details.hotelBookings.length === 0" class="display-1 font-weight-thin">No hotels bookings found</p>
                        <v-data-table
                        v-if="details.hotelBookings.length > 0"
                        :items="details.hotelBookings"
                        :items-per-page="10"
                        :headers="hotelHeaders"
                        class="elevation-1"
                        >
                            <template v-slot:item.booking_reference="{ item }">
                                <v-btn v-if="item.booking_reference" text small color="blue lighten--1" @click="$router.push({ name: 'hotelBookings', params: { id: item.id } })">{{ item.booking_reference }}</v-btn>
                            </template>
                            <template v-slot:item.totalPrice="{ item }">
                                <span>${{item.totalPrice.split('.')[0]}}.{{item.totalPrice.split('.')[1].substring(0, 2)}}</span>
                            </template>
                            <template v-slot:item.paidPrice="{ item }">
                                <span v-if="item.paidPrice">${{item.paidPrice.split('.')[0]}}.{{item.paidPrice.split('.')[1].substring(0, 2)}}</span>
                            </template>
                            <template v-slot:item.booking_date="{ item }">
                                {{ getThisDate(item.booking_date.substr(0, 10)) }}
                            </template>
                            <template v-slot:item.desc="{ item }">
                                {{item.guests.length}} guests, {{item.rooms.length}} rooms
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>Cars Bookings</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <p v-if="details.carBookings.length === 0" class="display-1 font-weight-thin">No Cars bookings found</p>
                        <v-data-table
                        v-if="details.carBookings.length > 0"
                        :items="details.carBookings"
                        :items-per-page="10"
                        :headers="carsHeaders"
                        class="elevation-1"
                        >
                            <template v-slot:item.booking_reference="{ item }">
                                <v-btn text small color="blue lighten--1" @click="$router.push({ name: 'showCarBooking', params: { id: item.id } })">{{ item.booking_reference }}</v-btn>
                            </template>
                            <template v-slot:item.price="{ item }">
                                ${{item.price}}
                            </template>
                            <template v-slot:item.booking_date="{ item }">
                                {{ getThisDate(item.booking_date.substr(0, 10)) }}, {{item.booking_date.substr(11, 16)}}
                            </template>
                        </v-data-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
        <h3 class="mx-5 mt-5" v-if="details === null && loaded === false">Something went wrong with this page</h3>
        <v-dialog v-model="updateDialog" max-width="500px" persistent>
            <clientForm :currentApp="details.id" :emails="details.emails" type="edit" @newApp="updateApp" @closeDialog="updateDialog = false" />
        </v-dialog>
  </div>
</template>

<script>
import { headers, client } from '../links'
import clientForm from '../components/clientForm.vue'

export default {
  components: {
    clientForm
  },
  data () {
    return {
      details: [],
      userHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Role', value: 'role' }
      ],
      headers: [
        { text: 'PNR', value: 'booking_reference' },
        { text: 'Contact Name', value: 'contact_person' },
        { text: 'Contact Phone', value: 'contact_phone' },
        { text: 'Contact Email', value: 'contact_email' },
        { text: 'Price', value: 'price' },
        { text: 'Payment Type', value: 'payment_type' },
        { text: 'Status', value: 'status' },
        { text: 'Booked on', value: 'booking_date' },
        { text: 'Booked By', value: 'booked_by' }
      ],
      hotelHeaders: [
        { text: 'Booking', value: 'booking_reference' },
        { text: 'Name', value: 'contact_name' },
        { text: 'Emial', value: 'contact_email' },
        { text: 'Phone', value: 'contact_phone' },
        { text: 'Booked By', value: 'booked_by' },
        { text: 'Total Price', value: 'totalPrice' },
        { text: 'Paid Price', value: 'paidPrice' },
        { text: 'Status', value: 'booking_status' },
        { text: 'Payment', value: 'payment_status' },
        { text: 'Date', value: 'booking_date' }
      ],
      carsHeaders: [
        { text: 'Booking', value: 'booking_reference' },
        { text: 'Name', value: 'contact_person' },
        { text: 'Emial', value: 'contact_email' },
        { text: 'Phone', value: 'contact_phone' },
        { text: 'Booked By', value: 'booked_by' },
        { text: 'Total Price', value: 'price' },
        { text: 'Status', value: 'status' },
        { text: 'Date', value: 'booking_date' }
      ],
      snackbar: false,
      color: '',
      text: '',
      updateDialog: false,
      loaded: true
    }
  },
  methods: {
    getThisDate (date) {
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${day} ${months[month - 1]} ${year}`
    },
    updateApp (app) {
      this.details = app
      this.updateDialog = false
    }
  },
  beforeCreate () {
    this.$http.get(client(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      this.loaded = false
      if (response.status === 200) {
        this.details = response.body.data
      }
    })
  }
}
</script>
