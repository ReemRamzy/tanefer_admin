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
        <h3 class="headline gray--text my-5">Edit Package</h3>
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
                        <v-checkbox v-model="tour.is_published" label="Published Package"></v-checkbox>
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

                        <v-simple-table dense v-if="tour.includes?.length > 0">
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

                        <v-simple-table dense v-if="tour.excludes?.length > 0">
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
                        <v-img max-width="30%" class="my-4 pa-4 text-center" :src="tour.master_image" max-height="150"></v-img>
                        <v-file-input
                        v-model="image"
                        accept="image/*"
                        label="Cover Image"
                        color="blue"
                        outlined
                        show-size
                        @change="loadMasterImage"
                        >
                        </v-file-input>
                        <v-btn @click="masterImageDialog = true; " color="primary" class="mb-4 mt-2">edit image</v-btn>
                        <v-dialog persistent max-width="1000" v-model="masterImageDialog">
                        <v-card class="pa-5">
                        <v-card class="my-4 pa-4 text-center" v-for="(imageData, index) in this.tour.images"  :key="index">
                          <v-img max-width="30%" class="text-center"  :key="index" :src="tour.load_images[index].image" max-height="150"></v-img>
                          <h1 v-bind:style="{ textAlign: 'left', fontWeight: 'Medium',padding: '1rem',fontSize: '20px' } "
                          > image {{ imageData.sort ? imageData.sort : index + 1 }} </h1>
                          <v-row>
                            <v-col cols="12" sm="9">
                           <v-file-input
                          v-model="imageData.file"
                          accept="image/*"
                          label="package Extra Images"
                          :rules="[value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!']"
                          color="blue"
                          outlined
                          show-size
                          @change="loadImagesUrl($event, index)"
                          >
                          </v-file-input>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <v-text-field
                          v-model="imageData.sort"
                          label="sort image"
                          type="number"
                          outlined
                          :rules="[v => !!v || 'Item is required', v => isUniqueSort(v), v => v > 0]"
                          min="1"
                          color="blue"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                        <v-btn @click="removeImage(index)" color="red" icon elevation="4" style="margin-bottom: -25px;">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        </v-col>
                      </v-row>
                      </v-card>
                      <v-divider></v-divider>
                      <v-btn @click="addNewimage()" color="primary" class="mb-4 mt-2">Add Image</v-btn>
                        <v-card-actions>
                          <v-btn text color="success" @click="masterImageDialog = false; updatePackageLoading = false;">Continue</v-btn>
                          <!-- <v-spacer></v-spacer>
                          <v-btn  tile color="success white--text" @click="updateImagePackage" :loading="updatePackageLoading" :disabled="!hasImages" >Update Image</v-btn> -->
                        </v-card-actions>
                        </v-card>
                        </v-dialog>
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
                            <v-btn block class="my-3" tile color="primary" @click="addProgram" :disabled="(!hotelID && dayActivities.length < 1) || !cityDayNumber">Add City Program</v-btn>
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
                              <span>{{ item.cityName }}</span>
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
                                    v-model="editTransportation.type"
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
    <p class="font-weight-bold">Package City Hotel</p>
    <div v-if="accommodations.length > 0">
      <p class="font-weight-bold">You Have Selected:</p>
      {{ recommendedHotel }}
    </div>
    <!-- Form for adding a new city and hotels -->
    <v-card class="px-7 pt-7 pb-1" style="border-radius: 15px;">
      <v-row>
                              <v-col cols="12" sm="4">
                                  <v-select
                                  v-model="packageCityPerHotel"
                                  :items="cities"
                                  item-value="CityID"
                                  item-text="CityName"
                                  color="blue"
                                  outlined
                                  label="Package City"
                                  >
                                  </v-select>
                                </v-col>
                             <v-col cols="12" md="6">
          <v-menu
            v-model="destMenu"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            max-height="300"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                ref="queryInput"
                v-model="query"
                prepend-inner-icon="mdi-map-marker"
                label="Destination"
                placeholder="Search for zones..."
                solo
                outlined
                hide-details
                v-bind="attrs"
                v-on="on"
                @input="handleInput"
              />
            </template>
            <template v-if="isloading">
              <div style="display: flex; justify-content: center; background-color: white; height: 100%;">
                <v-progress-circular indeterminate color="primary" />
              </div>
            </template>
            <v-list v-else style="overflow-y: auto; max-height: 300px;">
              <v-list-item v-for="zone in filteredZones" :key="zone.id" @click="handleZoneSelection(zone)">
                <v-list-item-content>
                  <v-list-item-title>{{ zone.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="zone.parent_name">
                    {{ zone.parent_name }}
                    <span v-if="zone.grandparent_name">, {{ zone.grandparent_name }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
        v-model="recommendedHotel"
        :items="filteredHotels"
        item-value="id"
        item-text="name"
        color="green"
        outlined
        label="Admin Recommended Hotel"
      >
            <template v-slot:prepend-item>
              <v-text-field
                v-model="searchTerm"
                append-icon="mdi-magnify"
                label="Search hotels"
                single-line
                hide-details
              ></v-text-field>
              <div v-if="isHotelsLoading" style="text-align: center; padding: 10px;">
                <v-progress-circular indeterminate color="primary" />
              </div>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-btn @click="addCityHotelEntry" color="primary" class="mb-4 mt-2">Add City and Hotels</v-btn>
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
                      :disabled="adventure_or_cruise.length === 0"
                      @click="updatePackage"
                      :loading="updatePackageLoading"
                      >
                      Update Package
                      </v-btn>
                    </v-row>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-container>
</template>

<script>
import { packageLists, slug, allPackages, activitiesByCityId, activitiesCruiseByCityId, hotelsByCityId, roomsByHotelId, removePackage, getAirports, cruisesByCity, headers, showPackage, updatePackage, gtaCountries, gtaCities, gtaHotels } from '../../links'
import _ from 'lodash'

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
      actionType: 'add',
      tour: {
        packageTitle: '',
        is_published: true,
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
        accommodation: [],
        images: [],
        load_images: [],
        master_image: null
      },
      editingTour: null,
      imageDialog: false,
      masterImageDialog: false,
      image: null,
      images: [],
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
      updatePackageLoading: false,
      listActivitiesLoading: [],
      day_number_start: 0,
      dayActivity: '',
      editDayActivity: '',
      gtaCountries: [],
      gtaCities: [],
      gtaHotels: [],
      selectedGtaCity: [],
      selectHotels: [],
      query: '',
      results: [],
      filteredZones: [],
      destMenu: false,
      isSelecting: false,
      selectedZone: null,
      perZoneHotels: [],
      isloading: false,
      searchTerm: '',
      accommodations: [], // Array to hold multiple city-hotel pairs
      selectedHotels: [],
      isHotelsLoading: false, // Flag to show loading indicator in hotels dropdown
      isHotelsAdded: false, // Flag to indicate when hotels are added
      recommendedHotel: null,
      packageCityPerHotel: ''
    }
  },
  watch: {
    gtaHotels (newValue) {
      console.log('Hotels updated:', newValue)
    }
  },
  computed: {
    hasImages () {
      return this.tour.images.length > 0
    },
    filteredHotels: {
      get () {
      // Filter `gtaHotels` based on `searchTerm`, with a check to ensure `hotel.name` exists
        if (!this.searchTerm) return this.gtaHotels
        return this.gtaHotels.filter(hotel =>
          hotel.name && hotel.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      },
      set (value) {
      // Optional setter - can log or handle unexpected assignments
        console.warn('filteredHotels was set:', value)
      }
    }
  },
  methods: {
    addCityHotelEntry () {
      if (this.selectedZone && this.selectedHotels.length > 0 && this.packageCityPerHotel) {
        this.accommodations.push({
          city: this.selectedZone,
          city_id: this.packageCityPerHotel.CityID, // Include the selected city ID
          hotels: [...this.selectedHotels], // All selected hotel IDs
          recommendedHotel: this.recommendedHotel // Admin recommended hotel
        })

        // Reset selections for the next entry
        this.selectedZone = null
        this.selectedHotels = []
        this.recommendedHotel = null
        this.packageCityPerHotel = null
        this.filteredHotels = []
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please select a city, package city, and at least one hotel before adding.'
      }
    },
    // addCityHotelEntry () {
    //   // Adds the selected city and hotels to accommodations array
    //   if (this.selectedCity && this.selectedHotels.length > 0) {
    //     this.accommodations.push({
    //       city: this.selectedCity,
    //       hotels: [...this.selectedHotels], // Copy to prevent reference issues
    //       // filteredHotels: [...this.filteredHotels] // Copy available hotels
    //       recommendedHotel: this.recommendedHotel
    //     })

    //     // Reset selections for the next entry
    //     this.selectedCity = null
    //     this.selectedHotels = []
    //     this.filteredHotels = []
    //     this.isHotelsAdded = false
    //   } else {
    //     this.snackbar = true
    //     this.color = 'error'
    //     this.text = 'Please select a city and at least one hotel before adding.'
    //   }
    // },
    handleInput: _.debounce(async function () {
      if (this.isSelecting) return

      if (this.query.length >= 3) {
        this.isloading = true
        this.destMenu = true
        await this.searchZones()
        this.isloading = false
      } else {
        this.isloading = false
        this.filteredZones = []
        this.destMenu = false
      }
    }, 300),

    // zones based on the query
    async searchZones () {
      try {
        const response = await this.$http.get('https://api.tanefer.com/api/v2/packages/search-zones', {
          params: { query: this.query }
        })
        this.filteredZones = response.data
      } catch (error) {
        console.error(error)
      }
    },

    // Handles the selection of a zone
    // handleZoneSelection (zone) {
    //   this.isSelecting = true
    //   this.selectZone(zone)

    //   if (zone.area_type === 'CTY') {
    //     this.getCityIdByJpdCode(zone.jpd_code).then((cityId) => {
    //       this.getGtaHotelsPerCity(cityId).then((hotels) => {
    //         this.gtaHotels = hotels
    //       }).catch((error) => {
    //         console.error('Error fetching hotels by city:', error)
    //       })
    //     }).catch((error) => {
    //       console.error('Error fetching city ID by jpd_code:', error)
    //     })
    //   } else if (zone.area_type === 'REG' || zone.area_type === 'LOC') {
    //     this.searchHotelsByAddress(zone.name).then((hotels) => {
    //       this.gtaHotels = hotels
    //     }).catch((error) => {
    //       console.error('Error fetching hotels by address:', error)
    //     })
    //   } else {
    //     this.getGtaHotelsPerZone(zone.id).then((hotels) => {
    //       this.gtaHotels = hotels
    //     }).catch((error) => {
    //       console.error('Error fetching hotels by zone ID:', error)
    //     })
    //   }

    //   this.$nextTick(() => {
    //     this.isSelecting = false
    //   })
    // },
    // async handleZoneSelection (zone) {
    //   // Handles selection of a zone and fetches hotels based on zone type
    //   this.isSelecting = true
    //   this.selectZone(zone)

    //   this.isHotelsLoading = true // Start loading indicator for hotels

    //   try {
    //     let hotels
    //     if (zone.area_type === 'CTY') {
    //       const cityId = await this.getCityIdByJpdCode(zone.jpd_code)
    //       hotels = await this.getGtaHotelsPerCity(cityId)
    //     } else if (zone.area_type === 'REG' || zone.area_type === 'LOC') {
    //       hotels = await this.searchHotelsByAddress(zone.name)
    //     } else {
    //       hotels = await this.getGtaHotelsPerZone(zone.id)
    //     }

    //     this.gtaHotels = hotels
    //     this.selectedCity = zone // Save selected city
    //     this.selectedHotels = this.gtaHotels.map(hotel => hotel.id)
    //     this.isHotelsAdded = true // Set flag to indicate hotels were added
    //   } catch (error) {
    //     console.error('Error fetching hotels:', error)
    //   } finally {
    //     this.isHotelsLoading = false // Stop loading indicator after fetching
    //   }

    //   this.$nextTick(() => {
    //     this.isSelecting = false
    //   })
    // },
    async handleZoneSelection (zone) {
      // Start selecting process
      this.isSelecting = true
      this.selectZone(zone) // Save selected zone

      this.isHotelsLoading = true // Start loading indicator for hotels

      try {
        let hotels = []

        // Fetch hotels based on zone type
        if (zone.area_type === 'CTY') {
          const cityId = await this.getCityIdByJpdCode(zone.jpd_code)
          hotels = await this.getGtaHotelsPerCity(cityId)
        } else if (zone.area_type === 'REG' || zone.area_type === 'LOC') {
          hotels = await this.searchHotelsByAddress(zone.name)
        } else {
          hotels = await this.getGtaHotelsPerZone(zone.id)
        }

        // Update gtaHotels with fetched hotels
        this.gtaHotels = hotels

        // Automatically select all hotels by their IDs for the selected zone
        this.selectedHotels = this.gtaHotels.map(hotel => hotel.id)

        // Set flag to indicate hotels were added
        this.isHotelsAdded = true

        // Save selected city for reference
        this.selectedCity = zone
      } catch (error) {
        console.error('Error fetching hotels:', error)
      } finally {
        // Stop loading indicator after fetching
        this.isHotelsLoading = false
      }

      this.$nextTick(() => {
        this.isSelecting = false
      })
    },

    selectZone (zone) {
      this.destMenu = false
      this.selectedZone = zone
      this.query = zone.name
    },

    async getCityIdByJpdCode (jpdCode) {
      try {
        // const response = await hotelsServices.getCityByJpdCode(jpdCode)
        const response = await this.$http.get('https://api.tanefer.com/api/v2/packages/get-city-by-jpd-code', {
          params: {
            jpd_code: jpdCode
          }
        })
        return response.data.city_id
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching city ID:', error)
      }
    },
    async getGtaHotelsPerCity (cityId) {
      try {
        const response = await this.$http.get(`https://api.tanefer.com/api/v2/packages/get-gta-hotel?city_id=${cityId}`)
        return response.data.data
      } catch (error) {
        console.error('Error fetching hotels by city ID:', error)
      }
    },

    // address fragment
    async searchHotelsByAddress (addressFragment) {
      try {
        const response = await this.$http.get('https://api.tanefer.com/api/v2/packages/search-hotels-by-address', {
          params: { address_fragment: addressFragment }
        })
        return response.data.data
      } catch (error) {
        console.error('Error fetching hotels by address:', error)
      }
    },

    // zone ID
    async getGtaHotelsPerZone (zoneId) {
      try {
        const response = await this.$http.get(`https://api.tanefer.com/api/v2/packages/get-gta-hotel?zone_id=${zoneId}`)
        return response.data.data
      } catch (error) {
        console.error('Error fetching hotels by zone ID:', error)
      }
    },
    // getTour () {
    //   this.$http.get(showPackage(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
    //     this.loading = false
    //     if (response.body.status === 200) {
    //       const dataResponse = response.body.data
    //       this.accommodations = dataResponse.package_hotel.map(hotelData => ({
    //         city: {
    //           name: hotelData.city_name || 'Unknown City', // Use 'Unknown City' if city name is null
    //           id: hotelData.city_id
    //         },
    //         hotels: hotelData.hotelIDs || [], // List of hotel IDs for this city
    //         hotelDetails: hotelData.hotels || [] // Detailed hotel information, if available
    //       }))
    //       this.tour.packageTitle = dataResponse.packageTitle
    //       if (dataResponse.is_published === 0) {
    //         this.tour.is_published = false
    //       } else {
    //         this.tour.is_published = true
    //       }
    //       if (dataResponse.isTop === '0') {
    //         this.tour.is_top = false
    //       } else {
    //         this.tour.is_top = true
    //       }
    //       const getAvailabilities = dataResponse.availabilities.map((day, index) => ({
    //         from_date: dataResponse.availabilities[index].from_date,
    //         to_date: dataResponse.availabilities[index].to_date,
    //         days: dataResponse.availabilities[index].days
    //       }))
    //       //  index_id: this.adventure_or_cruise.length + 1,
    //       const getActivities = dataResponse.activities.map((day, activityIndex) => ({
    //         index_id: activityIndex,
    //         city_id: dataResponse.activities[activityIndex].city_id,
    //         cruise_id: dataResponse.activities[activityIndex].cruise_id,
    //         type: dataResponse.activities[activityIndex].type,
    //         number_of_days: dataResponse.activities[activityIndex].days_number,
    //         days: dataResponse.activities[activityIndex].days.map((day, dayIndex) => ({
    //           day_order: dataResponse.activities[activityIndex].days[dayIndex].day_number,
    //           adventures: dataResponse.activities[activityIndex].days[dayIndex].days,
    //           // list_adventures: dataResponse.activities[activityIndex].list_adventures,
    //           list_adventures: dataResponse.activities[activityIndex].days[dayIndex].list_adventures,
    //           current_day: dataResponse.activities[activityIndex].days[dayIndex].day_number,
    //           day_number: ++this.day_number_start
    //         })),
    //         Transportation: dataResponse.activities[activityIndex].transportations.map((day, transIndex) => ({
    //           name: dataResponse.activities[activityIndex].transportations[transIndex].transportationName,
    //           min: dataResponse.activities[activityIndex].transportations[transIndex].transportationMin,
    //           max: dataResponse.activities[activityIndex].transportations[transIndex].transportationMax,
    //           price: dataResponse.activities[activityIndex].transportations[transIndex].transportationPrice
    //         })),
    //         cityName: dataResponse.activities[activityIndex].cityname,
    //         cruise_name: dataResponse.activities[activityIndex].cruisename,
    //         selectedDayActivities: dataResponse.activities[activityIndex].type === 'adventure' ? [] : dataResponse.activities[activityIndex].cruise_id,
    //         start_day: dataResponse.activities[activityIndex].type !== 'adventure' ? Number(this.total_number_of_days) + 1 : 0,
    //         end_day: dataResponse.activities[activityIndex].type !== 'adventure' ? Number(this.total_number_of_days) + Number(dataResponse.activities[activityIndex].days_number) : 0
    //       }))

    //       this.total_number_of_days = 0

    //       for (let index = 0; index < getActivities.length; index++) {
    //         const element = getActivities[index]
    //         element.start_day = element.type !== 'adventure' ? Number(this.total_number_of_days) + 1 : 0
    //         element.end_day = element.type !== 'adventure' ? Number(this.total_number_of_days) + Number(element.number_of_days) : 0
    //         this.total_number_of_days += Number(element.number_of_days)
    //         for (let index1 = 0; index1 < element.days.length; index1++) {
    //           const element1 = element.days[index1]
    //           element1.day_number = ++this.day_number_start
    //         }
    //       }

    //       for (let index = 0; index < dataResponse.package_hotel.length; index++) {
    //         this.selectedGtaCity.push(dataResponse.package_hotel[index].city_id)
    //         this.selectHotels.push(dataResponse.package_hotel[index].hotelIDs)
    //         this.gtaHotels.push(dataResponse.package_hotel[index].hotels)
    //       }

    //       const getListHotelsGta = dataResponse.package_hotel.map((city, index) => ({
    //         city_id: '',
    //         hotels: []
    //       }))

    //       this.tour.rank = dataResponse.rank
    //       this.tour.packageOverview = dataResponse.packageOverview
    //       this.tour.packageDuration = dataResponse.packageDuration
    //       this.tour.packageNightsNumber = dataResponse.packageNightsNumber
    //       this.tour.additionalCost = dataResponse.additionalprice
    //       this.tour.discountPercent = dataResponse.discountprecentage
    //       this.tour.availabilities = getAvailabilities
    //       this.tour.includes = dataResponse.packageIncludes
    //       this.tour.excludes = dataResponse.packageExcludes
    //       this.tour.slug = dataResponse.packageSlug
    //       this.tour.image_alt = dataResponse.packageImageAlt
    //       this.tour.image_caption = dataResponse.packageImageCaption
    //       this.tour.packageMetaTitle = dataResponse.packageMetaTitle
    //       this.tour.packageMetaDesc = dataResponse.packageMetaDesc
    //       this.adventure_or_cruise = getActivities
    //       this.tour.accommodation = getListHotelsGta
    //       this.tour.images = dataResponse.packageImages
    //       this.tour.load_images = dataResponse.packageImages
    //       this.tour.master_image = dataResponse.packageImage
    //       this.updateAdventureCruise()
    //       this.calcTotalNumberOfDays()
    //     }
    //   }, () => {
    //     this.loading = false
    //   })
    // },
    getTour () {
      this.$http.get(showPackage(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.body.status === 200) {
          const dataResponse = response.body.data

          // Map `package_hotel` data to `accommodations` with preselected hotels
          this.accommodations = dataResponse.package_hotel.map(hotelData => ({
            city: {
              name: hotelData.city_name || 'Unknown City', // Use 'Unknown City' if city name is null
              id: hotelData.city_id
            },
            hotels: hotelData.hotelIDs || [], // List of hotel IDs for this city
            hotelDetails: hotelData.hotels || [] // Detailed hotel information, if available
          }))

          // Map other tour-related data
          this.tour.packageTitle = dataResponse.packageTitle
          this.tour.packageOverview = dataResponse.packageOverview
          this.tour.packageDuration = dataResponse.packageDuration
          this.tour.packageNightsNumber = dataResponse.packageNightsNumber
          this.tour.additionalCost = dataResponse.additionalprice
          this.tour.discountPercent = dataResponse.discountprecentage
          this.tour.availabilities = dataResponse.availabilities.map((day, index) => ({
            from_date: day.from_date,
            to_date: day.to_date,
            days: day.days
          }))
          this.tour.includes = dataResponse.packageIncludes
          this.tour.excludes = dataResponse.packageExcludes
          this.tour.slug = dataResponse.packageSlug
          this.tour.image_alt = dataResponse.packageImageAlt
          this.tour.image_caption = dataResponse.packageImageCaption
          this.tour.packageMetaTitle = dataResponse.packageMetaTitle
          this.tour.packageMetaDesc = dataResponse.packageMetaDesc
          this.tour.rank = dataResponse.rank
          this.tour.images = dataResponse.packageImages
          this.tour.master_image = dataResponse.packageImage
          this.tour.is_published = dataResponse.is_published === 1
          this.tour.is_top = dataResponse.isTop === '1'

          // Map `activities` to `adventure_or_cruise`
          this.adventure_or_cruise = dataResponse.activities.map((activity, activityIndex) => ({
            index_id: activityIndex,
            city_id: activity.city_id,
            cruise_id: activity.cruise_id,
            type: activity.type,
            number_of_days: activity.days_number,
            days: activity.days.map((day, dayIndex) => ({
              day_order: day.day_number,
              adventures: day.adventures || [],
              list_adventures: day.list_adventures || [],
              current_day: day.day_number,
              day_number: ++this.day_number_start
            })),
            Transportation: activity.transportations.map(transport => ({
              name: transport.transportationName,
              min: transport.transportationMin,
              max: transport.transportationMax,
              price: transport.transportationPrice
            })),
            cityName: activity.cityname,
            cruise_name: activity.cruisename,
            selectedDayActivities: activity.type === 'adventure' ? [] : activity.cruise_id,
            start_day: activity.type !== 'adventure' ? Number(this.total_number_of_days) + 1 : 0,
            end_day: activity.type !== 'adventure' ? Number(this.total_number_of_days) + Number(activity.days_number) : 0
          }))

          // Calculate total number of days
          this.total_number_of_days = 0
          this.adventure_or_cruise.forEach(element => {
            element.start_day = element.type !== 'adventure' ? Number(this.total_number_of_days) + 1 : 0
            element.end_day = element.type !== 'adventure' ? Number(this.total_number_of_days) + Number(element.number_of_days) : 0
            this.total_number_of_days += Number(element.number_of_days)

            element.days.forEach(day => {
              day.day_number = ++this.day_number_start
            })
          })

          this.updateAdventureCruise()
          this.calcTotalNumberOfDays()
        }
      }, () => {
        this.loading = false
      })
    },
    validateImage (value) {
      if (!value) return 'Cover Image is required!'
      if (value.size >= 5000000) return 'Cover Image size should be less than 5 MB!'
      return true
    },
    clearImageOnRemove (file) {
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
    getDayNumberByOrderList (day) {
      return ++this.day_number_start
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
    getListActivitiesByCity (cityID) {
      return new Promise((resolve, reject) => {
        this.$http.get(activitiesByCityId(cityID), { headers: headers(this.$cookies.get('userToken')) })
          .then(response => {
            if (response.body.status === 200) {
              resolve(response.body.data) // Resolve with the fetched data
            } else {
              reject(new Error('Failed to fetch activities')) // Reject with an error
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    async getListActivitiesByCityFetch (cityID) {
      try {
        const activities = await this.getListActivitiesByCity(cityID)
        this.listActivitiesLoading = activities // Process fetched activities
      } catch (error) {
        console.error(error) // Handle errors
      }
    },
    getActivitiesByCityId (activity) {
      this.$http.get(activitiesByCityId(activity.city_id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.activities = response.body.data
          this.listActivitiesLoading = response.body.data
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
      this.transportation = {
        name: '',
        min: '',
        max: '',
        price: ''
      }
    },
    EditTransportation () {
      this.editTransportations.push(this.editTransportation)
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
      this.day_number_start = this.total_number_of_days
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
          cruise_id: this.selectedCityActivityType === 'Adventure' ? null : null,
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
    checkSlug (value) {
      this.$http.get(slug(value), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        console.log(response.data.availability)
        if (!response.data.availability) {
          this.slugErrors = 'This slug is taken! Use instead: '
          this.slugAlt = response.data.alternative
        }
      }).catch(error => {
        console.log(error)
      }).finally()
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
      const city = this.cities.find((city) => city.CityID === Number(item.city_id))
      if (city) {
        this.selectedCity = city
        this.editCityID = item.city_id
        this.editCityDayNumber = item.number_of_days
        this.editSelectedCityActivityType = item.type === 'adventure' ? 'Adventure' : 'Nile Cruise'
        this.editTransportations = item.Transportation
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
    },
    saveData () {
      this.day_number_start = 0
      const cityIndex = this.adventure_or_cruise.findIndex(activity => activity.index_id === this.selectedItemOfActivity.index_id)
      var updatedDays = null
      if (this.editSelectedCityActivityType === 'Adventure') {
        // updatedDays = this.editCityDays.map((day, index) => ({
        //   day_order: index + 1,
        //   adventures: this.editDayActivities[index].map(activityID => ({
        //     adventure_id: activityID
        //   })),
        //   list_adventures: this.editDayActivities[index],
        //   day_number: ++this.day_number_start
        // }))
        updatedDays = this.editCityDays.map((day, index) => {
          const dayActivities = this.editDayActivities[index]

          return {
            day_order: index + 1,
            adventures: dayActivities.filter(activityID => Number.isInteger(activityID)).map(activityID => ({
              adventure_id: activityID
            })),
            list_adventures: dayActivities.filter(activityID => Number.isInteger(activityID)),
            day_number: ++this.day_number_start
          }
        })
      } else {
        updatedDays = null
      }
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
    updatePackage () {
      console.log(this.accommodations)
      this.updatePackageLoading = true
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('package_title', this.tour.packageTitle)
      formData.append('is_published', this.tour.is_published ? 1 : 0)
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
      if (this.tour.is_top) formData.append('is_top', this.tour.is_top ? 1 : 0)
      if (this.tour.rank) formData.append('rank', this.tour.rank)

      for (let i = 0; i < this.tour.availabilities.length; i++) {
        formData.append('availabilties[' + i + '][from_date]', this.tour.availabilities[i].from_date)
        formData.append('availabilties[' + i + '][to_date]', this.tour.availabilities[i].to_date)
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
        if (this.adventure_or_cruise[x].cruise_id > 0) {
          formData.append('activities[' + x + '][cruise_id]', this.adventure_or_cruise[x].cruise_id)
        }
        formData.append('activities[' + x + '][type]', this.adventure_or_cruise[x].type)
        formData.append('activities[' + x + '][days_number]', this.adventure_or_cruise[x].number_of_days)
        if (this.adventure_or_cruise[x].days) {
          for (let w = 0; w < this.adventure_or_cruise[x].days.length; w++) {
            formData.append('activities[' + x + '][days][' + w + '][day_number]', this.adventure_or_cruise[x].days[w].day_order)
            if (this.adventure_or_cruise[x].days[w].adventures) {
              for (let m = 0; m < this.adventure_or_cruise[x].days[w].adventures.length; m++) {
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
        }
      }

      if (this.image) formData.append('cover_image', this.image, this.image.name)
      // for (let i = 0; i < this.images.length; i++) {
      //   formData.append('images[' + i + ']', this.images[i], this.images[i].name)
      // }
      this.tour.images.forEach((imageData, index) => {
        formData.append(`images[${index}][id]`, imageData.id ? imageData.id : null)
        formData.append(`images[${index}][file]`, imageData.file ? imageData.file : null)
        formData.append(`images[${index}][sort]`, imageData.sort ? imageData.sort : index + 1)
      })

      // cruiseID
      if (this.cruiseID) formData.append('cruise_id', this.cruiseID)

      // if (this.tour.accommodation) {
      //   for (let a = 0; a < this.tour.accommodation.length; a++) {
      //     formData.append('accommodation[' + a + '][city_id]', this.tour.accommodation[a].city_id || '') // city_id

      //     if (this.tour.accommodation[a].hotels && this.tour.accommodation[a].hotels.length > 0) {
      //       for (let h = 0; h < this.tour.accommodation[a].hotels.length; h++) {
      //         formData.append('accommodation[' + a + '][hotels][' + h + '][hotel_id]', this.tour.accommodation[a].hotels[h]) // Append hotel_id
      //       }
      //     } else {
      //       formData.append('accommodation[' + a + '][hotels]', [])
      //     }
      //   }
      // }

      if (this.accommodations && this.accommodations.length > 0) {
        for (let a = 0; a < this.accommodations.length; a++) {
          const accommodation = this.accommodations[a]

          // Append the associated city ID
          formData.append(`accommodation[${a}][city_id]`, accommodation.city_id || '')

          // Add the recommended hotel for each accommodation entry
          formData.append(`accommodation[${a}][recommended_hotel]`, accommodation.recommendedHotel || '')

          // Add all selected hotel IDs as a flat array of values
          if (accommodation.hotels && accommodation.hotels.length > 0) {
            accommodation.hotels.forEach(hotelId => {
              formData.append(`accommodation[${a}][hotels][]`, hotelId)
            })
          } else {
            formData.append(`accommodation[${a}][hotels]`, [])
          }
        }
      }

      this.$http.post(updatePackage(this.$route.params.id), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.updatePackageLoading = false
        if (response.body.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Package data was updated successfully'
          this.basicDialog = false
          this.loading = true
          this.imageDialog = false
          this.masterImageDialog = false
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
    },
    updateImagePackage () {
      this.updatePackageLoading = true
      const formData = new FormData()
      this.tour.images.forEach((imageData, index) => {
        formData.append(`images[id][${index}]`, imageData.id ? imageData.id : null)
        formData.append(`images[file][${index}]`, imageData.file ? imageData.file : null)
        formData.append(`images[sort][${index}]`, imageData.sort ? imageData.sort : index + 1)
      })
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
          this.$set(this.gtaHotels, index, response.body.data)
        }
      })
    },
    // addNewHotel () {
    //   const numAccommodations = this.tour.accommodation.length
    //   if (numAccommodations > 0) {
    //     if (this.selectedGtaCity) {
    //       const newAccommodation = {
    //         city_id: '',
    //         hotels: []
    //       }
    //       this.tour.accommodation.push(newAccommodation)
    //     } else {
    //       this.snackbar = true
    //       this.color = 'error'
    //       this.text = 'you must select the city'
    //     }
    //   } else {
    //     const newAccommodation = {
    //       city_id: '',
    //       hotels: []
    //     }
    //     this.tour.accommodation.push(newAccommodation)
    //   }
    // },
    addNewHotel () {
      const numAccommodations = this.tour.accommodation.length

      // Check if accommodations already exist
      if (numAccommodations > 0) {
        if (this.selectedZone) {
          const newAccommodation = {
            city_id: this.selectedZone.id || '', // Use the selected zone's ID as city_id
            hotels: this.selectHotels && this.selectHotels.length ? this.selectHotels : [] // Include selected hotels
          }
          this.tour.accommodation.push(newAccommodation)
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = 'You must select a destination'
        }
      } else {
        const newAccommodation = {
          city_id: this.selectedZone ? this.selectedZone.id : '', // Fallback if no zone is selected
          hotels: this.selectHotels && this.selectHotels.length ? this.selectHotels : [] // Include selected hotels
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
      this.tour.images.push({
        image: null,
        file: null,
        sort: null
      })
    },
    removeImage (imageIndex) {
      this.tour.images.splice(imageIndex, 1)
    },
    isUniqueSort (value) {
      if (value === null || value === undefined) {
        return 'Sort value is required'
      }
      const sortValues = this.images.map(image => image.sort).filter(sort => sort !== null && sort !== undefined)
      return sortValues.filter(sort => sort === value).length <= 1 || 'Sort value must be unique'
    },
    loadMasterImage (file) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.tour.master_image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    loadImagesUrl (file, index) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.tour.load_images[index].image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  },
  mounted () {
    this.getGtaCities()
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
