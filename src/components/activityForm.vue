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
                    <v-checkbox v-model="activity.published" label="Published Adventure"></v-checkbox>
                    <wysiwyg v-model="activity.activityOverview" />
                    <v-select class="mt-5" v-model="activity.activityType" :items="['sightseeing', 'camping']" color="blue" outlined label="Activity type" :rules="[v => !!v || 'type is required']">
                    </v-select>
                    <v-select v-model="activity.activityCity.CityID" :items="cities" item-value="CityID" item-text="CityName" color="blue" outlined label="Activity City" :rules="[v => !!v || 'city is required']">
                    </v-select>
                    <v-text-field label="Price Per Person" outlined class="inputNumber mx-1" v-model="activity.activityPricePerPerson" type="number" :rules="[v => !!v || 'Price is required']" color="blue" prefix="$">
                    </v-text-field>

                    <!-- percentages -->
                    <v-text-field label="Children percentage" outlined class="inputNumber mx-1" v-model="activity.children_percentage" type="number" color="blue" prefix="%">
                    </v-text-field>
                    <v-text-field label="Single Supplement percentage" outlined class="inputNumber mx-1" v-model="activity.single_supplement_percentage" type="number" min="0" color="blue" prefix="%">
                    </v-text-field>

                    <!-- prices -->
                    <v-text-field label="Solo Price (1 person)" outlined class="inputNumber mx-1" v-model="activity.solo_price" type="number" color="blue" prefix="$">
                    </v-text-field>
                    <v-text-field label="Limo Price (1-2 persons)" outlined class="inputNumber mx-1" v-model="activity.Limo_price" type="number" color="blue" prefix="$">
                    </v-text-field>
                    <v-text-field label="Limo Price Children percentage" outlined class="inputNumber mx-1" v-model="activity.limoChildrenPercentage" type="number" color="blue" prefix="%">
                    </v-text-field>
                    <v-text-field label="HiAC Price Per Person (3-8 persons)" outlined class="inputNumber mx-1" v-model="activity.HiAC_price" type="number" color="blue" prefix="$">
                    </v-text-field>
                    <v-text-field label="HiAC Price Children percentage" outlined class="inputNumber mx-1" v-model="activity.hiacChildrenPercentage" type="number" color="blue" prefix="%">
                    </v-text-field>
                    <v-text-field label="Caster Price Per Person (9-18 persons)" outlined class="inputNumber mx-1" v-model="activity.Caster_price" type="number" color="blue" prefix="$">
                    </v-text-field>
                    <v-text-field label="Caster Price Children percentage" outlined class="inputNumber mx-1" v-model="activity.casterChildrenPercentage" type="number" color="blue" prefix="%">
                    </v-text-field>
                    <v-text-field label="Bus Price Per Person (18-50 persons)" outlined class="inputNumber mx-1" v-model="activity.bus_price" type="number" color="blue" prefix="$">
                    </v-text-field>
                    <v-text-field label="Bus Price Children percentage" outlined class="inputNumber mx-1" v-model="activity.busChildrenPercentage" type="number" color="blue" prefix="%">
                    </v-text-field>

                    <v-text-field label="Minimum number of travellers" outlined v-model="activity.activityPaxMinimum" type="number" :rules="[v => !!v || 'item is required', v => /^[1-9]*$/.test(v) || 'item must be numbers']" color="blue" class="mx-1">
                    </v-text-field>
                    <v-row>
                        <v-text-field label="Activity Duration Digits" outlined v-model="activity.activityDuration_digits" type="number" :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']" color="blue" class="mx-1">
                        </v-text-field>
                        <v-select v-model="activity.activityDuration_type" :items="[{text:'Hour(s)', value:'hour'}, {text:'Days(s)',value:'day'}, {text:'Week',value:'week'}]" color="blue" item-text="text" item-value="value" outlined label="Activity Duration Type" :rules="[v => !!v || 'type is required']"
                            @input="createDaysArray">
                        </v-select>
                    </v-row>

                    <!-- start days -->
                    <v-select v-model="activity.start_days" :items="['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']" :menu-props="{ maxHeight: '400' }" label="Choose Start Days" :rules="[v => !!v || 'item is required']" prepend-inner-icon="mdi-calendar"
                        chips deletable-chips multiple outlined class="mt-5"></v-select>

                    <!-- seasons -->
                    <v-menu ref="seasonDateMenu" v-model="seasonDateMenu" :close-on-content-click="false" :nudge-right="10" transition="scale-transition" min-width="auto" :return-value.sync="seasonDates">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="seasonDates"
                            label="Add season dates"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            color="blue"
                            v-bind="attrs"
                            v-on="on"
                            clearable
                            outlined
                            ></v-text-field>
</template>
                      <v-date-picker
                      v-model="seasonDates"
                      :min="new Date().toISOString().substr(0, 10)"
                      range
                      >
                        <v-spacer></v-spacer>
                          <v-btn
                          text
                          color="primary"
                          @click="seasonDateMenu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                          text
                          color="primary"
                          @click="$refs.seasonDateMenu.save(seasonDates); setSeason(seasonDates)"
                          >
                            OK
                          </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <!-- seasons display -->
                    <v-card outlined v-if="activity.seasons.length" class="pa-1 mb-5">
                      <v-card-text>
                        <dir v-for="(item, i) in activity.seasons" :key="i" class="d-flex align-center justify-space-between">
                          <p class="text-h6">Season: from{{item.from + ' to ' + item.to}}</p>
                          <v-btn icon color="error" @click="activity.seasons = activity.seasons.filter(data => data.from !== item.from && data.to !== item.to)"><v-icon>mdi-delete</v-icon></v-btn>
                        </dir>
                      </v-card-text>
                    </v-card>

                    <v-row justify="space-between">
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
                    </v-row>
                    <v-file-input
                    v-model="image"
                    accept="image/*"
                    label="Activity Image"
                    color="blue"
                    outlined
                    show-size
                    multiple
                    >
                    </v-file-input>

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
                    >
                    </v-text-field>

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

export default {
  props: ['type', 'data'],
  data () {
    return {
      valid: true,
      snackbar: false,
      menu: false,
      menu1: false,
      menu2: false,
      color: '',
      text: '',
      activity: {
        activityTitle: '',
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
        published: true
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
          seasons: []
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
                this.activity.activityExcludes === 0 ||
                (this.activity.activityType === 'camping' && this.activity.sideActivity.length === 0)
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
        if ((this.activity.activityType === 'camping' && this.activity.sideActivity.length > 0) || this.activity.activityType !== 'camping') {
          if (this.activity.activityIncludes.length > 0 && this.activity.activityExcludes.length > 0) {
            this.loading = true
            const formData = new FormData()
            formData.append('activity_title', this.activity.activityTitle)
            formData.append('activity_overview', this.activity.activityOverview)
            formData.append('activity_pax_min_number', this.activity.activityPaxMinimum)
            formData.append('activity_start_time', this.activity.activityStartTime)
            formData.append('activity_end_time', this.activity.activityEndTime)
            formData.append('activity_city_id', this.activity.activityCity.CityID)
            formData.append('activity_price_per_person', this.activity.activityPricePerPerson)
            formData.append('children_percentage', this.activity.children_percentage)
            formData.append('single_supplement_percentage', this.activity.single_supplement_percentage)
            formData.append('solo_price', this.activity.solo_price)
            formData.append('Limo_price', this.activity.Limo_price)
            formData.append('HiAC_price', this.activity.HiAC_price)
            formData.append('Caster_price', this.activity.Caster_price)
            formData.append('bus_price', this.activity.bus_price)
            formData.append('limo_children_percentage', this.activity.limoChildrenPercentage)
            formData.append('hiac_children_percentage', this.activity.hiacChildrenPercentage)
            formData.append('caster_children_percentage', this.activity.casterChildrenPercentage)
            formData.append('bus_children_percentage', this.activity.busChildrenPercentage)
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
                formData.append('sideActivity[' + i + '][time]', this.type === 'edit' ? this.activity.sideActivity[i].activityTime : this.activity.sideActivity[i].sideActivityTime)
                formData.append('sideActivity[' + i + '][day_number]', this.type === 'edit' ? this.activity.sideActivity[i].activityDayNumber : this.activity.sideActivity[i].sideActivityDayNumber)
                formData.append('sideActivity[' + i + '][name]', this.type === 'edit' ? this.activity.sideActivity[i].activityName : this.activity.sideActivity[i].sideActivityName)
              }
            }
            for (let i = 0; i < this.activity.start_days.length; i++) {
              formData.append('start_days[' + i + ']', this.activity.start_days[i])
            }
            for (let i = 0; i < this.activity.seasons.length; i++) {
              formData.append('seasons[' + i + '][from]', this.activity.seasons[i].from)
              formData.append('seasons[' + i + '][to]', this.activity.seasons[i].to)
            }
            // if (this.image) formData.append('activity_image', this.image, this.image.name)
            for (let i = 0; i < this.image.length; i++) {
              formData.append('activity_image[]', this.image[i], this.image[i].name)
            }
            if (this.type === 'edit') formData.append('_method', 'PUT')
            let endpoint = null
            if (this.type === 'add') endpoint = addActivity
            else endpoint = updateActivity(this.data.activityID)

            // if (this.image) formData.append('activity_image', this.image, this.image.name)
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
                  activityOverview: '',
                  activityStartTime: '',
                  activityEndTime: '',
                  activityPaxMinNumber: '1',
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
                  seasons: []
                }
              } else {
                this.snackbar = true
                this.color = 'error'
                this.text = response.body.message
              }
            }, err => {
              this.loading = false
              this.snackbar = true
              this.color = 'error'
              this.text = err.body.message
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
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all required fields'
      }
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
        seasons: []
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
