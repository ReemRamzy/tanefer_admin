<template>
  <div>
    <vue-html2pdf
    v-if="details !== null"
    :show-layout="false"
    :enable-download="true"
    :preview-modal="false"
    :paginate-elements-by-height="2000"
    :filename="`Booking - ${details.pnr_id} - Details`"
    :pdf-quality="2"
    :manual-pagination="true"
    pdf-format="a4"
    pdf-orientation="landscape"
    pdf-content-width="100%"
    ref="html2Pdf"
    >
      <section slot="pdf-content" style="margin: 50px;">
        <v-container>
            <v-row justify="space-between" class="px-5">
                <h3 class="pdf-header">Booking Details</h3>
            </v-row>
            <hr class="hor">
            <v-card>
                <v-row>
                    <v-simple-table dense style="width: 100%;">
                        <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Booking Ref</th>
                                <th class="text-left">Total Price</th>
                                <th class="text-left">Paid Price</th>
                                <th class="text-left">Status</th>
                                <th class="text-left">Booked By</th>
                                <th class="text-left">Booked From</th>
                                <th class="text-left">Trip ID</th>
                                <th class="text-left">Date</th>
                                <th class="text-left">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ details.booking_number }}</td>
                                <td>${{ details.total_amount }}</td>
                                <td>${{ details.paid_price ? details.paid_price : 0 }}</td>
                                <td>{{ details.hotel_booking_status.name }}</td>
                                <td>{{ details.user ? details.user.name : '' }}</td>
                                <td>{{ details.client ? details.client.name : '' }}</td>
                                <td>{{ details.trip_id }}</td>
                                <td>{{ details.created_at.substr(0,10) }}</td>
                                <td>{{ details.created_at.substr(11,20) }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-row>
            </v-card>
            <h3 class="pdf-header">Payment Details</h3>
            <hr class="hor">
            <v-card>
                <v-row class="mt-5">
                    <v-simple-table dense style="width: 100%;">
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Payment Status</th>
                            <th class="text-left">Auth Code</th>
                            <th class="text-left">Price Change Factor</th>
                            <th class="text-left">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ details.payment_status.name }}</td>
                            <td>{{ details.payment_auth_code }}</td>
                            <td>${{ details.price_change_factor ? details.price_change_factor : 0 }}</td>
                            <td>{{ details.payment_transaction_id }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                </v-row>
            </v-card>
            <h3 class="pdf-header">Contact Person Details</h3>
            <hr class="hor">
            <v-card>
                <v-row class="mt-5">
                <v-simple-table dense style="width: 100%;">
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Email</th>
                            <th class="text-left">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ details.contact_name_person }}</td>
                            <td>{{ details.contact_email }}</td>
                            <td>{{ details.contact_phone }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                </v-row>
            </v-card>
            <h3 class="pdf-header">Hotel Details</h3>
            <hr class="hor">
            <v-card>
                <v-row class="mt-5">
                <v-simple-table dense style="width: 100%;">
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Code</th>
                            <th class="text-left">Last Cancellartion Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ details.hotel_name }}</td>
                            <td>{{ details.hotel_code }}</td>
                            <td>{{ details.last_cancellation_deadline }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                </v-row>
            </v-card>
            <h3 class="pdf-header">Passengers Details</h3>
            <hr class="hor">
            <v-card>
                <v-row class="mt-5">
                <v-simple-table dense style="width: 100%;">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Title</th>
                                <th class="text-left">Name</th>
                                <th class="text-left">Is Leader</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="guest in details.hotel_guests" :key="guest.id">
                                <td>{{ guest.title }}</td>
                                <td>{{ guest.first_name }} {{ guest.last_name }}</td>
                                <td>{{ guest.isLead === 1 ? 'Yes' : 'No' }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                </v-row>
            </v-card>
            <h3 class="pdf-header">Hotel Rooms</h3>
            <hr class="hor">
            <v-card>
                <v-row class="mt-5">
                <v-simple-table dense style="width: 100%;">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Room Type</th>
                                <th class="text-left">Base Fare</th>
                                <th class="text-left">Total Fare</th>
                                <th class="text-left">Tax</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="room in details.hotel_rooms" :key="room.id">
                                <td>{{ room.room_type }}</td>
                                <td>${{ room.base_fare }} {{ room.last_name }}</td>
                                <td>${{ room.total_fare }}</td>
                                <td>${{ room.tax }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                </v-row>
            </v-card>
        </v-container>
      </section>
    </vue-html2pdf>
    <v-progress-linear
      indeterminate
      color="orange"
      :active="loaded"
      height="6"
    ></v-progress-linear>
    <v-container v-if="details !== null && loaded === false">
      <v-snackbar v-model="snackbar" :timeout="5000" top :color="color">
        {{text}}
        <v-btn
        icon
        @click="snackbar = false"
        >
          <v-icon right>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <v-row justify="space-between" class="px-5">
        <h3 class="orange--text">Booking Details</h3>
        <v-btn :loading="pdfProgress" @click="generateReport" icon>
          <v-icon large color="red darken--2">mdi-file-pdf</v-icon>
        </v-btn>
      </v-row>
      <hr class="hor">
      <v-card class="pa-5 mt-5">
        <v-row class="mt-5">
          <v-simple-table dense style="width: 100%;">
            <template v-slot:default>
              <thead>
                  <tr>
                      <th class="text-left">Booking Ref</th>
                      <th class="text-left">Total Price</th>
                      <th class="text-left">Paid Price</th>
                      <th class="text-left">Status</th>
                      <th class="text-left">Booked By</th>
                      <th class="text-left">Booked From</th>
                      <th class="text-left">Trip ID</th>
                      <th class="text-left">Date</th>
                      <th class="text-left">Time</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ details.booking_number }}</td>
                      <td>${{ details.total_amount }}</td>
                      <td>${{ details.paid_price ? details.paid_price : 0 }}</td>
                      <td>{{ details.hotel_booking_status.name }}</td>
                      <td>{{ details.user ? details.user.name : '' }}</td>
                      <td>{{ details.client ? details.client.name : '' }}</td>
                      <td>{{ details.trip_id }}</td>
                      <td>{{ details.created_at.substr(0,10) }}</td>
                      <td>{{ details.created_at.substr(11,20) }}</td>
                  </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
        <v-card-actions class="pt-5" v-if="details.hotel_booking_status.name !== 'Cancelled'">
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="dialog = true">
              <v-icon left>mdi-pencil</v-icon>
              Update status
          </v-btn>
        </v-card-actions>
      </v-card>
      <h3 class="orange--text mt-5">Payment Details</h3>
      <hr class="hor">
      <v-card class="pa-5 mt-5">
        <v-row class="mt-5">
            <v-simple-table dense style="width: 100%;">
            <template v-slot:default>
              <thead>
                  <tr>
                      <th class="text-left">Payment Status</th>
                      <th class="text-left">Auth Code</th>
                      <th class="text-left">Price Change Factor</th>
                      <th class="text-left">Transaction ID</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ details.payment_status.name }}</td>
                      <td>{{ details.payment_auth_code }}</td>
                      <td>${{ details.price_change_factor ? details.price_change_factor : 0 }}</td>
                      <td>{{ details.payment_transaction_id }}</td>
                  </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
      </v-card>
      <h3 class="orange--text mt-5">Contact Person Details</h3>
      <hr class="hor">
      <v-card class="pa-5 mt-5">
        <v-row class="mt-5">
          <v-simple-table dense style="width: 100%;">
            <template v-slot:default>
              <thead>
                  <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Email</th>
                      <th class="text-left">Phone</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ details.contact_name_person }}</td>
                      <td>{{ details.contact_email }}</td>
                      <td>{{ details.contact_phone }}</td>
                  </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
      </v-card>
      <h3 class="orange--text mt-5">Hotel Details</h3>
      <hr class="hor">
      <v-card class="pa-5 mt-5">
        <v-row class="mt-5">
          <v-simple-table dense style="width: 100%;">
            <template v-slot:default>
              <thead>
                  <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">Code</th>
                      <th class="text-left">Last Cancellartion Deadline</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ details.hotel_name }}</td>
                      <td>{{ details.hotel_code }}</td>
                      <td>{{ details.last_cancellation_deadline }}</td>
                  </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
      </v-card>
      <h3 class="orange--text mt-5">Passengers Details</h3>
      <hr class="hor">
      <v-card class="pa-5 mt-5">
        <v-row class="mt-5">
          <v-simple-table dense style="width: 100%;">
              <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Title</th>
                        <th class="text-left">Name</th>
                        <th class="text-left">Is Leader</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="guest in details.hotel_guests" :key="guest.id">
                        <td>{{ guest.title }}</td>
                        <td>{{ guest.first_name }} {{ guest.last_name }}</td>
                        <td>{{ guest.isLead === 1 ? 'Yes' : 'No' }}</td>
                    </tr>
                </tbody>
              </template>
          </v-simple-table>
        </v-row>
      </v-card>
      <h3 class="orange--text mt-5">Hotel Rooms</h3>
      <hr class="hor">
      <v-card class="pa-5 mt-5">
        <v-row class="mt-5">
          <v-simple-table dense style="width: 100%;">
              <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Room Type</th>
                        <th class="text-left">Base Fare</th>
                        <th class="text-left">Total Fare</th>
                        <th class="text-left">Tax</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="room in details.hotel_rooms" :key="room.id">
                        <td>{{ room.room_type }}</td>
                        <td>${{ room.base_fare }} {{ room.last_name }}</td>
                        <td>${{ room.total_fare }}</td>
                        <td>${{ room.tax }}</td>
                    </tr>
                </tbody>
              </template>
          </v-simple-table>
        </v-row>
      </v-card>
      <v-dialog v-model="dialog" persistent :width="$vuetify.breakpoint.smAndDown ? '90%' : '50%'">
          <v-card>
              <v-card-text class="text-center">
                  <v-row justify="center">
                      <v-col cols="12" v-if="$store.state.hotelStatus.length > 0">
                          <v-select
                          :items="$store.state.hotelStatus"
                          label="Status"
                          item-text="name"
                          item-value="id"
                          solo
                          :menu-props="{nudgeTop: -50}"
                          v-model="status"
                          >
                          </v-select>
                      </v-col>
                  </v-row>
                  <v-card-actions class="text-center">
                      <v-btn
                      color="warning"
                      tile
                      @click="dialog = false"
                      >
                      cancel
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                      color="blue white--text"
                      @click="updateHotelStatus"
                      tile
                      >
                        Update status
                      </v-btn>
                  </v-card-actions>
              </v-card-text>
          </v-card>
      </v-dialog>
    </v-container>
    <h3 class="mx-5 mt-5" v-if="details === null && loaded === false">Something went wrong with this page</h3>
  </div>
</template>

<script>
import { headers, hotelStatuses, updateHotelStatus, showHotelBooking } from '../links'
import VueHtml2pdf from 'vue-html2pdf'

export default {
  components: {
    VueHtml2pdf
  },
  data () {
    return {
      details: null,
      snackbar: false,
      color: '',
      text: '',
      dialog: false,
      pdfProgress: false,
      status: null,
      loaded: true
    }
  },
  methods: {
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    },
    updateHotelStatus () {
      if (this.status !== null) {
        this.$http.patch(updateHotelStatus(this.details.id), { hotel_booking_status_id: this.status }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.dialog = false
          if (response.body.status === true) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Booking Updated successfully'
            this.details = response.body.data
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please choose a status'
      }
    }
  },
  beforeCreate () {
    this.$http.get(showHotelBooking(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      this.loaded = false
      if (response.body.status === true) {
        this.details = response.body.data
      }
    })
  },
  created () {
    if (this.$store.state.hotelStatus.length === 0) {
      this.$http.get(hotelStatuses, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status !== false) {
          this.$store.dispatch('setHotelStatus', response.body.data)
        }
      })
    }
  }
}
</script>

<style>
    .hor {
        border: none;
        height: 2px;
        width: 169px;
        background-color: #DF731C;
        margin: 20px 0;
    }
    .pdf-header {
        color: #DF731C;
        margin: 20px;
    }
</style>
