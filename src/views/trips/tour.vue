<template>
    <div>
      <v-progress-linear
      indeterminate
      color="blue"
      :active="loading"
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
      <v-container v-if="!loading && tour">
        <v-card class="my-5">
          <v-card-title class="primary white--text">
            <v-row justify="space-between">
              <span><v-icon class="mb-1 ml-2" color="white" left>mdi-information-outline</v-icon> Basic Information</span>
              <v-btn @click="basicDialog = true" icon color="white" large><v-icon>mdi-pencil</v-icon></v-btn>
            </v-row>
          </v-card-title>
          <v-img max-height="200" :src="tour.packageImage" :alt="tour.packageTitle"></v-img>
          <v-row no-gutters v-if="tour.packageImages.length">
            <v-img class="ma-5" max-height="100" max-width="100" v-for="(item, i) in tour.packageImages" :key="i" :src="item" :alt="tour.packageTitle"></v-img>
          </v-row>
          <v-card-text class="pa-5">
            <p class="headline font-weight-bold">{{tour.packageTitle}}</p>
            <p class="text-h6 gray--text">{{tour.packageDuration}} days <span v-if="tour.packageStartDate">from</span> {{tour.packageStartDate}}</p>
            <p class="body-1 gray--text" v-html="tour.packageOverview"></p>
            <div class="body-1 gray--text text-capitalize" v-if="tour.start_days.length">Allowed Days:
              <template v-for="item in tour.start_days">
                <v-chip class="mx-1" v-if="item" :key="item">{{item}}</v-chip>
              </template>
            </div>
            <v-card outlined v-if="tour.seasons.length" class="pa-1 mt-3">
              <v-card-text>
                <dir v-for="(item, i) in tour.seasons" :key="i">
                  <p class="text-h6 mb-0">Season {{i + 1}}: from{{item.from + ' to ' + item.to}}</p>
                </dir>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
        <v-divider class="my-2"></v-divider>
        <v-row justify="space-between" class="mx-2 mt-5">
          <p class="headline primary--text font-weight-bold mb-0">Package Cities</p>
          <v-btn tile class="primary white--text" @click="cityDialog()"><v-icon left>mdi-plus</v-icon> Add city</v-btn>
        </v-row>
        <v-card class="my-5" v-for="(item, i) in tour.packageCities" :key="item.packageCityID">
          <v-card-title class="primary white--text">
            <v-row justify="space-between" class="mx-1">
              <span v-if="item.cityName"><v-icon class="mb-1" color="white">mdi-map-marker</v-icon> {{item.cityName}}</span>
              <v-menu
              bottom
              left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                  dark
                  icon
                  v-bind="attrs"
                  v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-btn text @click="actionType = 'edit'; addCityDialog = true; city = item; getActivitiesByCity(); getHotelsByCity()" color="blue"><v-icon left>mdi-pencil</v-icon> Edit</v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn text @click="editingTour.packageCities.splice(i, 1); updatePackage();" color="error"><v-icon left>mdi-trash-can</v-icon> Remove</v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-row>
          </v-card-title>
          <v-card-text class="pa-5">
            <p v-if="item.cityHotels.length > 0" class="headline primary--text"><v-icon color="primary">mdi-bed</v-icon> {{item.cityHotels[0].hotelName}}</p>
            <v-divider class="my-2"></v-divider>
            <p v-if="item.cityActivities.length > 0" class="headline primary--text">Activities</p>
            <v-simple-table v-if="item.cityActivities.length > 0">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                    Image
                    </th>
                    <th class="text-left">
                    Title
                    </th>
                    <th class="text-left">
                    City
                    </th>
                    <th class="text-left">
                    Type
                    </th>
                    <th class="text-left">
                    Price/Person
                    </th>
                    <th class="text-left">
                    Duration
                    </th>
                    <th class="text-left">
                    Day Activity
                    </th>
                    <th class="text-left">
                    Inclusions
                    </th>
                    <th class="text-left">
                    Exclusions
                    </th>
                    <th class="text-left">
                    Side Activities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in item.cityActivities" :key="activity.tripCityActivityID">
                    <td><v-img :src="activity.activity.activityImage" max-width="50" :alt="activity.activity.activityTitle"></v-img></td>
                    <td>{{ activity.activity.activityTitle }}</td>
                    <td v-if="activity.activity.activityCity">{{ activity.activity.activityCity.CityName }}</td>
                    <td>{{ activity.activity.activityType }}</td>
                    <td>$ {{ activity.activity.activityPricePerPerson }}</td>
                    <td>{{ activity.activity.activityDuration_digits }}{{ activity.activity.activityDuration_type }}</td>
                    <td>{{ activity.activityDayNumber }}</td>
                    <td>
                      <span v-for="(inc, j) in activity.activity.activityIncludes" :key="inc + j">{{inc }}</span>
                    </td>
                    <td>
                      <span v-for="(exc, j) in activity.activity.activityExcludes" :key="exc + j">{{ exc }}</span>
                    </td>
                    <td>
                      <span v-for="side in activity.activity.sideActivity" :key="side.activityID">{{ side.activityName }}</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider class="my-2"></v-divider>
            <p class="headline primary--text">Transportations</p>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                    Type
                    </th>
                    <th class="text-left">
                    Date
                    </th>
                    <th class="text-left">
                    Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trans in item.cityTransportations" :key="trans.transportationID">
                    <td>{{trans.transportationType}}</td>
                    <td><dateDisplay :date="trans.transportationDate" /></td>
                    <td>$ {{ trans.transportationPricePerPerson }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>

        <v-card class="my-5">
          <v-card-title class="d-flex justify-space-between flex-wrap">
            Package Nile Cruise
            <v-btn tile color="primary" v-if="!tour.cruise" @click="changeCruiseDialog = true"><v-icon>mdi-plus</v-icon> Add Cruise</v-btn>
          </v-card-title>
          <v-card-text v-if="tour.cruise">
            <v-row align="center">
              <v-col cols="12" md="3">
                <v-img :src="tour.cruise.master_image"></v-img>
              </v-col>
              <v-col cols="12" md="6">
                <h3>{{tour.cruise.name}}</h3>
                <p><v-icon left color="primary">mdi-map-marker</v-icon> {{tour.cruise.cruise_line}}</p>
                <p><v-icon left color="primary">mdi-ferry</v-icon> {{tour.cruise.ship_name}}</p>
                <v-btn text elevation="0" color="primary" :to="'/cruise/' + tour.cruise.id">See Details</v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn tile color="primary" class="my-1" @click="changeCruiseDialog = true">Change Cruise</v-btn>
                <v-btn tile color="error" @click="tour.cruise = null; cruiseID = null; updatePackage();">Remove Cruise</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
      <v-container v-if="!loading && !tour">
        <p class="mt-5 text-center">Couldn't fetch package</p>
      </v-container>
      <v-dialog :retain-focus="false" max-width="700" v-model="basicDialog">
        <v-card v-if="editingTour" class="pa-5">
          <v-card-title>Update Basic Information</v-card-title>
          <v-card-text>
            <v-form ref="basicForm" v-model="basicFormValid">
                <v-text-field
                label="Title"
                v-model="editingTour.packageTitle"
                type="text"
                outlined
                class="mt-3"
                :rules="[v => !!v || 'Field is required']"
                color="blue"
                >
                </v-text-field>
                <v-row justify="space-between" align="center" no-gutters>
                  <v-checkbox
                  v-model="editingTour.isTop"
                  label="Is top tour"
                  ></v-checkbox>
                  <v-col cols="12" sm="4" v-if="editingTour.isTop">
                    <v-text-field
                    label="Rank"
                    v-model="editingTour.rank"
                    type="number"
                    min="1"
                    outlined
                    :rules="[v => !!v || 'Rank is required' ,v => /^[0-9]*$/.test(v) || 'Rank must be an integer number', v => v > 0 || 'Rank must be greater than zero']"
                    color="blue"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <wysiwyg v-model="editingTour.packageOverview" />

                <!-- start days -->
                <v-select
                v-model="tour.start_days"
                :items="['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']"
                :menu-props="{ maxHeight: '400' }"
                label="Choose Start Days"
                :rules="[v => !!v || 'item is required']"
                prepend-inner-icon="mdi-calendar"
                chips
                deletable-chips
                multiple
                outlined
                class="mt-5"
                ></v-select>

                <!-- seasons -->
                <v-menu
                ref="seasonDateMenu"
                v-model="seasonDateMenu"
                :close-on-content-click="false"
                :nudge-right="10"
                transition="scale-transition"
                min-width="auto"
                :return-value.sync="seasonDates"
                >
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
                <v-card outlined v-if="tour.seasons.length" class="pa-1 mb-5">
                  <v-card-text>
                    <dir v-for="(item, i) in tour.seasons" :key="i" class="d-flex align-center justify-space-between">
                      <p class="text-h6">Season: from{{item.from + ' to ' + item.to}}</p>
                      <v-btn icon color="error" @click="tour.seasons = tour.seasons.filter(data => data.from !== item.from && data.to !== item.to)"><v-icon>mdi-delete</v-icon></v-btn>
                    </dir>
                  </v-card-text>
                </v-card>

                <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                :nudge-right="10"
                transition="scale-transition"
                min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editingTour.packageStartDate"
                      label="Package Start Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      color="blue"
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      class="my-4"
                      clearable
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editingTour.packageStartDate"
                    @input="startDateMenu = false"
                    :min="new Date().toISOString().substr(0, 10)"
                    show-current
                  ></v-date-picker>
                </v-menu>
                <v-row class="mx-1">
                  <v-text-field
                  label="Nights Number"
                  outlined
                  v-model="editingTour.packageNightsNumber"
                  type="number"
                  :rules="[v => !!v || 'Field is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                  color="blue"
                  class="mx-1"
                  >
                  </v-text-field>
                  <v-text-field
                  label="Duration"
                  v-model="editingTour.packageDuration"
                  type="text"
                  outlined
                  :rules="[v => !!v || 'Field is required']"
                  color="blue"
                  >
                  </v-text-field>
                </v-row>
                <v-file-input
                v-model="image"
                accept="image/*"
                label="Package Image"
                class="my-4"
                color="blue"
                outlined
                :rules="[value => !value || value.size < 2000000 || 'Image size should be less than 5 MB!']"
                show-size
                >
                </v-file-input>

                <v-file-input
                v-model="images"
                accept="image/*"
                label="Package Images"
                color="blue"
                outlined
                show-size
                multiple
                >
                </v-file-input>
              <v-row>
                <v-text-field
                    label="Occupancy"
                    outlined
                    v-model="editingTour.package_occupancy"
                    type="number"
                    :rules="[v => !!v || 'Field is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                    color="blue"
                    class="mx-1"
                >
                </v-text-field>
              </v-row>
              <v-text-field
                label="Slug"
                v-model="editingTour.packageSlug"
                type="text"
                outlined
                color="orange"
                :error-messages="slugErrors"
                @input="checkSlug"
                >
                </v-text-field>

                <div v-if="slugAlt">
                  <v-btn color="blue" small text @click="tour.packageSlug = slugAlt; slugAlt = ''; slugErrors = ''">{{slugAlt}}</v-btn>
                </div>

                <v-text-field
                label="Image Caption"
                v-model="editingTour.packageImageCaption"
                type="text"
                outlined
                color="orange"
                >
                </v-text-field>

                <v-text-field
                label="Image Alt"
                v-model="editingTour.packageImageAlt"
                type="text"
                outlined
                color="orange"
                >
                </v-text-field>

                <v-text-field
                label="Meta Title"
                v-model="editingTour.packageMetaTitle"
                type="text"
                outlined
                color="orange"
                >
                </v-text-field>

                <v-text-field
                label="Meta Description"
                v-model="editingTour.packageMetaDesc"
                type="text"
                outlined
                color="orange"
                >
                </v-text-field>
              <!-- <v-row> -->
                <!-- <v-col cols="12">
                  <p class="font-weight-bold">Starting airport</p>
                  <v-checkbox
                      :label="`International flight`"
                      v-model="checkbox">
                  </v-checkbox>
                  <v-autocomplete
                      v-model="newstartingairport"
                      :items="Airports"
                      color="blue"
                      outlined
                      no-filter
                      label="Starting Airport"
                      :search-input.sync="search"
                      :disabled="!checkbox">>
                    <template slot="selection" slot-scope="data">
                      {{ data.item.Code }} - {{ data.item.Name }}
                    </template>
                    <template slot="item" slot-scope="data">
                      {{ data.item.Code }} - {{ data.item.Name }}
                    </template>
                  </v-autocomplete>
                  <label v-if="tour.starting_airport">Current: <strong>{{tour.starting_airport}}</strong></label>
                </v-col> -->
              <!-- </v-row> -->
              <v-row>
                <v-col cols="12">
                  <p>Additional cost</p>
                    <v-text-field
                        label="Additional cost"
                        v-model="editingTour.additional_cost"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Field is required']"
                        color="blue"
                    >
                    </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <p>Expected price</p>
                  <v-text-field
                      label="Expected price"
                      v-model="editingTour.expected_price"
                      type="text"
                      outlined
                      :rules="[v => !!v || 'Field is required']"
                      color="blue"
                  >
                  </v-text-field>
                  <v-text-field
                      label="Solo Price (1 person)"
                      outlined
                      class="inputNumber mx-1"
                      v-model="editingTour.solopackagePricePerPerson"
                      type="number"
                      :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                  >
                  </v-text-field>
                  <v-text-field
                      label="Limo Price (1-2 persons)"
                      outlined
                      class="inputNumber mx-1"
                      v-model="editingTour.limopackagePricePerPerson"
                      type="number"
                      :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                  >
                  </v-text-field>
                  <v-text-field
                    label="Limo Children percentage"
                    outlined
                    class="inputNumber mx-1"
                    v-model="editingTour.limoChildrenPercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>
                  <v-text-field
                      label="HiAC Price Per Person (3-8 persons)"
                      outlined
                      class="inputNumber mx-1"
                      v-model="editingTour.hiacpackagePricePerPerson"
                      type="number"
                      :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                  >
                  </v-text-field>
                  <v-text-field
                    label="Hiac Children percentage"
                    outlined
                    class="inputNumber mx-1"
                    v-model="editingTour.hiacChildrenPercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>
                  <v-text-field
                      label="Caster Price Per Person (9-18 persons)"
                      outlined
                      class="inputNumber mx-1"
                      v-model="editingTour.casterpackagePricePerPerson"
                      type="number"
                      :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                  >
                  </v-text-field>
                  <v-text-field
                    label="Caster Children percentage"
                    outlined
                    class="inputNumber mx-1"
                    v-model="editingTour.casterChildrenPercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>
                  <v-text-field
                      label="Bus Price Per Person (18-50 persons)"
                      outlined
                      class="inputNumber mx-1"
                      v-model="editingTour.buspackagePricePerPerson"
                      type="number"
                      :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                  >
                  </v-text-field>
                  <v-text-field
                    label="Bus Children percentage"
                    outlined
                    class="inputNumber mx-1"
                    v-model="editingTour.busChildrenPercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>
                  <v-text-field
                  label="Children percentage"
                  outlined
                  class="inputNumber mx-1"
                  v-model="editingTour.childrenpercentage"
                  type="number"
                  :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                  color="blue"
                  prefix="%"
                  >
                  </v-text-field>
                  <v-text-field
                  label="Single Supplement percentage"
                  outlined
                  class="inputNumber mx-1"
                  v-model="editingTour.single_supplement_percentage"
                  type="number"
                  min="0"
                  color="blue"
                  prefix="%"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="warning" @click="basicDialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn tile color="success" @click="updatePackage" :loading="updatePackageLoading">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog max-width="900" v-model="addCityDialog">
        <v-card v-if="editingTour" class="pa-5">
        <v-card-title>{{actionType === 'add' ? 'Add' : 'Update'}} Package City</v-card-title>
        <v-card-text>
          <v-form ref="cityForm"  v-model="cityFormValid">
            <v-row>
              <v-col cols="12" sm="4">
                <v-select
                v-model="city.cityID"
                :items="cities"
                item-value="CityID"
                item-text="CityName"
                color="blue"
                :disabled="actionType !== 'add'"
                outlined
                label="Package City"
                @input="getHotelsByCity(); getActivitiesByCity()"
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                label="Days Number"
                outlined
                v-model="city.cityDaysNumber"
                type="number"
                color="blue"
                class="mx-1"
                @input="createDaysArray"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                label="Duration"
                outlined
                v-model="city.cityDuration"
                color="blue"
                class="mx-1"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="8" md="5">
                <v-select
                v-model="selectedActivity.id"
                :items="activities"
                item-value="activityID"
                item-text="activityTitle"
                color="blue"
                outlined
                label="Package Activity"
                :disabled="!city.cityID"
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                v-model="selectedActivity.dayNumber"
                :items="cityDays"
                color="blue"
                outlined
                label="Package Activity Day"
                :disabled="!city.cityDaysNumber"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn height="56" block tile :disabled="!selectedActivity.id || !selectedActivity.dayNumber" color="success" @click="addActivity">Add</v-btn>
              </v-col>
            </v-row>
            <v-simple-table v-if="city.cityActivities.length > 0">
              <thead>
                <tr>
                  <th class="text-left">
                  Title
                  </th>
                  <th class="text-left">
                  Activity Day
                  </th>
                  <th class="text-left">
                  Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(activity, index) in city.cityActivities" :key="index + '_ActivityDay'">
                  <td>
                    <span v-for="item in activities" :key="item.activityID">
                      <span v-if="activity.activity.activityID === item.activityID">{{ item.activityTitle }}</span>
                    </span>
                  </td>
                  <td>
                    <span>
                      <span>{{ activity.activityDayNumber }}</span>
                    </span>
                  </td>
                  <td class="text-right">
                    <v-btn icon color="error" large @click="city.cityActivities.splice(index, 1)">
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-row>
              <v-col v-if="city.cityHotels[0]" cols="12" md="6">
                <v-select
                v-model="hotelID"
                :items="hotels"
                item-value="hotelID"
                item-text="hotelName"
                color="blue"
                outlined
                label="Package Hotel"
                :disabled="!city.cityID"
                @input="city.cityHotels[0].hotelID = hotelID"
                >
                </v-select>
              </v-col>
              <!-- <v-col v-if="city.cityHotels[0]" cols="12" md="6">
                <v-btn tile block height="56" color="primary" @click="openRoomDialog()" :disabled="!hotelID">Choose Room</v-btn>
                <span class="caption" v-if="city.cityHotels[0].room && city.cityHotels[0].room.roomSeason && hotelID">{{ city.cityHotels[0].room.roomType }} ${{ city.cityHotels[0].room.roomSeason.roomSeasonPricePerDay || 0 }}</span>
              </v-col> -->
            </v-row>
            <p class="mt-10">Package City Transportations</p>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                v-model="transportation.transportationType"
                :items="transportationTypes"
                color="blue"
                outlined
                label="Type"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="10"
                transition="scale-transition"
                min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="transportation.transportationDate"
                      label="Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      color="blue"
                      v-bind="attrs"
                      v-on="on"
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="transportation.transportationDate"
                    @input="menu = false"
                    :min="new Date().toISOString().substr(0, 10)"
                    show-current
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                label="Price/Person"
                outlined
                class="inputNumber mx-1"
                v-model="transportation.transportationPricePerPerson"
                type="number"
                color="blue"
                prefix="$"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn height="56" @click="addTransportation" tile block color="success" :disabled="!transportation.transportationType || !transportation.transportationPricePerPerson"><v-icon left>mdi-plus</v-icon><span>Add</span></v-btn>
              </v-col>
            </v-row>
            <v-simple-table dense v-if="city.cityTransportations.length > 0">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Type
                    </th>
                    <th class="text-left">
                      Date
                    </th>
                    <th class="text-left">
                      Price
                    </th>
                    <th class="text-right">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                  v-for="(item, i) in city.cityTransportations"
                  :key="i"
                  >
                    <td>{{ item.transportationType }}</td>
                    <td>{{ item.transportationDate }}</td>
                    <td>${{ item.transportationPricePerPerson }}</td>
                    <td class="text-right">
                      <v-btn icon color="error" large @click="city.cityTransportations.splice(i, 1)">
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
          <v-btn text color="warning" @click="cancelAddDialog(actionType)">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn tile color="success" @click="takeCityAction" :loading="updatePackageLoading" :disabled="(city.cityActivities.length < 1 && !city.cityHotels[0] )">{{actionType === 'add' ? 'Add' : 'Update'}}</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      <v-dialog max-width="700" v-model="roomsDialog">
        <v-card class="mb-3">
          <v-card-title class="primary white--text d-flex flex-wrap justify-space-between">
            <div>Choose Room</div>
            <v-btn icon @click="roomsDialog = false"><v-icon large>mdi-close</v-icon></v-btn>
          </v-card-title>
          <v-card @click="chooseRoom(item)" class="ma-3" v-for="item in rooms" :key="item.roomID">
            <div v-if="item.roomSeason !== null && item.roomAmenities !== null && item.roomType !== null && item.roomMaxNumberOfAdult !== null && item.roomMaxNumberOfChildren !== null ">
            <v-card-title class="px-5">
              <v-row justify="space-between">
                <span>{{item.roomType}}</span>
                <span>${{item.roomSeason.roomSeasonPricePerDay}}</span>
              </v-row>
            </v-card-title>
            <v-card-text>
              <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="item.roomSeason.roomSeasonStartDate" :date="item.roomSeason.roomSeasonStartDate" />
              <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="item.roomSeason.roomSeasonEndDate" :date="item.roomSeason.roomSeasonEndDate" />
              <v-divider class="my-3"></v-divider>
              <span>{{item.roomMaxNumberOfAdult}} maximum adults and {{item.roomMaxNumberOfChildren}} maximum children</span>
              <v-divider class="my-3"></v-divider>
              <v-chip-group
              column
              >
                <v-chip v-for="inc in item.roomInclusions" :key="inc"><span v-if="item !== ''">{{inc}}</span></v-chip>
              </v-chip-group>
              <v-divider class="my-3"></v-divider>
              <v-chip-group
              column
              >
                <v-chip v-for="amin in item.roomAmenities" :key="amin"><span v-if="item !== ''">{{amin}}</span></v-chip>
              </v-chip-group>
            </v-card-text>
            </div>
          </v-card>
        </v-card>
      </v-dialog>
      <v-dialog @click:outside="cruiseID = null" v-model="changeCruiseDialog">
        <!-- v-click-outside="cruiseID = null" -->
        <v-card class="pa-5">
          <v-card-title class="font-weight-bold mt-2">{{tour.cruise ? 'Change' : 'Add'}} Package Cruise</v-card-title>
          <v-card-text>
            <v-select
            v-model="cruiseCityID"
            :items="cities"
            item-value="CityID"
            item-text="CityName"
            color="blue"
            outlined
            label="Cruise Start City"
            @input="getCruisesByCity()"
            >
            </v-select>

            <v-select
            v-model="cruiseID"
            :items="cruises"
            item-value="id"
            item-text="name"
            color="blue"
            outlined
            label="Choose Crusie"
            :disabled="!cruiseCityID"
            clearable
            >
            </v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="warning" @click="cruiseID = null; changeCruiseDialog = false">cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :loading="updatePackageLoading" :disabled="!cruiseID" @click="updatePackage">{{tour.cruise ? 'Change' : 'Add'}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
import dateDisplay from '../../components/dateDisplay'
import {
  slug,
  packageLists,
  updatePackage,
  showPackage,
  hotelsByCityId,
  roomsByHotelId,
  activitiesByCityId,
  headers,
  getAirports,
  cruisesByCity
} from '../../links'

export default {
  components: {
    dateDisplay
  },
  data () {
    return {
      checkbox: false,
      newstartingairport: null,
      search: null,
      actionType: null,
      Airports: [],
      cities: [],
      cruises: [],
      cruiseCityID: null,
      cruiseID: null,
      transportationTypes: [],
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      tour: null,
      editingTour: null,
      basicDialog: false,
      startDateMenu: false,
      image: null,
      images: [],
      basicFormValid: true,
      updatePackageLoading: false,
      addCityDialog: false,
      cityFormValid: true,
      city: {
        cityID: '',
        cityDaysNumber: '',
        cityDuration: '',
        cityHotels: [
          {
            hotelID: ''
          }
        ],
        cityActivities: [],
        cityTransportations: []
      },
      selectedActivity: {
        id: '',
        dayNumber: ''
      },
      hotels: [],
      rooms: [],
      activities: [],
      hotelID: '',
      roomsDialog: false,
      transportation: {
        transportationType: '',
        transportationDate: '',
        transportationPricePerPerson: ''
      },
      menu: false,
      cityDays: [],
      chosenRoom: {},
      seasonDateMenu: false,
      seasonDates: [],
      slugAlt: '',
      slugErrors: '',
      changeCruiseDialog: false
    }
  },
  watch: {
    search (val) {
      if (!val) {
        return
      }
      this.getcityAirports(val)
    }
  },
  methods: {
    checkSlug (value) {
      this.$http.get(slug(value), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        console.log(response.data.availability)
        if (!response.data.availability) {
          this.slugErrors = 'This slug is taken! Use Instead: '
          this.slugAlt = response.data.alternative
        }
      }).catch(error => {
        console.log(error)
      }).finally()
    },
    setSeason (dates) {
      if (dates[0] && dates[1]) {
        const firstDate = new Date(dates[0])
        const lastDate = new Date(dates[1])
        if (lastDate.getTime() > firstDate.getTime()) {
          this.tour.seasons.push({
            from: dates[0],
            to: dates[1]
          })
        } else {
          this.tour.seasons.push({
            from: dates[1],
            to: dates[0]
          })
        }
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please select a dates range to proceed!'
      }
    },
    cityDialog () {
      this.addCityDialog = true
      this.actionType = 'add'
      this.hotelID = ''
      this.city = {
        cityID: '',
        cityDaysNumber: '',
        cityDuration: '',
        cityHotels: [
          {
            hotelID: null
          }
        ],
        cityActivities: [],
        cityTransportations: []
      }
    },
    createDaysArray () {
      if (Number(this.city.cityDaysNumber) > 0) {
        this.cityDays = []
        for (let i = 0; i < Number(this.city.cityDaysNumber); i++) {
          this.cityDays[i] = i + 1
        }
      }
    },
    cancelAddDialog (action) {
      if (action === 'add') {
        this.city.cityTransportations = []
        this.city.cityActivities = []
        this.city.cityID = null
        this.city.cityDaysNumber = null
        this.city.cityDuration = null
        this.hotelID = null
        this.city.cityHotels[0].room = {}
        this.addCityDialog = false
      } else {
        this.addCityDialog = false
      }
    },
    addActivity () {
      this.city.cityActivities.push({
        activity: {
          activityID: this.selectedActivity.id
        },
        activityDayNumber: this.selectedActivity.dayNumber
      })
      this.selectedActivity = {
        id: '',
        dayNumber: ''
      }
    },
    getcityAirports (city) {
      this.$http.get(getAirports(city), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.status === 200) {
          this.Airports = response.body
          console.log(this.Airports)
          // this.activities = response.body.data
        }
        // console.log(response)
      })
    },
    openRoomDialog () {
      if (this.rooms.length > 0) {
        this.roomsDialog = true
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'This Hotel has not any rooms'
      }
    },
    chooseRoom () {
      this.city.cityHotels[0].hotelID = this.hotelID
      this.roomsDialog = false
    },
    getHotelsByCity () {
      this.$http.get(hotelsByCityId(this.city.cityID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.hotels = response.body.data
          this.hotelID = this.city.cityHotels[0].hotelID || null
        }
      })
    },
    getRoomsByHotel () {
      this.$http.get(roomsByHotelId(this.hotelID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.rooms = response.body.data
        }
      })
    },
    getActivitiesByCity () {
      this.$http.get(activitiesByCityId(this.city.cityID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.activities = response.body.data
        }
      })
    },
    addTransportation () {
      this.city.cityTransportations.push(this.transportation)
      this.transportation = {
        transportationType: '',
        transportationDate: '',
        transportationPricePerPerson: ''
      }
    },
    takeCityAction () {
      if (this.actionType === 'add') this.editingTour.packageCities.push(this.city)
      else {
        console.log(this.city)
        this.editingTour.packageCities.forEach(city => {
          if (this.city.cityID === city.cityID) city = this.city
        })
      }
      this.updatePackage()
    },
    getTour () {
      this.$http.get(showPackage(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.body.status === 200) {
          this.tour = response.body.data
          this.editingTour = { ...this.tour }
          if (this.editingTour.starting_airport !== 'null') this.checkbox = true
          if (this.$refs.cityForm) this.$refs.cityForm.resetValidation()
          this.city = {
            cityID: '',
            cityDaysNumber: '',
            cityDuration: '',
            cityHotels: [
              {
                hotelID: ''
              }
            ],
            cityActivities: [],
            cityTransportations: []
          }
        }
      }, () => {
        this.loading = false
      })
    },
    getCruisesByCity () {
      this.cruiseID = null
      this.$http.get(cruisesByCity(this.cruiseCityID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.status === 200) {
          this.cruises = response.body.data
        }
      })
    },
    updatePackage () {
      this.updatePackageLoading = true
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('package_title', this.editingTour.packageTitle)
      // formData.append('package_occupancy', this.editingTour.packageOccupancy || null)
      // formData.append('package_starting_airport', this.editingTour.packagestartingairport || null)
      // formData.append('additional_cost', this.editingTour.additionalCost || null)
      // formData.append('expected_price', this.editingTour.expectedPrice || null)
      formData.append('package_overview', this.editingTour.packageOverview)
      formData.append('package_duration', this.editingTour.packageDuration)
      formData.append('package_price_per_person', this.editingTour.expected_price)
      formData.append('package_occupancy', this.editingTour.package_occupancy)
      formData.append('package_nights_number', this.editingTour.packageNightsNumber)
      formData.append('additional_cost', this.editingTour.additional_cost)
      formData.append('expected_price', this.editingTour.expected_price)
      formData.append('solo_packageprice', this.editingTour.solopackagePricePerPerson)
      formData.append('Limo_packageprice', this.editingTour.limopackagePricePerPerson)
      formData.append('Caster_packageprice', this.editingTour.casterpackagePricePerPerson)
      formData.append('HiAC_packageprice', this.editingTour.hiacpackagePricePerPerson)
      formData.append('limo_children_percentage', this.editingTour.limoChildrenPercentage)
      formData.append('hiac_children_percentage', this.editingTour.hiacChildrenPercentage)
      formData.append('caster_children_percentage', this.editingTour.casterChildrenPercentage)
      formData.append('bus_children_percentage', this.editingTour.busChildrenPercentage)
      formData.append('slug', this.editingTour.packageSlug)
      formData.append('image_alt', this.editingTour.packageImageAlt)
      formData.append('image_caption', this.editingTour.packageImageCaption)
      formData.append('meta_title', this.editingTour.packageMetaTitle)
      formData.append('meta_desc', this.editingTour.packageMetaDesc)
      if (this.editingTour.buspackagePricePerPerson) formData.append('bus_packageprice', this.editingTour.buspackagePricePerPerson)
      formData.append('children_percentage', this.editingTour.childrenpercentage)
      formData.append('single_supplement_percentage', this.editingTour.single_supplement_percentage)
      if (this.editingTour.isTop) formData.append('is_top', this.editingTour.isTop ? 1 : 0)
      if (this.editingTour.rank) formData.append('rank', this.editingTour.rank)
      if (this.checkbox === true) {
        if (this.newstartingairport === null) {
          formData.append('package_starting_airport', this.editingTour.starting_airport)
        } else {
          formData.append('package_starting_airport', this.newstartingairport.City)
        }
      } else {
        formData.append('package_starting_airport', null)
      }
      if (this.editingTour.packageStartDate) formData.append('package_start_date', this.editingTour.packageStartDate)
      else formData.append('package_start_date', '')
      for (let i = 0; i < this.editingTour.packageCities.length; i++) {
        formData.append('package_cities[' + i + '][city_id]', this.editingTour.packageCities[i].cityID)
        formData.append('package_cities[' + i + '][city_day_number]', this.editingTour.packageCities[i].cityDaysNumber)
        formData.append('package_cities[' + i + '][city_duration]', this.editingTour.packageCities[i].cityDuration)
        if (this.editingTour.packageCities[i].cityHotels[0]) {
          formData.append('package_cities[' + i + '][hotel_id]', this.editingTour.packageCities[i].cityHotels[0].hotelID)
        }
        if (this.editingTour.packageCities[i].cityActivities.length > 0) {
          for (let k = 0; k < this.editingTour.packageCities[i].cityActivities.length; k++) {
            formData.append('package_cities[' + i + '][activity][' + k + '][id]', this.editingTour.packageCities[i].cityActivities[k].activity.activityID)
            formData.append('package_cities[' + i + '][activity][' + k + '][day_number]', this.editingTour.packageCities[i].cityActivities[k].activityDayNumber)
          }
        }
        if (this.editingTour.packageCities[i].cityTransportations.length < 1) {
          for (let j = 0; j < this.editingTour.packageCities[i].cityTransportations.length; j++) {
            formData.append('package_cities[' + i + '][transportation][' + j + '][type]', this.editingTour.packageCities[i].cityTransportations[j].transportationType)
            formData.append('package_cities[' + i + '][transportation][' + j + '][date]', this.editingTour.packageCities[i].cityTransportations[j].transportationDate)
            formData.append('package_cities[' + i + '][transportation][' + j + '][price_per_person]', this.editingTour.packageCities[i].cityTransportations[j].transportationPricePerPerson)
          }
        }
      }
      for (let i = 0; i < this.tour.start_days.length; i++) {
        formData.append('start_days[' + i + ']', this.tour.start_days[i])
      }
      for (let i = 0; i < this.tour.seasons.length; i++) {
        formData.append('seasons[' + i + '][from]', this.tour.seasons[i].from)
        formData.append('seasons[' + i + '][to]', this.tour.seasons[i].to)
      }
      if (this.image) formData.append('package_image', this.image, this.image.name)

      for (let i = 0; i < this.images.length; i++) {
        formData.append('images[' + i + ']', this.images[i], this.images[i].name)
      }

      if (this.cruiseID) formData.append('cruise_id', this.cruiseID)
      else if (this.tour.cruise) formData.append('cruise_id', this.tour.cruise.id)

      this.$http.post(updatePackage(this.$route.params.id), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.updatePackageLoading = false
        if (response.body.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Package data was updated successfully'
          this.basicDialog = false
          this.loading = true
          this.addCityDialog = false
          this.changeCruiseDialog = false
          this.getTour()
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.changeCruiseDialog = false
        this.updatePackageLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      }).finally(() => {
        this.changeCruiseDialog = false
      })
    }
  },
  created () {
    this.getTour()
  },
  beforeCreate () {
    this.$http.get(packageLists, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === 200) {
        this.cities = response.body.data.cities
        this.transportationTypes = response.body.data.transportationType
      }
    })
  }
}
</script>

<style>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
