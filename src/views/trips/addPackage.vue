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
        <h3 class="headline gray--text my-5">Add Package</h3>
        <v-stepper v-model="step">
            <v-stepper-header>
                <v-stepper-step
                    step="1"
                >
                    Basic Information
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    step="2"
                >
                    Package Activities
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                step="3"
                >
                  Accommodation
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-form ref="basicForm" v-model="basicFormValid">
                        <v-text-field
                        label="Title"
                        v-model="tour.packageTitle"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'title is required']"
                        color="blue"
                        >
                        </v-text-field>
                        <v-row justify="space-between" align="center" no-gutters>
                        <v-checkbox
                        v-model="tour.is_top"
                        label="Is top tour"
                        ></v-checkbox>
                        <v-col cols="12" sm="4" v-if="tour.is_top">
                            <v-text-field
                            label="Rank"
                            v-model="tour.rank"
                            type="number"
                            min="1"
                            outlined
                            :rules="[v => !!v || 'Rank is required', v => /^[0-9]*$/.test(v) || 'Rank must be an integer number', v => v > 0 || 'Rank must be greater than zero']"
                            color="blue"
                            >
                            </v-text-field>
                        </v-col>
                        </v-row>
                        <wysiwyg v-model="tour.packageOverview" />
                        <v-text-field
                        label="Duration"
                        class="mt-5"
                        v-model="tour.packageDuration"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'duration is required']"
                        color="blue"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Nights Number"
                        outlined
                        v-model="tour.packageNightsNumber"
                        type="number"
                        :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                        color="blue"
                        class="mx-1"
                        >
                        </v-text-field>

                        <v-text-field
                            label="Additional Price"
                            outlined
                            class="inputNumber mx-1"
                            v-model="tour.additionalcost"
                            type="number"
                            :rules="[]"
                            color="blue"
                            prefix="$"
                        >
                        </v-text-field>
                        <!-- :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']" -->

                        <v-text-field
                            label="Discount Percentage"
                            outlined
                            class="inputNumber mx-1"
                            v-model="tour.discountPercent"
                            type="number"
                            :rules="[]"
                            color="blue"
                            prefix="%"
                        >
                        </v-text-field>
                        <!-- :rules="[v => /^[0-9]*$/.test(v) || 'Discount must be numbers']" -->
                        <v-divider></v-divider>
                        <v-card class="my-4 pa-4 text-center" v-for="(availability, index) in tour.availabilities" :key="index">
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
                            <v-row>
                              <v-col cols="12">
                                <v-select
                                v-model="availability.days"
                                :items="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                                :menu-props="{ maxHeight: '400' }"
                                label="Choose Start Days"
                                :rules="[v => !!v || 'item is required']"
                                prepend-inner-icon="mdi-calendar"
                                chips
                                deletable-chips
                                multiple
                                outlined
                                ></v-select>
                              </v-col>
                            </v-row>
                          </div>
                          <v-btn @click="removeAvailability(index)" color="red">Remove Availability</v-btn>
                        </v-card>
                        <v-divider></v-divider>
                        <v-btn @click="addNewAvailability()" color="primary" class="mb-4 mt-2">Add New Availability</v-btn>

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

                        <v-simple-table dense v-if="tour.includes.length > 0">
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
                                  <tr v-for="(item, i) in tour.includes" :key="i">
                                      <td>{{ item }}</td>
                                      <td class="text-right">
                                          <v-btn icon color="error" large @click="tour.includes.splice(i, 1)">
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

                        <v-simple-table dense v-if="tour.excludes.length > 0">
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
                                  <tr v-for="(item, i) in tour.excludes" :key="i">
                                      <td>{{ item }}</td>
                                      <td class="text-right">
                                          <v-btn icon color="error" large @click="tour.excludes.splice(i, 1)">
                                              <v-icon>mdi-trash-can</v-icon>
                                          </v-btn>
                                      </td>
                                  </tr>
                              </tbody>
                          </template>
                        </v-simple-table>

                        <!-- start days -->
                        <!-- <v-select
                        v-model="tour.startDays"
                        :items="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                        :menu-props="{ maxHeight: '400' }"
                        label="Choose Start Days"
                        :rules="[v => !!v || 'item is required']"
                        prepend-inner-icon="mdi-calendar"
                        chips
                        deletable-chips
                        multiple
                        outlined
                        ></v-select> -->

                        <!-- seasons -->
                        <!-- <v-menu
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
                        </v-menu> -->

                        <!-- seasons display -->
                        <!-- <v-card outlined v-if="tour.tourSeasons.length" class="pa-1 mb-5">
                        <v-card-text>
                            <dir v-for="(item, i) in tour.tourSeasons" :key="i" class="d-flex align-center justify-space-between">
                            <p class="text-h6">Season: from{{item.from + ' to ' + item.to}}</p>
                            <v-btn icon color="error" @click="tour.tourSeasons = tour.tourSeasons.filter(data => data.from !== item.from && data.to !== item.to)"><v-icon>mdi-delete</v-icon></v-btn>
                            </dir>
                        </v-card-text>
                        </v-card> -->

                        <!-- recommended start date -->
                        <!-- <v-menu
                        v-model="startDateMenu"
                        :close-on-content-click="false"
                        :nudge-right="10"
                        transition="scale-transition"
                        min-width="auto"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="tour.packageStartDate"
                            label="Recommended Start Date"
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
                            v-model="tour.packageStartDate"
                            @input="startDateMenu = false"
                            :min="new Date().toISOString().substr(0, 10)"
                            show-current
                        ></v-date-picker>
                        </v-menu> -->
                        <!-- <v-text-field
                            label="Occupancy"
                            outlined
                            v-model="tour.packageOccupancy"
                            type="number"
                            :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                            color="blue"
                            class="mx-1"
                        >
                        </v-text-field> -->
                        <!-- <v-text-field
                            label="Expected price"
                            outlined
                            class="inputNumber mx-1"
                            v-model="tour.expectedprice"
                            type="number"
                            :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                            color="blue"
                            prefix="$"
                        >
                        </v-text-field> -->
                        <v-file-input
                        v-model="image"
                        accept="image/*"
                        label="Cover Image"
                        :rules="[validateImage]"
                        color="blue"
                        outlined
                        show-size
                        @change="clearImageOnRemove"
                        >
                        </v-file-input>

                          <!-- add image form -->
                          <v-card class="my-4 pa-4 text-center" v-for="(imageData, index) in images"  :key="index">
                            <h1 v-bind:style="{ textAlign: 'left', fontWeight: 'Medium', padding: '1rem', fontSize: '20px' }"
                            > image{{ imageData.sort }} </h1>
                            <v-img max-width="30%" class="my-4 pa-4 text-center"  :key="index" :src="imageData.image" max-height="150"></v-img>
                            <v-row>
                              <v-col cols="12" sm="9">
                             <v-file-input
                            v-model="imageData.file"
                            accept="image/*"
                            label="package Image"
                            :rules="[v => !!v || 'Please insert a photo'|| value.size < 2000000 || 'Image size should be less than 2 MB!']"
                            color="blue"
                            outlined
                            show-size
                            @change="loadImagesUrl($event, index)"
                            >
                            </v-file-input>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                            v-model="imageData.sort"
                            label="sort image"
                            type="number"
                            min="1"
                            outlined
                            :rules="[v => !!v || 'item is required',  v => v.length > 0 ]"
                            color="blue"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                          <v-btn @click="removeImage(index)" color="red">Remove Image</v-btn>
                        </v-card>
                        <v-divider></v-divider>
                        <v-btn @click="addNewimage()" color="primary" class="mb-4 mt-2">Add Image</v-btn>

                        <v-text-field
                        label="Slug"
                        v-model="tour.slug"
                        type="text"
                        outlined
                        color="orange"
                        :error-messages="slugErrors"
                        @input="checkSlug"
                        >
                        </v-text-field>

                        <div v-if="slugAlt">
                        <v-btn color="blue" small text @click="tour.slug = slugAlt; slugAlt = ''; slugErrors = ''">{{slugAlt}}</v-btn>
                        </div>

                        <v-text-field
                        label="Image Caption"
                        v-model="tour.image_caption"
                        type="text"
                        outlined
                        color="orange"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Image Alt"
                        v-model="tour.image_alt"
                        type="text"
                        outlined
                        color="orange"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Meta Title"
                        v-model="tour.packageMetaTitle"
                        type="text"
                        outlined
                        color="orange"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Meta Description"
                        v-model="tour.packageMetaDesc"
                        type="text"
                        outlined
                        color="orange"
                        >
                        </v-text-field>
                    </v-form>

                    <v-divider class="my-3"></v-divider>
                    <v-btn
                    color="primary"
                    @click="step = 2"
                    class="my-3"
                    :disabled="!basicFormValid"
                    >
                    Continue To Package Activities
                    </v-btn>

                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-form ref="detailsForm" v-model="citiesFormValid">
                        <p class="font-weight-bold">Package city</p>
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-select
                                v-model="cityID"
                                :items="cities"
                                item-value="CityID"
                                item-text="CityName"
                                color="blue"
                                outlined
                                label="Package City"
                                @input="getActivitiesByCity()"
                                >
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-text-field
                                label="Days Number"
                                outlined
                                v-model="cityDayNumber"
                                type="number"
                                color="blue"
                                class="mx-1"
                                @input="createDaysArray"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                              <v-select
                                v-model="selectedCityActivityType"
                                :items="cityActivityType"
                                label="Activity Type"
                                outlined
                                clearable
                                @input="getActivitiesByCity();createDaysArray()"
                              ></v-select>
                            </v-col>
                        </v-row>
                        <v-row v-if="cityDayNumber !== null">
                            <v-col cols="12">
                              <v-expansion-panels v-if="cityDayNumber !== null">
                                <v-expansion-panel v-for="(day, index) in cityDays" :key="index">
                                  <v-expansion-panel-header  v-if="selectedCityActivityType === 'Adventure'">
                                    <span>Day {{ total_number_of_days + index + 1 }}</span>
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-header  v-else>
                                    <span>Day {{ total_number_of_days + index + 1 }} - {{ total_number_of_days + Number(cityDayNumber) }}</span>
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content v-if="selectedCityActivityType === 'Adventure'">
                                    <v-select
                                      v-model="dayActivities[index]"
                                      :items="activities"
                                      item-value="activityID"
                                      item-text="activityTitle"
                                      color="blue"
                                      outlined
                                      label="Select Adventures"
                                      multiple
                                    ></v-select>
                                  </v-expansion-panel-content>
                                  <v-expansion-panel-content v-else>
                                    <v-select
                                      v-model="dayActivity"
                                      :items="activities"
                                      item-value="activityID"
                                      item-text="activityTitle"
                                      color="blue"
                                      outlined
                                      label="Select Cruise"
                                    ></v-select>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </v-col>
                        </v-row>
                        <div v-if="selectedCityActivityType === 'Adventure'">
                          <v-divider class="my-2"></v-divider>
                          <p class="font-weight-bold">Package City Transportaions</p>
                          <v-row>
                              <v-col cols="12" md="3">
                                <!-- <v-select
                                v-model="transportation.name"
                                :items="transportationTypes"
                                color="blue"
                                outlined
                                label="Type"
                                >
                                </v-select> -->
                                <v-text-field v-model="transportation.name" label="Name" outlined class="mx-1" type="text" color="blue">
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" md="2">
                                <v-text-field v-model="transportation.min" label="Min" outlined class="inputNumber mx-1" type="number" color="blue">
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" md="2">
                                <v-text-field v-model="transportation.max" label="Max" outlined class="inputNumber mx-1" type="number" color="blue">
                                </v-text-field>
                              </v-col>
                              <v-col cols="12" md="3">
                                  <v-text-field
                                  label="Price/Person"
                                  outlined
                                  class="inputNumber mx-1"
                                  v-model="transportation.price"
                                  type="number"
                                  color="blue"
                                  prefix="$"
                                  >
                                  </v-text-field>
                              </v-col>
                              <v-col cols="12" md="2">
                                  <v-btn height="56" @click="addTransportation" tile block color="success" :disabled="!transportation.name || !transportation.min || !transportation.max || !transportation.price"><v-icon left>mdi-plus</v-icon><span>Add</span></v-btn>
                              </v-col>
                          </v-row>
                          <v-simple-table dense v-if="transportations.length > 0">
                              <template v-slot:default>
                                  <thead>
                                  <tr>
                                      <th class="text-left">
                                      Name
                                      </th>
                                      <th class="text-left">
                                      Min
                                      </th>
                                      <th class="text-left">
                                      Max
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
                                  v-for="(item, i) in transportations"
                                  :key="i"
                                  >
                                      <td>{{ item.name }}</td>
                                      <td>{{ item.min }}</td>
                                      <td>{{ item.max }}</td>
                                      <td>${{ item.price }}</td>
                                      <td class="text-right">
                                      <v-btn icon color="error" large @click="transportations.splice(i, 1)">
                                          <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                      </td>
                                  </tr>
                                  </tbody>
                              </template>
                          </v-simple-table>
                          <v-divider v-if="transportations.length > 0" class="my-2"></v-divider>
                        </div>
                        <v-row>
                          <v-col cols="12" md="12" v-if="selectedCityActivityType === 'Adventure'">
                            <!-- <v-btn block class="my-3" tile color="primary" @click="addProgram" :disabled="(!hotelID && dayActivities.length < 1) || !cityDayNumber">Add City Program</v-btn> -->
                            <v-btn block class="my-3" tile color="primary" @click="addProgram" :disabled="!cityDayNumber">Add City Program</v-btn>
                          </v-col>
                          <v-col cols="12" md="12" v-else>
                            <v-btn block class="my-3" tile color="primary" @click="addProgram" :disabled="(!hotelID && !dayActivity) || !cityDayNumber">Add City Program</v-btn>
                          </v-col>
                        </v-row>
                        <div class="my-10"></div>
                        <p class="font-weight-bold">Package List</p>
                        <v-expansion-panels>
                          <v-expansion-panel v-for="(item, i) in adventure_or_cruise" :key="i">
                            <v-expansion-panel-header color="#e0e0e0" @click="getActivitiesByCityParams(item.city_id, item.type);">
                              <span v-for="city in cities" :key="city.CityID">
                                <span v-if="city.CityID === item.city_id">{{ city.CityName }}</span>
                              </span>
                            </v-expansion-panel-header>

                            <v-expansion-panel-content color="#e0e0e0">
                              <v-card>
                                <v-card-title>
                                  {{ item.number_of_days }} Days with Type {{ item.type }}
                                  <span v-for="activity in activities" :key="activity.activityID">
                                    <span v-if="item.type === 'cruise' && activity.activityID === item.cruise_id"> [ {{ activity.activityTitle }} ] </span>
                                  </span>
                                </v-card-title>
                                <v-card-text>
                                  <p v-if="item.days !== null">Days</p>
                                  <v-expansion-panels v-if="item.days !== null && item.type !== 'cruise'">
                                    <v-expansion-panel v-for="day in item.days" :key="day.day_order">
                                      <v-expansion-panel-header>
                                        <span>Day {{ day.day_number }}</span>
                                      </v-expansion-panel-header>
                                      <v-expansion-panel-content>
                                        <v-select
                                          v-model="day.list_adventures"
                                          :items="activities"
                                          item-value="activityID"
                                          item-text="activityTitle"
                                          color="blue"
                                          outlined
                                          label="Select Adventures"
                                          multiple
                                          disabled
                                        ></v-select>
                                      </v-expansion-panel-content>
                                    </v-expansion-panel>
                                  </v-expansion-panels>
                                  <v-expansion-panels v-else>
                                    <v-expansion-panel>
                                      <v-expansion-panel-header>
                                        <span>Day {{ item.start_day }} - {{ item.end_day }}</span>
                                      </v-expansion-panel-header>
                                      <v-expansion-panel-content>
                                        <v-select
                                          v-model="item.cruise_id"
                                          :items="activities"
                                          item-value="activityID"
                                          item-text="activityTitle"
                                          color="blue"
                                          outlined
                                          label="Select Cruise"
                                          disabled
                                        ></v-select>
                                      </v-expansion-panel-content>
                                    </v-expansion-panel>
                                  </v-expansion-panels>
                                  <div v-if="item.type !== 'cruise'">
                                    <v-divider class="my-2"></v-divider>
                                    <p>Transportaions</p>
                                    <v-simple-table dense v-if="item.Transportation.length > 0">
                                      <template v-slot:default>
                                          <thead>
                                          <tr>
                                              <th class="text-left">
                                              Name
                                              </th>
                                              <th class="text-left">
                                              Min
                                              </th>
                                              <th class="text-left">
                                              Max
                                              </th>
                                              <th class="text-left">
                                              Price
                                              </th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr
                                          v-for="(item, i) in item.Transportation"
                                          :key="i"
                                          >
                                              <td>{{ item.name }}</td>
                                              <td>{{ item.min }}</td>
                                              <td>{{ item.max }}</td>
                                              <td>${{ item.price }}</td>
                                          </tr>
                                          </tbody>
                                      </template>
                                    </v-simple-table>
                                  </div>
                                </v-card-text>
                                <v-card-actions>
                                  <v-btn color="primary" @click="showDetailsDialog(item, i)">Edit</v-btn>
                                  <v-btn icon color="error" large @click="deleteItem(i)">
                                    <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                        <!-- <v-simple-table dense v-if="tour.cities.length > 0">
                          <template v-slot:default>
                            <thead>
                              <tr>
                                  <th class="text-left">
                                  City
                                  </th>
                                  <th class="text-left">
                                  Details
                                  </th>
                                  <th class="text-right">
                                  Remove
                                  </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                              v-for="(item, i) in adventure_or_cruise"
                              :key="i"
                              >
                                <td>
                                  <span v-for="city in cities" :key="city.CityID">
                                    <span v-if="city.CityID === item.city_id">{{city.CityName}}</span>
                                  </span>
                                </td>
                                <td>
                                  <v-btn color="success" @click="showDetailsDialog(item)">
                                    Show
                                  </v-btn>
                                </td>
                                <td class="text-right">
                                  <v-btn icon color="error" large @click="deleteItem(i)">
                                    <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table> -->
                        <v-dialog v-model="dialogDetailsVisible" max-width="1000px" v-if="selectedCity">
                          <v-card>
                            <v-card-title>
                              {{ selectedCity.CityName }}
                            </v-card-title>
                            <v-card-text>
                              <p class="font-weight-bold">Package city</p>
                              <v-row>
                                <v-col cols="12" sm="4">
                                  <v-select
                                  v-model="editCityID"
                                  :items="cities"
                                  item-value="CityID"
                                  item-text="CityName"
                                  color="blue"
                                  outlined
                                  label="Package City"
                                  @input="getActivitiesByCity()"
                                  >
                                  </v-select>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <v-text-field
                                  label="Days Number"
                                  outlined
                                  v-model="editCityDayNumber"
                                  type="number"
                                  color="blue"
                                  class="mx-1"
                                  @input="editDaysArray"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <v-select
                                    v-model="editSelectedCityActivityType"
                                    :items="cityActivityType"
                                    label="Activity Type"
                                    outlined
                                    clearable
                                    @input="getActivitiesByCity();editDaysArray()"
                                  ></v-select>
                                </v-col>
                              </v-row>
                              <v-expansion-panels v-if="editCityDayNumber !== null">
                                <v-expansion-panel v-for="(day, index) in editCityDays" :key="index">
                                  <v-expansion-panel-header  v-if="editSelectedCityActivityType === 'Adventure'">
                                    <span>Day {{ index + 1 }}</span>
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-header  v-else>
                                    <span>{{ Number(editCityDayNumber) }} Days</span>
                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content v-if="editSelectedCityActivityType === 'Adventure'">
                                    <v-select
                                      v-model="editDayActivities[index]"
                                      :items="activities"
                                      item-value="activityID"
                                      item-text="activityTitle"
                                      color="blue"
                                      outlined
                                      label="Select Adventures"
                                      multiple
                                    ></v-select>
                                  </v-expansion-panel-content>
                                  <v-expansion-panel-content v-else>
                                    <v-select
                                      v-model="editDayActivity"
                                      :items="activities"
                                      item-value="activityID"
                                      item-text="activityTitle"
                                      color="blue"
                                      outlined
                                      label="Select Cruise"
                                    ></v-select>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>
                              <div v-if="editSelectedCityActivityType === 'Adventure'">
                                <v-divider class="my-2"></v-divider>
                                <p>Transportaions</p>
                                <v-row>
                                  <v-col cols="12" md="3">
                                    <!-- <v-select
                                    v-model="editTransportation.name"
                                    :items="transportationTypes"
                                    color="blue"
                                    outlined
                                    label="Type"
                                    >
                                    </v-select> -->
                                    <v-text-field v-model="editTransportation.name" label="Name" outlined class="mx-1" type="text" color="blue">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="2">
                                    <v-text-field v-model="editTransportation.min" label="Min" outlined class="inputNumber mx-1" type="number" color="blue">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="2">
                                    <v-text-field v-model="editTransportation.max" label="Max" outlined class="inputNumber mx-1" type="number" color="blue">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="3">
                                      <v-text-field
                                      label="Price/Person"
                                      outlined
                                      class="inputNumber mx-1"
                                      v-model="editTransportation.price"
                                      type="number"
                                      color="blue"
                                      prefix="$"
                                      >
                                      </v-text-field>
                                  </v-col>
                                  <v-col cols="12" md="2">
                                      <v-btn height="56" @click="EditTransportation" tile block color="success" :disabled="!editTransportation.name || !editTransportation.min || !editTransportation.max || !editTransportation.price"><v-icon left>mdi-plus</v-icon><span>Add</span></v-btn>
                                  </v-col>
                                </v-row>
                                <v-simple-table dense v-if="editTransportations.length > 0">
                                  <template v-slot:default>
                                      <thead>
                                        <tr>
                                          <th class="text-left">
                                          Type
                                          </th>
                                          <th class="text-left">
                                          Min
                                          </th>
                                          <th class="text-left">
                                          Max
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
                                      v-for="(item, i) in editTransportations"
                                      :key="i"
                                      >
                                          <td>{{ item.name }}</td>
                                          <td>{{ item.min }}</td>
                                          <td>{{ item.max }}</td>
                                          <td>${{ item.price }}</td>
                                          <td class="text-right">
                                            <v-btn icon color="error" large @click="editTransportations.splice(i, 1)">
                                              <v-icon>mdi-trash-can</v-icon>
                                            </v-btn>
                                          </td>
                                      </tr>
                                      </tbody>
                                  </template>
                                </v-simple-table>
                              </div>
                            </v-card-text>
                            <v-card-actions>
                              <v-btn color="success" @click="saveData">Save</v-btn>
                              <v-btn color="primary" @click="closeDetailsDialog">Close</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                    </v-form>
                    <v-divider class="my-10"></v-divider>
                    <v-row>

                        <v-btn
                        color="warning"
                        text
                        @click="step = 1"
                        class="ml-5 my-3"
                        >
                        Back To Basics
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn
                        class="mr-5 my-3"
                        color="primary"
                        @click="step = 3"
                        :disabled="activity.length > 0"
                        >
                        Continue To Accommodation
                        </v-btn>

                    </v-row>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-form ref="roomsForm" v-model="roomsFormValid">
                      <p class="font-weight-bold">Package city hotel</p>
                      <v-card class="my-4 pa-4 text-center" v-for="(hotel, index) in tour.accommodation" :key="index">
                        <div>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="selectedGtaCity[index]"
                                :items="gtaCities"
                                item-value="id"
                                item-text="name"
                                color="blue"
                                outlined
                                label="City"
                                :disabled="tour.cities.length === 0"
                                @input="getGtaHotels(index)"
                                >
                              </v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-select
                                v-model="selectHotels[index]"
                                :items="gtaHotels[index]"
                                item-value="id"
                                item-text="name"
                                color="blue"
                                outlined
                                label="Package Hotel"
                                multiple
                                :disabled="tour.cities.length === 0"
                                >
                              </v-select>
                            </v-col>
                          </v-row>
                        </div>
                        <v-btn @click="removeHotel(index)" color="red">Remove Hotel</v-btn>
                      </v-card>
                      <v-divider></v-divider>
                      <v-btn @click="addNewHotel()" color="primary" class="mb-4 mt-2">Add New Hotel</v-btn>
                    </v-form>

                    <v-row>

                      <v-btn
                      color="warning"
                      text
                      @click="step = 2"
                      class="ml-5 my-3"
                      :disabled="addHotelLoading"
                      >
                      Back To Details
                      </v-btn>

                      <v-spacer></v-spacer>

                      <v-btn
                      class="mr-5 my-3"
                      color="primary"
                      :disabled="tour.cities.length === 0"
                      @click="addTour"
                      :loading="addHotelLoading"
                      >
                      Add Package
                      </v-btn>

                    </v-row>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-container>
</template>

<script>
import { packageLists, slug, allPackages, activitiesByCityId, activitiesCruiseByCityId, hotelsByCityId, roomsByHotelId, addPackage, removePackage, getAirports, cruisesByCity, headers, gtaCountries, gtaCities, gtaHotels } from '../../links'
import axios from 'axios'
import xml2js from 'xml2js'

export default {
  components: {},
  data () {
    return {
      step: 1,
      basicFormValid: true,
      citiesFormValid: true,
      roomsFormValid: true,
      addHotelLoading: false,
      search: null,
      occupancy: 0,
      Airports: [],
      tours: [],
      totalPackages: 0,
      cities: [],
      hotels: [],
      rooms: [],
      cruiseCityID: null,
      cruiseID: null,
      cruises: [],
      activities: [],
      transportationTypes: [],
      menu: false,
      startDateMenu: false,
      seasonDateMenu: false,
      seasonDates: [],
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      tourHeaders: [
        { text: 'Image', value: 'packageImage' },
        { text: 'Title', value: 'packageTitle' },
        { text: 'Starting Airport', value: 'packagestartingairport' },
        { text: 'Start City', value: 'packageStartCity.cityName' },
        { text: 'Destinations', value: 'destination' },
        { text: 'Occupancy', value: 'package_occupancy' },
        { text: 'Expected Price', value: 'expected_price' },
        { text: 'Duration', value: 'packageDuration' },
        { text: 'Remove', value: 'removeTour', align: 'end' }
      ],
      actionType: 'add',
      tour: {
        packageTitle: '',
        internationalairport: false,
        packagestartingairport: '',
        packageOverview: '',
        packageStartDate: '',
        packageDuration: '',
        packagePricePerPerson: '',
        packageNightsNumber: '',
        additionalCost: 0,
        cities: [],
        is_top: false,
        rank: null,
        startDays: [],
        tourSeasons: [],
        slug: '',
        image_alt: '',
        image_caption: '',
        packageMetaTitle: '',
        packageMetaDesc: '',
        availabilities: [],
        includes: [],
        excludes: [],
        discountPercent: 0,
        accommodation: []
      },
      image: null,
      images: [],
      load_image: null,
      cityID: '',
      cityName: '',
      cityDayNumber: '',
      cityDays: [],
      cityDuration: '',
      cityMinimumOfDays: '',
      cityDayPrice: '',
      cityActivityType: ['Adventure', 'Nile Cruise'],
      selectedCityActivityType: '',
      hotelID: '',
      roomID: '',
      chosenRoom: {},
      activity: {
        id: '',
        dayNumber: ''
      },
      cityActivities: [],
      transportations: [],
      // transportation: {
      //   price: '',
      //   type: ''
      // },
      transportation: {
        name: '',
        min: '',
        max: '',
        price: ''
      },
      roomsDialog: false,
      dialog: false,
      valid: true,
      btnLoad: false,
      deletedItemId: '',
      removePackageDialog: false,
      slugErrors: '',
      slugAlt: '',
      dayActivities: [],
      adventure_or_cruise: [],
      menu3: false,
      menu4: false,
      include: '',
      exclude: '',
      dialogDetailsVisible: false,
      selectedCity: null,
      selectedItemOfActivity: null,
      selectedDayActivities: [],
      total_number_of_days: 0,
      editCityID: '',
      editCityDayNumber: '',
      editSelectedCityActivityType: '',
      editTransportations: [],
      // editTransportation: {
      //   price: '',
      //   type: ''
      // },
      editTransportation: {
        name: '',
        min: '',
        max: '',
        price: ''
      },
      editSelectedItemOfActivity: null,
      editDayActivities: [],
      editCityDays: [],
      selectedItemIndexofActiviy: null,
      day_number_start: 0,
      dayActivity: '',
      editDayActivity: '',
      xmlData: null,
      gtaCountries: [],
      gtaCities: [],
      gtaHotels: [],
      selectedGtaCity: [],
      selectHotels: []
    }
  },
  computed: {},
  methods: {
    setSeason (dates) {
      if (dates[0] && dates[1]) {
        const firstDate = new Date(dates[0])
        const lastDate = new Date(dates[1])
        if (lastDate.getTime() > firstDate.getTime()) {
          this.tour.tourSeasons.push({
            from: dates[0],
            to: dates[1]
          })
        } else {
          this.tour.tourSeasons.push({
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
    openRoomDialog () {
      if (this.rooms.length > 0) {
        this.roomsDialog = true
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'This Hotel has not any rooms'
      }
    },
    chooseRoom (room) {
      this.roomID = room.roomId
      this.chosenRoom = room
      this.roomsDialog = false
    },
    validateImage (value) {
      if (!value) return 'Cover Image is required!'
      if (value.size >= 5000000) return 'Cover Image size should be less than 5 MB!'
      return true
    },
    clearImageOnRemove (file) {
      // If the user removes the selected file, set the image to null
      if (!file) {
        this.image = null
      }
    },
    createDaysArray () {
      this.calcTotalNumberOfDays()
      if (Number(this.cityDayNumber) > 0) {
        if (this.selectedCityActivityType === 'Adventure') {
          this.cityDays = []
          for (let i = 0; i < Number(this.cityDayNumber); i++) {
            this.cityDays[i] = i + 1
          }
        } else {
          this.cityDays = 1
        }
      }
    },
    calcTotalNumberOfDays () {
      var totalDays = 0
      if (this.adventure_or_cruise.length > 0) {
        const arrayCities = this.adventure_or_cruise
        for (let x = 0; x < arrayCities.length; x++) {
          totalDays += Number(arrayCities[x].number_of_days)
        }
      }
      this.total_number_of_days = totalDays
    },
    editDaysArray () {
      if (Number(this.editCityDayNumber) > 0) {
        if (this.editSelectedCityActivityType === 'Adventure') {
          this.editCityDays = []
          for (let i = 0; i < Number(this.editCityDayNumber); i++) {
            this.editCityDays[i] = i + 1
          }
        } else {
          this.editCityDays = 1
        }
      }
    },
    getCruisesByCity () {
      this.$http.get(cruisesByCity(this.cruiseCityID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.status === 200) {
          this.cruises = response.body.data
        }
      })
    },
    getHotelsByCity () {
      this.$http.get(hotelsByCityId(this.cityID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.hotels = response.body.data
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
      this.$http.get(activitiesCruiseByCityId(this.cityID, this.selectedCityActivityType === ('Adventure' || 'adventure') ? 'adventure' : 'cruise'), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.activities = response.body.data
        }
      })
    },
    getActivitiesByCityParams (city, type) {
      this.$http.get(activitiesCruiseByCityId(city, ((type === 'Adventure') || (type === 'adventure')) ? 'adventure' : 'cruise'), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.activities = response.body.data
        }
      })
    },
    getActivitiesByCityId (activity) {
      this.$http.get(activitiesByCityId(activity.city_id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.activities = response.body.data
        }
      })
      // console.log(activity.selectedDayActivities)
      if (activity.selectedDayActivities.length > 0) {
        this.selectedDayActivities = activity.selectedDayActivities
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
    addActivity () {
      this.cityActivities.push(this.activity)
      this.activity = {
        id: '',
        dayNumber: ''
      }
    },
    addTransportation () {
      this.transportations.push(this.transportation)
      // this.transportation = {
      //   price: '',
      //   type: ''
      // }
      this.transportation = {
        name: '',
        min: '',
        max: '',
        price: ''
      }
    },
    EditTransportation () {
      this.editTransportations.push(this.editTransportation)
      // this.editTransportation = {
      //   price: '',
      //   type: ''
      // }
      this.editTransportation = {
        name: '',
        min: '',
        max: '',
        price: ''
      }
    },
    addProgram () {
      this.tour.cities.push(
        {
          id: this.cityID,
          city_day_number: this.cityDayNumber,
          city_duration: this.cityDuration,
          min_days: this.cityMinimumOfDays,
          city_day_price: this.cityDayPrice,
          hotelId: this.hotelID,
          activities: this.cityActivities,
          transportations: this.transportations
        }
      )

      const updatedDays = this.dayActivities.map((day, index) => ({
        day_order: index + 1,
        adventures: this.dayActivities[index].map(activityID => ({
          adventure_id: activityID
        })),
        list_adventures: this.dayActivities[index],
        day_number: ++this.day_number_start
      }))

      if (this.selectedCityActivityType !== 'Adventure') {
        this.day_number_start += Number(this.cityDayNumber)
      }

      this.adventure_or_cruise.push(
        {
          index_id: this.adventure_or_cruise.length + 1,
          city_id: this.cityID,
          cruise_id: this.selectedCityActivityType === 'Adventure' ? null : this.dayActivity,
          type: this.selectedCityActivityType === 'Adventure' ? 'adventure' : 'cruise',
          number_of_days: this.cityDayNumber,
          days: this.selectedCityActivityType === 'Adventure' ? updatedDays : null,
          Transportation: this.transportations,
          selectedDayActivities: this.selectedCityActivityType === 'Adventure' ? this.dayActivities : this.dayActivity,
          start_day: this.selectedCityActivityType !== 'Adventure' ? Number(this.total_number_of_days) + 1 : 0,
          end_day: this.selectedCityActivityType !== 'Adventure' ? Number(this.total_number_of_days) + Number(this.cityDayNumber) : 0
        }
      )

      // this.total_number_of_days = parseInt(this.total_number_of_days) + parseInt(this.cityDayNumber)
      this.cityID = ''
      this.cityDayNumber = ''
      this.cityDuration = ''
      this.hotelID = ''
      this.cityActivities = []
      this.transportations = []
      this.selectedCityActivityType = null
      this.cityDays = []
      this.dayActivities = []
      this.dayActivity = ''
      this.calcTotalNumberOfDays()
    },
    addTourForm () {
      this.dialog = true
      this.hotelID = ''
      this.chosenRoom = {}
      this.tour = {
        packageTitle: '',
        internationalairport: false,
        packagestartingairport: '',
        packageOverview: '',
        packageStartDate: '',
        packageDuration: '',
        packagePricePerPerson: '',
        packageNightsNumber: '',
        additionalCost: 0,
        discountPercent: 0,
        cities: [],
        is_top: false,
        rank: null,
        startDays: [],
        tourSeasons: [],
        slug: '',
        image_alt: '',
        image_caption: '',
        packageMetaTitle: '',
        packageMetaDesc: ''
      }
    },
    checkSlug (value) {
      this.$http.get(slug(value), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        console.log(response.data.availability)
        if (!response.data.availability) {
          this.slugErrors = 'This slug is taken! Use instead: '
          this.slugAlt = response.data.alternative
        }
      }).catch(error => {
        console.log(error)
      }).finally(final => {
        // console.log(final)
      })
    },
    addTour () {
      this.addHotelLoading = true
      const formData = new FormData()
      formData.append('package_title', this.tour.packageTitle)
      formData.append('package_overview', this.tour.packageOverview)
      formData.append('package_duration', this.tour.packageDuration)
      formData.append('package_nights_number', this.tour.packageNightsNumber)
      formData.append('additional_price', this.tour.additionalCost)
      formData.append('discount_precentage', this.tour.discountPercent)
      formData.append('slug', this.tour.slug)
      formData.append('image_alt', this.tour.image_alt)
      formData.append('image_caption', this.tour.image_caption)
      formData.append('meta_title', this.tour.packageMetaTitle)
      formData.append('meta_desc', this.tour.packageMetaDesc)
      this.images.forEach((imageData, index) => {
        formData.append(`images[${index}][file]`, imageData.file ? imageData.file : null)
        formData.append(`images[${index}][sort]`, imageData.sort ? imageData.sort : index + 1)
      })
      if (this.tour.is_top) formData.append('is_top', this.tour.is_top ? 1 : 0)
      if (this.tour.rank) formData.append('rank', this.tour.rank)
      for (let i = 0; i < this.tour.availabilities.length; i++) {
        formData.append('availabilties[' + i + '][from_date]', this.tour.availabilities[i].from_date)
        formData.append('availabilties[' + i + '][to_date]', this.tour.availabilities[i].to_date)
        // formData.append('availabilites[' + i + '][days]', this.tour.availabilities[i].days)
        if (this.tour.availabilities[i].days) {
          for (let k = 0; k < this.tour.availabilities[i].days.length; k++) {
            formData.append('availabilties[' + i + '][days][' + k + ']', this.tour.availabilities[i].days[k])
          }
        }
      }

      if (this.tour.includes) {
        for (let y = 0; y < this.tour.includes.length; y++) {
          formData.append('package_includes[' + y + ']', this.tour.includes[y])
        }
      }

      if (this.tour.excludes) {
        for (let z = 0; z < this.tour.excludes.length; z++) {
          formData.append('package_excludes[' + z + ']', this.tour.excludes[z])
        }
      }

      for (let x = 0; x < this.adventure_or_cruise.length; x++) {
        formData.append('activities[' + x + '][city_id]', this.adventure_or_cruise[x].city_id)
        if (this.adventure_or_cruise[x].cruise_id !== null) {
          formData.append('activities[' + x + '][cruise_id]', this.adventure_or_cruise[x].cruise_id)
        }
        formData.append('activities[' + x + '][type]', this.adventure_or_cruise[x].type)
        formData.append('activities[' + x + '][days_number]', this.adventure_or_cruise[x].number_of_days)
        if (this.adventure_or_cruise[x].days) {
          for (let w = 0; w < this.adventure_or_cruise[x].days.length; w++) {
            formData.append('activities[' + x + '][days][' + w + '][day_number]', this.adventure_or_cruise[x].days[w].day_order)
            if (this.adventure_or_cruise[x].days[w].adventures) {
              for (let m = 0; m < this.adventure_or_cruise[x].days[w].adventures.length; m++) {
                // formData.append('activities[' + x + '][days][' + w + '][adventures][' + m + '][adventure_id]', this.adventure_or_cruise[x].days[w].adventures[m].adventure_id)
                formData.append('activities[' + x + '][days][' + w + '][adventrues][' + m + '][adventrue_id]', this.adventure_or_cruise[x].days[w].adventures[m].adventure_id)
              }
            }
          }
        }
        if (this.adventure_or_cruise[x].Transportation) {
          for (let t = 0; t < this.adventure_or_cruise[x].Transportation.length; t++) {
            formData.append('activities[' + x + '][transportation][' + t + '][name]', this.adventure_or_cruise[x].Transportation[t].name)
            formData.append('activities[' + x + '][transportation][' + t + '][min]', this.adventure_or_cruise[x].Transportation[t].min)
            formData.append('activities[' + x + '][transportation][' + t + '][max]', this.adventure_or_cruise[x].Transportation[t].max)
            formData.append('activities[' + x + '][transportation][' + t + '][price]', this.adventure_or_cruise[x].Transportation[t].price)
          }
        } else {
          formData.append('activities[' + x + '][transportation]', null)
        }
      }

      if (this.image) formData.append('package_image', this.image, this.image.name)
      if (this.load_image) formData.append('load_image', this.images)

      // for (let i = 0; i < this.images.length; i++) {
      //   formData.append('images[' + i + ']', this.images[i], this.images[i].name)
      // }

      // cruiseID
      if (this.cruiseID) formData.append('cruise_id', this.cruiseID)

      if (this.tour.accommodation) {
        for (let a = 0; a < this.tour.accommodation.length; a++) {
          formData.append('accommodation[' + a + '][city_id]', this.selectedGtaCity[a])
          for (let h = 0; h < this.selectHotels[a].length; h++) {
            const getHotelsLoop = this.selectHotels[a]
            formData.append('accommodation[' + a + '][hotels][' + h + '][hotel_id]', getHotelsLoop[h])
          }
        }
      }

      this.$http.post(addPackage, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        console.log(response)
        this.addHotelLoading = false
        if (response.body.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Package was added successfully'
          this.$router.push({ name: 'tripsTours' })
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.errors[0]
        }
      }, err => {
        this.addHotelLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.errors[0]
      })
    },
    showDeletionDialog (id) {
      this.deletedItemId = id
      this.removePackageDialog = true
    },
    removeTour () {
      this.$http.delete(removePackage(this.deletedItemId), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.removePackageDialog = false
        if (response.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Tour was deleted'
          this.getTours(15, 1)
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    },
    getTours (rows, page) {
      this.loading = true
      this.$http.get(allPackages(rows, page), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.body.status === 200) {
          this.tours = response.body.data.packageList
          this.totalPackages = response.body.data.packageTotal
          this.loading = false
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
        this.loading = false
      })
    },
    addNewAvailability () {
      // Validate the date before adding a new availability
      const numAvailabilities = this.tour.availabilities.length
      if (numAvailabilities > 0) {
        const lastAvailability = this.tour.availabilities[numAvailabilities - 1]
        // console.log(lastAvailability.to_date, lastAvailability.from_date)
        if (lastAvailability.to_date >= lastAvailability.from_date) {
          // Add new availability if the previous availability's date range is valid
          const newAvailability = {
            from_date: '',
            to_date: '',
            days: ''
          }
          this.tour.availabilities.push(newAvailability)
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
          days: ''
        }
        this.tour.availabilities.push(newAvailability)
      }
    },
    removeAvailability (availabilityIndex) {
      this.tour.availabilities.splice(availabilityIndex, 1)
    },
    addIncludes () {
      if (this.include) {
        this.tour.includes.push(this.include)
        this.include = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
      }
    },
    addExcludes () {
      if (this.exclude) {
        this.tour.excludes.push(this.exclude)
        this.exclude = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide excludes before submitting'
      }
    },
    showDetailsDialog (item, itemIndex) {
      const city = this.cities.find((city) => city.CityID === item.city_id)
      if (city) {
        this.selectedCity = city
        this.editCityID = item.city_id
        this.editCityDayNumber = item.number_of_days
        this.editSelectedCityActivityType = item.type === 'adventure' ? 'Adventure' : 'Nile Cruise'
        const getItemDays = item.days
        if (item.type !== 'cruise') {
          this.editTransportations = item.Transportation
          for (let index = 0; index < getItemDays.length; index++) {
            this.editDayActivities[index] = getItemDays[index].list_adventures
          }
        } else {
          this.editDayActivity = item.cruise_id
        }
        this.editDaysArray()
        this.dialogDetailsVisible = true
        this.selectedItemOfActivity = item
        this.selectedDayActivities = item.selectedDayActivities
        this.selectedItemIndexofActiviy = itemIndex
      }
    },
    closeDetailsDialog () {
      this.dialogDetailsVisible = false
    },
    deleteItem (index) {
      this.adventure_or_cruise.splice(index, 1)
      this.calcTotalNumberOfDays()
      --this.day_number_start
    },
    saveData () {
      this.day_number_start = 0
      const cityIndex = this.adventure_or_cruise.findIndex(activity => activity.index_id === this.selectedItemOfActivity.index_id)
      const updatedDays = this.editSelectedCityActivityType === 'Adventure' ? this.editCityDays.map((day, index) => ({
        day_order: index + 1,
        adventures: this.editDayActivities[index].map(activityID => ({
          adventure_id: activityID
        })),
        list_adventures: this.editDayActivities[index],
        day_number: ++this.day_number_start
      })) : null

      const cityData = {
        index_id: cityIndex,
        city_id: this.editCityID,
        cruise_id: this.editSelectedCityActivityType === 'Adventure' ? null : this.editDayActivity,
        type: this.editSelectedCityActivityType === 'Adventure' ? 'adventure' : 'cruise',
        number_of_days: this.editCityDayNumber,
        days: this.editSelectedCityActivityType === 'Adventure' ? updatedDays : null,
        Transportation: this.editTransportations,
        selectedDayActivities: this.editSelectedCityActivityType === 'Adventure' ? this.editDayActivities : this.editDayActivity,
        start_day: this.editSelectedCityActivityType !== 'Adventure' ? Number(this.selectedItemOfActivity.start_day) : 0,
        end_day: this.editSelectedCityActivityType !== 'Adventure' ? Number(this.selectedItemOfActivity.start_day) + Number(this.editCityDayNumber) - 1 : 0
      }

      if (cityIndex !== -1) {
        // City exists in adventure_or_cruise array (editing existing data)
        this.adventure_or_cruise.splice(cityIndex, 1, cityData)
      } else {
        // City is new (adding new data)
        this.adventure_or_cruise.push(cityData)
      }
      this.updateAdventureCruise()
      // Close the dialog
      this.dialogDetailsVisible = false
    },
    updateAdventureCruise () {
      this.day_number_start = 0
      for (let x = 0; x < this.adventure_or_cruise.length; x++) {
        if (this.adventure_or_cruise[x].type === 'adventure') {
          if (this.adventure_or_cruise[x].days) {
            for (let w = 0; w < this.adventure_or_cruise[x].days.length; w++) {
              this.adventure_or_cruise[x].days[w].day_number = ++this.day_number_start
            }
          }
        } else {
          this.adventure_or_cruise[x].start_day = ++this.day_number_start
          this.adventure_or_cruise[x].end_day = this.day_number_start + Number(this.adventure_or_cruise[x].number_of_days) - 1
          this.day_number_start = this.day_number_start + Number(this.adventure_or_cruise[x].number_of_days) - 1
        }
      }
    },
    fetchXMLData () {
      // console.log('xml')
      axios.get('https://api.tanefer.com/api/v2/packages/get-hotel')
        .then(response => {
          const xmlString = response.data
          // this.hotels =
          // this.xmlData = xmlString
          xml2js.parseString(xmlString, (err, result) => {
            if (err) {
              console.error('Error parsing XML:', err)
            } else {
              this.xmlData = result
              // console.log(result['soap:Envelope']['soap:Body'][0].HotelPortfolioResponse[0]['HotelPortfolioRS'][0]['HotelPortfolio'][0]['Hotel'])
              this.hotels = result['soap:Envelope']['soap:Body'][0].HotelPortfolioResponse[0].HotelPortfolioRS[0].HotelPortfolio[0].Hotel.map(hotel => {
                return {
                  hotelID: hotel.$.JPCode,
                  hotelName: hotel.Name[0]
                }
              })
            }
          })
        })
        .catch(error => {
          console.error('Error fetching XML data:', error)
        })
    },
    getGtaCountries () {
      this.$http.get(gtaCountries(), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.gtaCountries = response.body.data
        }
      })
    },
    getGtaCities () {
      this.$http.get(gtaCities(45), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.gtaCities = response.body.data
        }
      })
    },
    getGtaHotels (index) {
      this.$http.get(gtaHotels(this.selectedGtaCity[index]), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          // this.gtaHotels[index] = response.body.data
          this.$set(this.gtaHotels, index, response.body.data)
        }
      })
    },
    addNewHotel () {
      const numAccommodations = this.tour.accommodation.length
      if (numAccommodations > 0) {
        // const lastAccommodation = this.tour.accommodation[numAccommodations - 1]
        if (this.selectedGtaCity) {
          const newAccommodation = {
            city_id: '',
            hotels: []
          }
          this.tour.accommodation.push(newAccommodation)
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'you must select the city'
        }
      } else {
        const newAccommodation = {
          city_id: '',
          hotels: []
        }
        this.tour.accommodation.push(newAccommodation)
      }
    },
    removeHotel (hotelIndex) {
      this.tour.accommodation.splice(hotelIndex, 1)
      this.selectedGtaCity.splice(hotelIndex, 1)
      this.gtaHotels.splice(hotelIndex, 1)
    },
    addNewimage () {
      const newImage = {
        image: null,
        sort: null,
        file: null
      }
      this.images.push(newImage)
    },
    removeImage (imageIndex) {
      this.images.splice(imageIndex, 1)
    },
    loadImagesUrl (file, index) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.images[index].image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  },
  mounted () {
    if (this.$refs.mapRef) this.$refs.mapRef.$mapPromise.then(map => { this.map = map })
    // this.fetchXMLData()
    // this.getGtaCountries()
    this.getGtaCities()
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
