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
        <v-card>
            <v-card-title>
                <v-row justify="space-between">
                    <span class="headline orange--text">Seasons</span>
                    <v-btn class="primary" @click="actionType = 'add'; seasonActionsDialog = true">Add Season</v-btn>
                </v-row>
            </v-card-title>
            <v-simple-table>
                <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">
                        Start Date
                        </th>
                        <th class="text-left">
                        End Date
                        </th>
                        <th class="text-right">
                        Edit
                        </th>
                        <th class="text-right">
                        Remove
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="(item, i) in seasons"
                    :key="i"
                    >
                        <td><dateDisplay :date="item.seasonStartDate" /></td>
                        <td><dateDisplay :date="item.seasonEndDate" /></td>
                        <td class="text-right">
                            <v-btn :disabled="onLoad"  icon color="blue" large @click="seasonActionsDialog = true; startDate = item.seasonStartDate; endDate = item.seasonEndDate; seasonId = item.seasonID; actionType = 'edit'">
                            <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </td>
                        <td class="text-right">
                            <v-btn :disabled="onLoad"  icon color="error" large @click="removeSeason(item.seasonID)">
                            <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </v-card>
        <v-dialog max-width="700" v-model="seasonActionsDialog">
          <v-card>
            <v-card-title>{{actionType === 'add' ? 'Add Season' : 'Update Season' }}</v-card-title>
            <v-card-text>
              <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="10"
              transition="scale-transition"
              min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="Start Date"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    color="blue"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  @input="menu = false"
                  show-current
                  :min="new Date().toISOString().substr(0, 10)"
                ></v-date-picker>
              </v-menu>
              <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="10"
              transition="scale-transition"
              min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="End Date"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    color="blue"
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    :disabled="!startDate"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  @input="menu1 = false"
                  :min="startDate"
                  show-current
                ></v-date-picker>
              </v-menu>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="warning" @click="seasonActionsDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn :disabled="!startDate || !endDate" :loading="addLoad" v-if="actionType === 'add'" class="success" @click="addSeason">Add season</v-btn>
              <v-btn :disabled="!startDate || !endDate" :loading="editLoad" v-else class="success" @click="editSeason">Update season</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { hotelSeasons, removeHotelSeasons, addHotelSeasons, editHotelSeasons, headers } from '../../links'
import dateDisplay from '../../components/dateDisplay'

export default {
  components: {
    dateDisplay
  },
  data () {
    return {
      seasons: [],
      onLoad: false,
      snackbar: false,
      color: '',
      text: '',
      seasonActionsDialog: false,
      actionType: 'add',
      menu: false,
      startDate: '',
      menu1: false,
      endDate: '',
      addLoad: false,
      editLoad: false,
      seasonId: null
    }
  },
  methods: {
    getSeasons () {
      this.$http.get(hotelSeasons, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.seasons = response.body.data
        }
      })
    },
    removeSeason (id) {
      this.onLoad = true
      this.$http.delete(removeHotelSeasons(id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.onLoad = false
        if (response.body.status === 200) {
          this.getSeasons()
          this.snackbar = true
          this.color = 'success'
          this.text = 'Deleted Successfully'
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.onLoad = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    },
    editSeason () {
      this.editLoad = true
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('start_date', this.startDate)
      formData.append('end_date', this.endDate)
      this.$http.post(editHotelSeasons(this.seasonId), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.editLoad = false
        this.seasonActionsDialog = false
        if (response.body.status === 200) {
          this.getSeasons()
          this.snackbar = true
          this.color = 'success'
          this.text = 'Updated Successfully'
          this.startDate = ''
          this.endDate = ''
          this.seasonId = null
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.editLoad = false
        this.seasonActionsDialog = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    },
    addSeason () {
      this.addLoad = true
      const formData = new FormData()
      formData.append('start_date', this.startDate)
      formData.append('end_date', this.endDate)
      this.$http.post(addHotelSeasons, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.addLoad = false
        this.seasonActionsDialog = false
        if (response.body.status === 200) {
          this.getSeasons()
          this.snackbar = true
          this.color = 'success'
          this.text = 'Added Successfully'
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.addLoad = false
        this.seasonActionsDialog = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    }
  },
  created () {
    this.getSeasons()
  }
}
</script>
