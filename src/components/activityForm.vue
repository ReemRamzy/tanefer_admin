<template>
    <div>
        <v-snackbar v-model="snackbar" :color="color" :timeout="3000" top>
            <v-row>
                <span>{{text}}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="snackbar = false">
                    <v-icon color="white">mdi-close</v-icon>
                </v-btn>
            </v-row>
        </v-snackbar>
        <v-card class="pa-3">
            <v-card-title>{{type === 'add' ? 'Add' : 'Update'}} Activity</v-card-title>
            <v-card-text>
                <v-form v-model="valid" ref="form">
                    <v-text-field label="Activity Title" v-model="activity.activityTitle" type="text" outlined class="mt-3" :rules="[v => !!v || 'item is required']" color="blue">
                    </v-text-field>
                    <v-text-field label="Activity Sort" v-model="activity.activitySort" type="text" outlined class="mt-3" :rules="[v => !!v || 'item is required']" color="blue">
                    </v-text-field>
                    <v-checkbox v-model="activity.published" label="Published Adventure"></v-checkbox>
                    <h5 class="text-h5 black--text font-weight-bold">Intro</h5>
                    <!-- <wysiwyg v-model="activity.activityIntro" /> -->
                    <editor
                    v-model="activity.activityIntro"
                    api-key="x21puj7j5tdxkuct1ma1pa63pwru6yf0skeh4huvvgxv4f5x"
                    :init="{
                      placeholder: 'Intro',
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link anchor',
                        'insertdatetime table paste',
                        'fontsize color'
                      ],
                      toolbar:
                        'undo redo | formatselect | fontselect fontsizeselect | \
                        bold italic | forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat'
                    }"
                    />
                    <br>
                    <h5 class="text-h5 black--text font-weight-bold">Itinerary</h5>
                    <!-- <wysiwyg v-model="activity.activityItinerary" /> -->
                    <editor
                    v-model="activity.activityItinerary"
                    api-key="x21puj7j5tdxkuct1ma1pa63pwru6yf0skeh4huvvgxv4f5x"
                    :init="{
                      placeholder: 'Itinerary',
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link anchor',
                        'insertdatetime table paste',
                        'fontsize color'
                      ],
                      toolbar:
                        'undo redo | formatselect | fontselect fontsizeselect | \
                        bold italic | forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat'
                    }"
                    />
                    <br>
                    <h5 class="text-h5 black--text font-weight-bold">Notes</h5>
                    <!-- <wysiwyg v-model="activity.activityOverview" /> -->
                    <editor
                    v-model="activity.activityOverview"
                    api-key="x21puj7j5tdxkuct1ma1pa63pwru6yf0skeh4huvvgxv4f5x"
                    :init="{
                      placeholder: 'Notes',
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link anchor',
                        'insertdatetime table paste',
                        'fontsize color'
                      ],
                      toolbar:
                        'undo redo | formatselect | fontselect fontsizeselect | \
                        bold italic | forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat'
                    }"
                    />
                    <v-select class="mt-5" v-model="activity.activityType" :items="['sightseeing', 'camping']" color="blue" outlined label="Activity type" :rules="[v => !!v || 'type is required']" @input="createDaysArray">
                    </v-select>
                    <v-select v-model="activity.activityCity.CityID" :items="cities" item-value="CityID" item-text="CityName" color="blue" outlined label="Activity City" :rules="[v => !!v || 'city is required']">
                    </v-select>
                    <v-card class="my-4 pa-4 text-center" v-for="(availability, index) in activity.availabilities" :key="index">
                      <div>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="menu3[index]"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template #activator="{ on, attrs }">
                                <v-text-field
                                  v-model="availability.from_date"
                                  label="From Date"
                                  prepend-inner-icon="mdi-calendar"
                                  append-inner-icon="mdi-pencil"
                                  readonly
                                  outlined
                                  :rules="[v => !!v || 'From Date is required!']"
                                  v-bind="attrs"
                                  persistent-hint
                                  v-on="on"
                                />
                              </template>
                              <v-date-picker
                                v-model="availability.from_date"
                                :min="new Date().toISOString().substr(0, 10)"
                                @input="menu3[index] = false"
                              />
                            </v-menu>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-menu
                              v-model="menu4[index]"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template #activator="{ on, attrs }">
                                <v-text-field
                                  v-model="availability.to_date"
                                  label="To Date"
                                  prepend-inner-icon="mdi-calendar"
                                  append-inner-icon="mdi-pencil"
                                  readonly
                                  outlined
                                  :rules="[v => !!v || 'To Date is required!']"
                                  v-bind="attrs"
                                  persistent-hint
                                  v-on="on"
                                />
                              </template>
                              <v-date-picker
                                v-model="availability.to_date"
                                :min="new Date().toISOString().substr(0, 10)"
                                @input="menu4[index] = false"
                              />
                            </v-menu>
                          </v-col>
                        </v-row>
                        <table id="" class="text-center">
                          <tbody>
                            <tr v-for="(pricingTier, tierIndex) in availability.pricingtiers" :key="tierIndex">
                              <td>
                                <v-text-field v-model="pricingTier.name" label="Name" outlined class="inputNumber mx-1" type="text" color="blue">
                                </v-text-field>
                              </td>
                              <td>
                                <v-text-field v-model="pricingTier.min" label="Min" outlined class="inputNumber mx-1" type="number" color="blue">
                                </v-text-field>
                              </td>
                              <td>
                                <v-text-field v-model="pricingTier.max" label="Max" outlined class="inputNumber mx-1" type="number" color="blue">
                                </v-text-field>
                              </td>
                              <td>
                                <v-text-field v-model="pricingTier.adult_price" label="Price" outlined class="inputNumber mx-1" type="number" color="blue" prefix="$">
                                </v-text-field>
                              </td>
                              <td>
                                <v-text-field v-model="pricingTier.max_child" label="Max Child" outlined class="inputNumber mx-1" type="number" color="blue">
                                </v-text-field>
                              </td>
                              <td>
                                <v-text-field v-model="pricingTier.child_percentage" label="Child Percentage" outlined class="inputNumber mx-1" type="number" color="blue" prefix="%" :rules="minMaxRules">
                                </v-text-field>
                              </td>
                              <td>
                                <v-btn @click="removePricingTier(index, tierIndex)" color="red" icon elevation="4" style="margin-top: -35px;">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <v-btn @click="addNewPricingtier(index)" color="primary" class="mr-4">Add New Pricingtier</v-btn>
                      <v-btn @click="removeAvailability(index)" color="red">Remove Availability</v-btn>
                    </v-card>
                    <v-btn @click="addNewAvailability()" color="primary" class="mb-4">Add New Availability</v-btn>

                    <v-text-field label="Activity Duration Digits" outlined v-model="activity.activityDuration_digits" type="number" :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']" color="blue" class="mx-1" @input="createDaysArray">
                    </v-text-field>

                    <v-select
                      v-model="activity.activityDuration_type"
                      :items="[{text:'Hour(s)', value:'hour'}, {text:'Days(s)',value:'day'}, {text:'Week',value:'week'}]"
                      color="blue"
                      item-text="text"
                      item-value="value"
                      outlined
                      label="Activity Duration Type"
                      :rules="[v => !!v || 'type is required']"
                      @input="createDaysArray">
                    </v-select>

                    <!-- start days -->
                    <v-select
                      v-model="activity.start_days"
                      :items="['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']"
                      :menu-props="{ maxHeight: '400' }"
                      label="Choose Start Days"
                      :rules="[v => !!v || 'item is required']"
                      prepend-inner-icon="mdi-calendar"
                      chips
                      deletable-chips
                      multiple outlined
                      class="mt-5"
                    ></v-select>

                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      :return-value.sync="activity.activityStartTime"
                      transition="scale-transition"
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="activity.activityStartTime" label="Activity Start Time" prepend-inner-icon="mdi-clock-time-four-outline" readonly outlined color="blue" v-bind="attrs" v-on="on" class="mx-1">
                          </v-text-field>
                      </template>
                      <v-card>
                          <v-time-picker
                          format="ampm"
                          v-model="activity.activityStartTime"
                          full-width
                          ></v-time-picker>
                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn tile color="success" @click="$refs.menu1.save(activity.activityStartTime)">Save</v-btn>
                          </v-card-actions>
                      </v-card>
                    </v-menu>
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :return-value.sync="activity.activityEndTime"
                      transition="scale-transition"
                      max-width="290px"
                      min-width="290px"
                      >
                      <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="activity.activityEndTime" label="Activity End Time" prepend-inner-icon="mdi-clock-time-four-outline" readonly outlined color="blue" v-bind="attrs" v-on="on" class="mx-1">
                          </v-text-field>
                      </template>
                      <v-card>
                          <v-time-picker
                          format="ampm"
                          v-model="activity.activityEndTime"
                          full-width
                          ></v-time-picker>
                          <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn tile color="success" @click="$refs.menu2.save(activity.activityEndTime)">Save</v-btn>
                          </v-card-actions>
                      </v-card>
                    </v-menu>
                    <v-file-input
                      v-model="image"
                      accept="image/*"
                      label="Activity Image"
                      color="blue"
                      outlined
                      show-size
                      multiple
                    ></v-file-input>

                    <p class="body-1 mt-3 gray">Activity Includes</p>
                    <v-text-field
                    placeholder="Add Includes"
                    v-model="include"
                    outlined
                    color="blue"
                    append-icon="mdi-plus-circle"
                    @click:append="addIncludes"
                    >
                    </v-text-field>

                    <v-divider></v-divider>

                    <v-simple-table dense v-if="activity.activityIncludes.length > 0">
                      <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Includes
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, i) in activity.activityIncludes" :key="i">
                                  <td>{{ item }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="activity.activityIncludes.splice(i, 1)">
                                          <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                      </template>
                    </v-simple-table>

                    <p class="body-1 mt-3 gray">Activity Excludes</p>
                    <v-text-field
                      placeholder="Add Excludes"
                      v-model="exclude"
                      outlined
                      color="blue"
                      append-icon="mdi-plus-circle"
                      @click:append="addExcludes"
                    ></v-text-field>

                    <v-divider></v-divider>

                    <v-simple-table dense v-if="activity.activityExcludes.length > 0">
                      <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Excludes
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, i) in activity.activityExcludes" :key="i">
                                  <td>{{ item }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="activity.activityExcludes.splice(i, 1)">
                                          <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                      </template>
                    </v-simple-table>

                    <p v-if="activity.activityType === 'camping'" class="body-1 mt-3 gray">Side Activity</p>
                    <v-row v-if="activity.activityType === 'camping'">
                      <v-text-field
                        placeholder="Side Activity Title"
                        v-model="sideActivity.sideActivityName"
                        outlined
                        color="blue"
                        class="mx-1"
                      >
                      </v-text-field>
                      <v-select
                        v-model="sideActivity.sideActivityDayNumber"
                        :items="activityDays"
                        color="blue"
                        outlined
                        label="Activity Day"
                        :disabled="!activity.activityDuration_digits"
                      >
                      </v-select>
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="sideActivity.sideActivityTime"
                        transition="scale-transition"
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="sideActivity.sideActivityTime" label="Side Activity Time" prepend-inner-icon="mdi-clock-time-four-outline" readonly outlined color="blue" v-bind="attrs" v-on="on" class="mx-1">
                            </v-text-field>
                        </template>
                        <v-card>
                            <v-time-picker
                            format="ampm"
                            v-model="sideActivity.sideActivityTime"
                            full-width
                            ></v-time-picker>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn tile color="success" @click="$refs.menu.save(sideActivity.sideActivityTime)">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                      </v-menu>
                      <v-btn class="ma-1" :fab="$vuetify.breakpoint.mdAndUp" color="success" @click="addSideActivity">
                          <v-icon color="white">mdi-plus</v-icon>
                      </v-btn>
                    </v-row>

                    <v-divider></v-divider>

                    <v-simple-table dense v-if="activity.sideActivity.length > 0">
                      <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Title
                                  </th>
                                  <th class="text-left">
                                      Time
                                  </th>
                                  <th class="text-left">
                                      Day Number
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="(item, i) in activity.sideActivity" :key="i">
                                  <td>{{ item.sideActivityName ? item.sideActivityName : item.activityName }}</td>
                                  <td>{{ item.sideActivityTime ? item.sideActivityTime : item.activityTime }}</td>
                                  <td>Day {{ item.sideActivityDayNumber ? item.sideActivityDayNumber : item.activityDayNumber }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="activity.sideActivity.splice(i, 1)">
                                          <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                      </template>
                    </v-simple-table>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="warning" @click="$emit('close')">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn tile :loading="loading" :disabled="isDisabled()" color="success" @click="takeAction">{{type === 'add' ? 'add' : 'update'}}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { formLists, headers, addActivity, updateActivity } from '../links'
import Editor from '@tinymce/tinymce-vue'

export default {
  props: ['type', 'data'],
  components: {
    editor: Editor
  },
  data () {
    return {
      minMaxRules: [
        v => !!v || 'This field is required',
        v => (v && v >= 0) || 'should be equal 0 or more',
        v => (v && v <= 100) || 'should be equal 100 or less'
      ],
      valid: true,
      snackbar: false,
      menu: false,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      color: '',
      text: '',
      activity: {
        activityTitle: '',
        activitySort: '',
        activityIntro: '',
        activityItinerary: '',
        activityOverview: '',
        activityStartTime: '',
        activityEndTime: '',
        activityPaxMinimum: '1',
        activityIncludes: [],
        activityExcludes: [],
        activityCity: {
          CityID: ''
        },
        activityImage: null,
        activityPricePerPerson: '',
        children_percentage: 0,
        single_supplement_percentage: '',
        solo_price: '',
        Limo_price: '',
        HiAC_price: '',
        Caster_price: '',
        bus_price: '',
        limoChildrenPercentage: '',
        hiacChildrenPercentage: '',
        casterChildrenPercentage: '',
        busChildrenPercentage: '',
        activityDuration_digits: null,
        activityDuration_type: 'hour',
        activityType: 'sightseeing',
        sideActivity: [],
        published: true,
        availabilities: [
          {
            from_date: '',
            to_date: '',
            pricingtiers: [
              {
                name: '',
                min: '',
                max: '',
                adult_price: '',
                max_child: '',
                child_percentage: ''
              }
            ]
          }
        ]
      },
      image: [],
      cities: [],
      include: '',
      exclude: '',
      sideActivity: {
        sideActivityName: '',
        sideActivityTime: '',
        sideActivityDayNumber: ''
      },
      loading: false,
      activityDays: [],
      seasonDateMenu: false,
      seasonDates: []
    }
  },
  watch: {
    data (newVal) {
      this.activity = newVal
    },
    type (newVal) {
      if (newVal === 'edit') {
        this.activity = this.data
      } else {
        this.activity = {
          activityTitle: '',
          activitySort: '',
          activityIntro: '',
          activityItinerary: '',
          activityOverview: '',
          activityStartTime: '',
          activityEndTime: '',
          activityPaxMinimum: '1',
          activityIncludes: [],
          activityExcludes: [],
          activityCity: {
            CityID: ''
          },
          activityImage: null,
          activityPricePerPerson: '',
          children_percentage: 0,
          single_supplement_percentage: '',
          solo_price: '',
          Limo_price: '',
          HiAC_price: '',
          Caster_price: '',
          bus_price: '',
          limoChildrenPercentage: '',
          hiacChildrenPercentage: '',
          casterChildrenPercentage: '',
          busChildrenPercentage: '',
          activityDuration_digits: null,
          activityDuration_type: 'hour',
          activityType: 'sightseeing',
          sideActivity: [],
          published: true,
          start_days: [],
          seasons: [],
          availabilities: [
            {
              from_date: '',
              to_date: '',
              pricingtiers: [
                {
                  name: '',
                  min: '',
                  max: '',
                  adult_price: '',
                  max_child: '',
                  child_percentage: ''
                }
              ]
            }
          ]
        }
        this.include = ''
        this.exclude = ''
        this.sideActivity = {
          sideActivityName: '',
          sideActivityTime: '',
          sideActivityDayNumber: ''
        }
        this.activityDays = []
      }
    }
  },
  methods: {
    setSeason (dates) {
      const firstDate = new Date(dates[0])
      const lastDate = new Date(dates[1])
      if (lastDate.getTime() > firstDate.getTime()) {
        this.activity.seasons.push({
          from: dates[0],
          to: dates[1]
        })
      } else {
        this.activity.seasons.push({
          from: dates[1],
          to: dates[0]
        })
      }
    },
    createDaysArray () {
      // if (this.activity.activityType === 'camping') {
      //   this.activityDays = []
      //   for (let i = 0; i < Number(this.activity.activityDuration_digits); i++) {
      //     this.activityDays[i] = i + 1
      //   }
      // }
      if (this.activity.activityDuration_type === 'day' || this.activity.activityDuration_type === 'week') {
        this.activityDays = []
        for (let i = 0; i < Number(this.activity.activityDuration_digits); i++) {
          this.activityDays[i] = i + 1
        }
      }
    },
    isDisabled () {
      if (
        this.valid === false ||
                this.activity.activityIncludes.length === 0 ||
                this.activity.activityExcludes.length === 0 ||
                (this.activity.activityType === 'camping' && this.activity.sideActivity.length === 0) ||
                this.activity.availabilities.length === 0
      ) return true
      else return false
    },
    addIncludes () {
      if (this.include) {
        this.activity.activityIncludes.push(this.include)
        this.include = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
      }
    },
    addExcludes () {
      if (this.exclude) {
        this.activity.activityExcludes.push(this.exclude)
        this.exclude = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide excludes before submitting'
      }
    },
    addSideActivity () {
      if (this.sideActivity.sideActivityName && this.sideActivity.sideActivityTime) {
        this.activity.sideActivity.push(this.sideActivity)
        this.sideActivity = {
          sideActivityName: '',
          sideActivityTime: '',
          sideActivityDayNumber: ''
        }
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide side activity name and time before submitting'
      }
    },
    takeAction () {
      this.$refs.form.validate()
      if (this.valid) {
        var errorCount = 0
        if (this.activity.availabilities.length > 0) {
          var lastFromDate = null
          var lastToDate = null
          for (let i = 0; i < this.activity.availabilities.length; i++) {
            var lastAvailability = this.activity.availabilities[i]
            if ((lastFromDate != null && lastToDate != null && lastAvailability.from_date > lastToDate) || (lastFromDate == null && lastToDate == null)) {
              if (lastAvailability.to_date > lastAvailability.from_date) {
                lastFromDate = lastAvailability.from_date
                lastToDate = lastAvailability.to_date
              } else {
                this.snackbar = true
                this.color = 'error'
                this.text = '(To Date) must be greater than (From Date)'
                errorCount++
              }
            } else {
              this.snackbar = true
              this.color = 'error'
              this.text = '(From Date) must be greater than the Previous (To Date)'
              errorCount++
            }
          }
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Please make sure to add Availabilities and PricingTiers'
          errorCount++
        }
        if (errorCount === 0) {
          if ((this.activity.activityType === 'camping' && this.activity.sideActivity.length > 0) || this.activity.activityType !== 'camping') {
            if (this.activity.activityIncludes.length > 0 && this.activity.activityExcludes.length > 0) {
              this.loading = true
              const formData = new FormData()
              formData.append('activity_title', this.activity.activityTitle)
              formData.append('activity_sort', this.activity.activitySort)
              formData.append('activity_intro', this.activity.activityIntro)
              formData.append('activity_itinerary', this.activity.activityItinerary)
              formData.append('activity_overview', this.activity.activityOverview)
              formData.append('activity_start_time', this.activity.activityStartTime)
              formData.append('activity_end_time', this.activity.activityEndTime)
              formData.append('activity_city_id', this.activity.activityCity.CityID)
              formData.append('activity_duration_digits', this.activity.activityDuration_digits)
              formData.append('activity_duration_type', this.activity.activityDuration_type)
              formData.append('activity_type', this.activity.activityType)
              formData.append('is_published', this.activity.published ? 1 : 0)

              for (let i = 0; i < this.activity.activityIncludes.length; i++) {
                formData.append('activity_includes[]', this.activity.activityIncludes[i])
              }

              for (let i = 0; i < this.activity.activityExcludes.length; i++) {
                formData.append('activity_excludes[]', this.activity.activityExcludes[i])
              }

              if (this.activity.sideActivity.length > 0) {
                for (let i = 0; i < this.activity.sideActivity.length; i++) {
                  formData.append('side_activity[' + i + '][time]', this.type === 'edit' ? this.activity.sideActivity[i].activityTime : this.activity.sideActivity[i].sideActivityTime)
                  formData.append('side_activity[' + i + '][day_number]', this.type === 'edit' ? this.activity.sideActivity[i].activityDayNumber : this.activity.sideActivity[i].sideActivityDayNumber)
                  formData.append('side_activity[' + i + '][name]', this.type === 'edit' ? this.activity.sideActivity[i].activityName : this.activity.sideActivity[i].sideActivityName)
                }
              }
              for (let i = 0; i < this.activity.start_days.length; i++) {
                formData.append('start_days[' + i + ']', this.activity.start_days[i])
              }

              for (let i = 0; i < this.image.length; i++) {
                formData.append('activity_image[]', this.image[i], this.image[i].name)
              }

              this.activity.availabilities.forEach((availability, index) => {
                formData.append(`availabilities[${index}][from_date]`, availability.from_date)
                formData.append(`availabilities[${index}][to_date]`, availability.to_date)

                availability.pricingtiers.forEach((pricingTier, tierIndex) => {
                  formData.append(`availabilities[${index}][pricingtiers][${tierIndex}][name]`, pricingTier.name)
                  formData.append(`availabilities[${index}][pricingtiers][${tierIndex}][min]`, pricingTier.min)
                  formData.append(`availabilities[${index}][pricingtiers][${tierIndex}][max]`, pricingTier.max)
                  formData.append(`availabilities[${index}][pricingtiers][${tierIndex}][adult_price]`, pricingTier.adult_price)
                  formData.append(`availabilities[${index}][pricingtiers][${tierIndex}][max_child]`, pricingTier.max_child)
                  formData.append(`availabilities[${index}][pricingtiers][${tierIndex}][child_percentage]`, pricingTier.child_percentage)
                })
              })

              if (this.type === 'edit') formData.append('_method', 'PUT')
              let endpoint = null
              if (this.type === 'add') endpoint = addActivity
              else endpoint = updateActivity(this.data.activityID)

              this.$http.post(endpoint, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
                this.loading = false
                if (response.body.status === 200) {
                  this.snackbar = true
                  this.color = 'success'
                  this.text = this.type === 'add' ? 'Added' : 'Updated' + 'successfully'
                  this.$refs.form.resetValidation()
                  this.$emit('added')
                  this.activity = {
                    activityTitle: '',
                    activitySort: '',
                    activityIntro: '',
                    activityItinerary: '',
                    activityOverview: '',
                    activityStartTime: '',
                    activityEndTime: '',
                    activityIncludes: [],
                    activityExcludes: [],
                    activityCity: {
                      CityID: ''
                    },
                    activityImage: null,
                    activityDuration_digits: null,
                    activityDuration_type: 'hour',
                    activityType: 'sightseeing',
                    sideActivity: [],
                    published: true,
                    start_days: [],
                    seasons: [],
                    availabilities: [
                      {
                        from_date: '',
                        to_date: '',
                        pricingtiers: [
                          {
                            name: '',
                            min: '',
                            max: '',
                            adult_price: '',
                            max_child: '',
                            child_percentage: ''
                          }
                        ]
                      }
                    ]
                  }
                } else {
                  const errorData = response.body
                  if (errorData.errors && Array.isArray(errorData.errors)) {
                    const errors = errorData.errors
                    this.showSnackbar(errors.join('\n'), 'error')
                  } else if (errorData.errors && typeof errorData.errors === 'object') {
                    const errors = Object.values(errorData.errors).flat()
                    this.showSnackbar(errors.join('\n'), 'error')
                  } else {
                    this.showSnackbar(errorData.errors, 'error')
                  }
                }
              }, err => {
                this.loading = false
                const errorData = err.body
                if (errorData.errors && Array.isArray(errorData.errors)) {
                  const errors = errorData.errors
                  this.showSnackbar(errors.join('\n'), 'error')
                } else if (errorData.errors && typeof errorData.errors === 'object') {
                  const errors = Object.values(errorData.errors).flat()
                  this.showSnackbar(errors.join('\n'), 'error')
                } else {
                  this.showSnackbar('Invalid data', 'error')
                }
              })
            } else {
              this.snackbar = true
              this.color = 'error'
              this.text = 'Please make sure to add inclusions and exclusions'
            }
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = 'Please provide at least one side activity'
          }
        }
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all required fields'
      }
    },
    addNewAvailability () {
      // Validate the date before adding a new availability
      const numAvailabilities = this.activity.availabilities.length
      if (numAvailabilities > 0) {
        const lastAvailability = this.activity.availabilities[numAvailabilities - 1]
        // console.log(lastAvailability.to_date, lastAvailability.from_date)
        if (lastAvailability.to_date >= lastAvailability.from_date) {
          // Add new availability if the previous availability's date range is valid
          const newAvailability = {
            from_date: '',
            to_date: '',
            pricingtiers: [
              {
                name: '',
                min: '',
                max: '',
                adult_price: '',
                max_child: '',
                child_percentage: ''
              }
            ]
          }
          this.activity.availabilities.push(newAvailability)
        } else {
          // Display an error message or perform any desired action for invalid date range
          this.snackbar = true
          this.color = 'error'
          this.text = '(To Date) must be greater than (From Date)'
        }
      } else {
        // Add new availability for the first availability
        const newAvailability = {
          from_date: '',
          to_date: '',
          pricingtiers: [
            {
              name: '',
              min: '',
              max: '',
              adult_price: '',
              max_child: '',
              child_percentage: ''
            }
          ]
        }
        this.activity.availabilities.push(newAvailability)
      }
    },
    addNewPricingtier (index) {
      const availability = this.activity.availabilities[index]
      const pricingTiers = availability.pricingtiers

      if (pricingTiers.length > 0) {
        // const lastPricingTier = pricingTiers[pricingTiers.length - 1]
        // const newMin = lastPricingTier.max ? parseInt(lastPricingTier.max) + 1 : '' // Set the new min value to the previous max value
        const newPricingTier = {
          name: '',
          min: '',
          max: '',
          adult_price: '',
          max_child: '',
          child_percentage: ''
        }
        pricingTiers.push(newPricingTier)
      } else {
        // Add new pricing tier for the first tier
        pricingTiers.push({
          name: '',
          min: '',
          max: '',
          adult_price: '',
          max_child: '',
          child_percentage: ''
        })
      }
    },
    removeAvailability (availabilityIndex) {
      this.activity.availabilities.splice(availabilityIndex, 1)
    },
    removePricingTier (availabilityIndex, pricingTierIndex) {
      this.activity.availabilities[availabilityIndex].pricingtiers.splice(pricingTierIndex, 1)
    },
    showSnackbar (message, color) {
      this.text = message
      this.color = color
      this.snackbar = true
    }
  },
  created () {
    if (this.type === 'edit') {
      this.activity = this.data
      if (this.data.published === 1) this.activity.published = true
      else this.activity.published = false
    } else {
      this.activity = {
        activityTitle: '',
        activitySort: '',
        activityIntro: '',
        activityItinerary: '',
        activityOverview: '',
        activityStartTime: '',
        activityEndTime: '',
        activityPaxMinimum: '1',
        activityIncludes: [],
        activityExcludes: [],
        activityCity: {
          CityID: ''
        },
        activityImage: null,
        activityPricePerPerson: '',
        children_percentage: '',
        single_supplement_percentage: '',
        solo_price: '',
        Limo_price: '',
        HiAC_price: '',
        Caster_price: '',
        bus_price: '',
        limoChildrenPercentage: '',
        hiacChildrenPercentage: '',
        casterChildrenPercentage: '',
        busChildrenPercentage: '',
        activityDuration_digits: null,
        activityDuration_type: 'hour',
        activityType: 'sightseeing',
        sideActivity: [],
        published: true,
        start_days: [],
        seasons: [],
        availabilities: [
          {
            from_date: '',
            to_date: '',
            pricingtiers: [
              {
                name: '',
                min: '',
                max: '',
                adult_price: '',
                max_child: '',
                child_percentage: ''
              }
            ]
          }
        ]
      }
    }
  },
  beforeCreate () {
    this.$http.get(formLists, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === 200) {
        this.cities = response.body.data.cities
      }
    })
  }
}
</script>

<style>
  @import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
