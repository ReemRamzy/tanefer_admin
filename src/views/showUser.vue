<template>
    <div>
        <v-progress-linear
        indeterminate
        color="orange"
        :active="loaded"
        height="6"
        ></v-progress-linear>
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
        <v-container v-if="details && loaded === false">
            <v-card class="pa-5 mt-5">
                <v-card-title class="orange--text">
                    <v-row justify="space-between">
                        User Details
                        <div>
                            <v-btn elevation="0" class="mr-5" color="blue white--text" @click="updateDialog = true">
                                <v-icon left>mdi-account-edit</v-icon>
                                Edit User
                            </v-btn>
                            <v-btn elevation="0" color="blue white--text" @click="rolesDialog = true">
                                <v-icon left>mdi-account-settings</v-icon>
                                Update Roles
                            </v-btn>
                        </div>
                    </v-row>
                </v-card-title>
                <v-row class="mt-5">
                    <v-simple-table dense style="width: 100%;">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Name</th>
                                <th class="text-left">Email</th>
                                <th class="text-left">Phone</th>
                                <th class="text-left">Registered from</th>
                                <th class="text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ details.name }}</td>
                                <td>{{ details.email }}</td>
                                <td>{{ details.phone }}</td>
                                <td>{{ details.registeredFrom }}</td>
                                <td>{{ details.role }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-row>
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
                        class=""
                        >
                            <template v-slot:item.booking_reference="{ item }">
                                <span>{{item.booking_reference}}</span>
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
                        class=""
                        >
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
                        class=""
                        >
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
            <userForm type="edit" :User="details" @closeDialog="updateDialog = false" @newUser="updateUser" />
        </v-dialog>
        <v-dialog v-model="rolesDialog" max-width="500px" persistent>
            <v-card>
                <v-card-title class="orange--text">
                    <v-row justify="space-between">
                        Modify User Roles
                        <v-btn icon color="orange" @click="rolesDialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row justify="space-between">
                        <v-select
                        :items="allRoles"
                        v-model="role"
                        label="Choose Role"
                        item-text="name"
                        item-value="id"
                        outlined
                        :menu-props="{nudgeTop: -50}"
                        >
                        </v-select>
                        <v-btn class="ml-1" height="53" large color="blue white--text" @click="updateRole('add')">Add Role</v-btn>
                    </v-row>
                    <v-divider></v-divider>
                    <v-simple-table dense style="width: 100%;">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="orange--text text-left">Role</th>
                                <th class="orange--text text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in roles" :key="item">
                                <td>{{ item }}</td>
                                <td class="text-right">
                                    <v-btn icon color="error" @click="updateRole('delete', item)">
                                        <v-icon>mdi-trash-can-outline</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
                <v-card-actions></v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { headers, showUser, updateUserRole, userRoles } from '../links'
import userForm from '../components/userForm.vue'

export default {
  components: {
    userForm
  },
  data () {
    return {
      details: null,
      allRoles: [],
      roles: [],
      role: '',
      updateDialog: false,
      rolesDialog: false,
      valid: true,
      loaded: true,
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
      text: ''
    }
  },
  methods: {
    getThisDate (date) {
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${day} ${months[month - 1]} ${year}`
    },
    updateUser (user) {
      this.details = user
    },
    updateRole (action, role) {
      let newRole = ''
      if (action === 'delete') newRole = role
      else newRole = this.role
      if ((action === 'add' && this.role) || action === 'delete') {
        this.$http.patch(updateUserRole(this.$route.params.id), { action: action, role: newRole }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = response.body.message
            this.roles = response.body.data.role.split(',')
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
        }, () => {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong'
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose a role'
      }
    }
  },
  beforeCreate () {
    this.$http.get(showUser(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      this.loaded = false
      if (response.status === 200) {
        this.details = response.body.data
        this.roles = this.details.role.split(',')
      }
    }, () => {
      this.loaded = false
    })
    this.$http.get(userRoles, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status) this.allRoles = response.body.data
    })
  }
}
</script>
