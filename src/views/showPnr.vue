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
            <h3 style="color: #DF731C;">Booking Details</h3>
            <hr class="hor">
            <div style="margin: 20px auto; background-color: #eee;">
              <v-row class="mt-5">
                <v-simple-table dense style="width: 100%; text-align: center;">
                  <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">PNR</th>
                            <th class="text-left">Date</th>
                            <th class="text-left">Time</th>
                            <th class="text-left">Status</th>
                            <th class="text-left">Booked By</th>
                            <th class="text-left">Booked From</th>
                            <th class="text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ details.pnr_id }}</td>
                            <td>{{ details.created_at.substr(0,10) }}</td>
                            <td>{{ details.created_at.substr(11,20) }}</td>
                            <td>{{ details.status.status }}</td>
                            <th>{{ details.user ? details.user.name : '' }}</th>
                            <th>{{ details.client ? details.client.name : '' }}</th>
                            <td>${{ details.price }}</td>
                        </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-row>
            </div>
            <h3 style="color: #DF731C;">Contact Person Details</h3>
            <hr class="hor">
            <div style="margin: 20px auto; background-color: #eee;">
              <v-row class="mt-5">
                <v-simple-table dense style="width: 100%; text-align: center;">
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
                            <td>{{ details.contact_person }}</td>
                            <td>{{ details.contact_email }}</td>
                            <td>{{ details.contact_phone }}</td>
                        </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-row>
            </div>
            <h3 style="color: #DF731C;">Passengers Details</h3>
            <hr class="hor">
            <div style="margin: 20px auto; background-color: #eee;">
              <v-row class="mt-5">
                <v-simple-table dense style="width: 100%; text-align: center;">
                    <template v-slot:default>
                      <thead>
                          <tr>
                              <th class="text-left">Name</th>
                              <th class="text-left">Birth Date</th>
                              <th class="text-left">Passport</th>
                              <th class="text-left">Passport Expire Date</th>
                              <th class="text-left">Issue Country</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="passenger in details.passenger_details" :key="passenger.id">
                              <td>{{ passenger.passenger_name }}</td>
                              <td>{{ passenger.date_of_birth }}</td>
                              <td>{{ passenger.passport_number }}</td>
                              <td>{{ passenger.passport_expire_date }}</td>
                              <td>{{ passenger.passport_issue_country }}</td>
                          </tr>
                      </tbody>
                    </template>
                </v-simple-table>
              </v-row>
            </div>
            <div class="html2pdf__page-break"></div>
            <h3 style="color: #DF731C; margin-top: 50px;">Flight Segments</h3>
            <hr class="hor">
            <div style="margin: 20px auto;">
              <v-row class="mt-5 pa-5 pdf-div" v-for="(segment, i) in details.flight_segments" :key="segment.id">
                  <h3 style="color: #DF731C;">Segment {{i + 1}}</h3>
                  <v-simple-table dense style="width: 100%;">
                    <template v-slot:default>
                      <thead>
                          <tr>
                              <th class="text-left">Airline</th>
                              <th class="text-left">Flight NO.</th>
                              <th class="text-left">Duration</th>
                              <th class="text-left">From</th>
                              <th class="text-left">To</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>{{ segment.airline }}</td>
                              <td>{{ segment.flight_number }}</td>
                              <td>{{ segment.flight_duration }}h</td>
                              <td>
                                {{ segment.departure_location }}
                                <br>
                                {{segment.departure_date}}, {{segment.departure_time}}
                              </td>
                              <td>
                                {{ segment.arrival_location }}
                                <br>
                                {{segment.arrival_date}}, {{segment.arrival_time}}
                              </td>
                          </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
              </v-row>
            </div>
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
                      <th class="text-left">PNR</th>
                      <th class="text-left">Date</th>
                      <th class="text-left">Time</th>
                      <th class="text-left">Status</th>
                      <th class="text-left">Booked By</th>
                      <th class="text-left">Booked From</th>
                      <th class="text-left">Price</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ details.pnr_id }}</td>
                      <td>{{ details.created_at.substr(0,10) }}</td>
                      <td>{{ details.created_at.substr(11,20) }}</td>
                      <td>{{ details.status.status }}</td>
                      <td>{{ details.user ? details.user.name : '' }}</td>
                      <td>{{ details.client ? details.client.name : '' }}</td>
                      <td>${{ details.price }}</td>
                  </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
        <v-card-actions class="pt-5" v-if="details.status.status !== 'Cancelled'">
          <v-btn color="blue" text @click="dialog = true">
              <v-icon left>mdi-pencil</v-icon>
              Update status
          </v-btn>
          <v-spacer></v-spacer>
          <v-dialog
          v-model="cancelDialog"
          width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" :loading="loadCancelBtn" v-bind="attrs" v-on="on" v-if="details.status.status === 'Initial'" text>
                <v-icon left>mdi-cancel</v-icon>
                Cancel PNR
              </v-btn>
            </template>
            <v-card>

              <v-card-text class="mx-auto my-3 body-1 font-weight-bold pr-5">
                Are you sure that you want to cancel this booking ?
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="orange"
                  text
                  @click="cancelPnr(); cancelDialog = false"
                >
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
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
                      <td>{{ details.contact_person }}</td>
                      <td>{{ details.contact_email }}</td>
                      <td>{{ details.contact_phone }}</td>
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
                        <th class="text-left">Name</th>
                        <th class="text-left">Birth Date</th>
                        <th class="text-left">Passport</th>
                        <th class="text-left">Passport Expire Date</th>
                        <th class="text-left">Issue Country</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="passenger in details.passenger_details" :key="passenger.id">
                        <td>{{ passenger.passenger_name }}</td>
                        <td>{{ passenger.date_of_birth }}</td>
                        <td>{{ passenger.passport_number }}</td>
                        <td>{{ passenger.passport_expire_date }}</td>
                        <td>{{ passenger.passport_issue_country }}</td>
                    </tr>
                </tbody>
              </template>
          </v-simple-table>
        </v-row>
      </v-card>
      <h3 class="orange--text mt-5">Flight Segments</h3>
      <hr class="hor">

      <v-row class="mt-5" v-for="(segment, i) in details.flight_segments" :key="segment.id">
        <v-card class="pa-5 mt-5" width="100%">
          <h5 class="orange--text">Segment {{i + 1}}</h5>
          <v-simple-table dense style="width: 100%;">
            <template v-slot:default>
              <thead>
                  <tr>
                      <th class="text-left">Airline</th>
                      <th class="text-left">Flight NO.</th>
                      <th class="text-left">Duration</th>
                      <th class="text-left">From</th>
                      <th class="text-left">To</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>{{ segment.airline }}</td>
                      <td>{{ segment.flight_number }}</td>
                      <td>{{ segment.flight_duration }}h</td>
                      <td>
                        {{ segment.departure_location }}
                        <br>
                        {{segment.departure_date}}, {{segment.departure_time}}
                      </td>
                      <td>
                        {{ segment.arrival_location }}
                        <br>
                        {{segment.arrival_date}}, {{segment.arrival_time}}
                      </td>
                  </tr>
              </tbody>
            </template>
          </v-simple-table>
          </v-card>
      </v-row>

      <v-dialog v-model="dialog" persistent :width="$vuetify.breakpoint.smAndDown ? '90%' : '50%'">
          <v-card>
              <v-card-text class="text-center">
                  <v-row justify="center">
                      <v-col cols="12" v-if="statuses.length > 0">
                          <v-select
                          :items="statuses"
                          label="Status"
                          item-text="status"
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
                      @click="updatePnr"
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
import { headers, pnrStatus, updatePnr, cancelPnr, showPNR } from '../links'
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
      cancelDialog: false,
      statuses: [],
      pdfProgress: false,
      status: null,
      loadCancelBtn: false,
      loaded: true
    }
  },
  methods: {
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    },
    cancelPnr () {
      this.loadCancelBtn = true
      this.$http.post(cancelPnr, { pnr: this.details.pnr_id }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loadCancelBtn = false
        if (response.body.status === true) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'PNR cancelled successfully'
          this.details = response.body.data
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      })
    },
    updatePnr () {
      if (this.status !== null) {
        this.$http.patch(updatePnr(this.details.id), { status_id: this.status }, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.dialog = false
          if (response.body.status === true) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'PNR Updated successfully'
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
    this.$http.get(showPNR(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      this.loaded = false
      if (response.body.status === true) {
        this.details = response.body.data
      }
    })
  },
  created () {
    this.$http.get(pnrStatus, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status !== false) {
        this.statuses = response.body.data.filter(item => item.status !== 'Cancelled')
      }
    })
  }
}
</script>

<style>
    .hor {
      border: none;
      height: 2px;
      width: 169px;
      background-color: #DF731C;
    }
    .pdf-div {
      background-color: white;
      padding: 10px;
      margin: 10px auto;
    }
</style>
