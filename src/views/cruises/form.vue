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
      <h3 class="headline gray--text my-5">Add Cruise</h3>
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
                  Cruise Details
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
              step="3"
              >
                  Cruise Rooms
              </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
              <v-stepper-content step="1">
                  <v-form ref="basicForm" v-model="basicFormValid">
                    <v-text-field
                    label="Cruise Name"
                    v-model="cruise.name"
                    type="text"
                    outlined
                    class="mt-3"
                    :rules="[v => !!v || 'item is required']"
                    color="blue"
                    >
                    </v-text-field>
                    <v-text-field
                    v-model="cruise.sort"
                    label="sort cruise"
                    type="number"
                    outlined
                    :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                    color="blue"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Cruise Line"
                    v-model="cruise.cruise_line"
                    type="text"
                    outlined
                    :rules="[v => !!v || 'item is required']"
                    color="blue"
                    >
                    </v-text-field>
                    <v-text-field
                      label="SEO Title"
                      v-model="cruise.seo_title"
                      type="text"
                      outlined
                      class="mt-3"
                      color="blue"
                    >
                    </v-text-field>
                    <v-text-field
                      label="SEO Description"
                      v-model="cruise.seo_description"
                      type="text"
                      outlined
                      class="mt-3"
                      color="blue"
                    >
                    </v-text-field>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                        label="Cruise Ship"
                        v-model="cruise.ship_name"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'item is required']"
                        color="blue"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-text-field
                        label="Cruise Stars"
                        outlined
                        v-model="cruise.stars"
                        type="number"
                        :rules="[v => !!v || 'item is required', v => v.length === 1 || 'Stars must be between 0 and 5', v => /^[0-5]*$/.test(v) || 'Stars must be between 0 and 5']"
                        color="blue"
                        max="5"
                        min="0"
                        class="mx-1"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-text-field
                        label="Nights Number"
                        outlined
                        class="mx-1"
                        v-model="cruise.number_of_nights"
                        min="1"
                        type="number"
                        :rules="[v => !!v || 'Nights number is required']"
                        color="blue"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- start days -->
                    <v-select
                    v-model="cruise.start_days"
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
                    <v-select
                    v-model="cruise.start_city_id"
                    :items="cities"
                    item-value="CityID"
                    item-text="CityName"
                    color="blue"
                    outlined
                    label="Cruise Start City"
                    :rules="[v => !!v || 'city is required']"
                    >
                    </v-select>
                    <v-select
                    v-model="cruise.cities_ids"
                    :items="cities"
                    item-value="CityID"
                    item-text="CityName"
                    color="blue"
                    outlined
                    multiple
                    label="Cruise Cities"
                    :rules="[v => !!v || 'city is required']"
                    >
                    </v-select>
                    <v-divider></v-divider>
                    <v-file-input
                    v-model="cruise.master_image"
                    accept="image/*"
                    label="Cruise Image"
                    :rules="[v => !!v || 'Please insert a photo', value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!']"
                    color="blue"
                    outlined
                    show-size
                    >
                    </v-file-input>
                    <!-- api-key="k73spamkrjccv5w3e5c9f2oa0h5hm3ncwotken8jtkfq2il4" -->
                    <editor
                    v-model="cruise.description"
                    api-key="x21puj7j5tdxkuct1ma1pa63pwru6yf0skeh4huvvgxv4f5x"
                    :init="{
                      placeholder: 'Cruise Description',
                      height: 300,
                      menubar: false,
                      plugins: [
                      'advlist autolink lists link anchor',
                      'insertdatetime table paste'
                      ],
                      toolbar:
                      'undo redo | formatselect | bold italic | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat'
                    }"
                    />
                  </v-form>
                  <v-divider class="my-3"></v-divider>
                  <v-btn
                  color="primary"
                  @click="step = 2"
                  class="my-3"
                  :disabled="!basicFormValid || cruise.description === ''"
                  >
                  Continue To Details
                  </v-btn>

              </v-stepper-content>

              <v-stepper-content step="2">
                  <v-form ref="detailsForm" v-model="detailsFormValid">
                      <p class="body-1 gray">Cruise Faciliteis</p>

                      <v-text-field
                      placeholder="Add Facility"
                      v-model="facility"
                      outlined
                      append-icon="mdi-plus-circle"
                      @keypress:enter="addFacility"
                      @click:append="addFacility"
                      >
                      </v-text-field>

                      <v-divider></v-divider>

                      <v-simple-table dense v-if="cruise.facilities.length">
                          <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Facility
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr
                              v-for="(item, i) in cruise.facilities"
                              :key="i"
                              >
                                  <td>{{ item }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="cruise.facilities.splice(i, 1)">
                                      <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                          </template>
                      </v-simple-table>

                      <p class="body-1 mt-3 gray">Cruise Policies</p>

                      <v-text-field
                      placeholder="Add Policy"
                      v-model="policy"
                      outlined
                      append-icon="mdi-plus-circle"
                      @click:append="addPolicy"
                      >
                      </v-text-field>

                      <v-divider></v-divider>

                      <v-simple-table dense v-if="cruise.policies.length">
                          <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Policy
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr
                              v-for="(item, i) in cruise.policies"
                              :key="i"
                              >
                                  <td>{{ item }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="cruise.policies.splice(i, 1)">
                                      <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                          </template>
                      </v-simple-table>

                      <p class="body-1 mt-3 gray">Cruise Includes</p>

                      <v-text-field
                      placeholder="Add Inclusion"
                      v-model="inclusion"
                      outlined
                      append-icon="mdi-plus-circle"
                      @click:append="addInclusion"
                      >
                      </v-text-field>

                      <v-divider></v-divider>

                      <v-simple-table dense v-if="cruise.includes.length">
                          <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Inclusion
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr
                              v-for="(item, i) in cruise.includes"
                              :key="i"
                              >
                                  <td>{{ item }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="cruise.includes.splice(i, 1)">
                                      <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                          </template>
                      </v-simple-table>

                      <p class="body-1 mt-3 gray">Cruise Excludes</p>

                      <v-text-field
                      placeholder="Add Exclusion"
                      v-model="exclusion"
                      outlined
                      append-icon="mdi-plus-circle"
                      @click:append="addExclusion"
                      >
                      </v-text-field>

                      <v-divider></v-divider>

                      <v-simple-table dense v-if="cruise.excludes.length">
                          <template v-slot:default>
                          <thead>
                              <tr>
                                  <th class="text-left">
                                      Exclusion
                                  </th>
                                  <th class="text-right">
                                      Remove
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr
                              v-for="(item, i) in cruise.excludes"
                              :key="i"
                              >
                                  <td>{{ item }}</td>
                                  <td class="text-right">
                                      <v-btn icon color="error" large @click="cruise.excludes.splice(i, 1)">
                                      <v-icon>mdi-trash-can</v-icon>
                                      </v-btn>
                                  </td>
                              </tr>
                          </tbody>
                          </template>
                      </v-simple-table>
                          <!-- add image form -->
                      <v-card class="my-4 pa-4 text-center" v-for="(imageData, index) in cruise.images"  :key="index">
                        <h1 v-bind:style="{ textAlign: 'left', fontWeight: 'Medium', padding: '1rem', fontSize: '20px' }"
                        > image{{ imageData.sort }} </h1>
                        <v-row>
                          <v-col cols="12" sm="9">
                         <v-file-input
                        v-model="imageData.image"
                        accept="image/*"
                        label="Cruise Image"
                        :rules="[v => !!v || 'Please insert a photo', value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!']"
                        color="blue"
                        outlined
                        show-size
                        >
                        </v-file-input>
                      </v-col>
                      <v-col cols="12" sm="3">
                        <v-text-field
                        v-model="imageData.sort"
                        label="sort image"
                        type="number"
                        outlined
                        :rules="[v => !!v || 'item is required', v => v.length === 1 ]"
                        color="blue"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                      <v-btn @click="removeImage(index)" color="red">Remove Image</v-btn>
                    </v-card>
                    <v-divider></v-divider>
                    <v-btn @click="addNewimage()" color="primary" class="mb-4 mt-2">Add Image</v-btn>
                  </v-form>
                  <v-divider class="my-3"></v-divider>
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
                      :disabled="cruise.facilities.length < 1 || cruise.policies.length < 1"
                      >
                      Continue To Rooms
                      </v-btn>

                  </v-row>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-form ref="roomsForm" v-model="roomsFormValid">
                  <p class="body-1 gray--tex">Add Room</p>
                  <v-text-field
                  label="Room View"
                  v-model="room.type"
                  outlined
                  :rules="[v => !!v || 'Type is required!']"
                  color="blue"
                  >
                  </v-text-field>
                  <v-select
                  v-model="room.occupancy"
                  :items="['Solo','Single', 'Double','Triple','SGL','DBL']"
                  color="blue"
                  outlined
                  label="Room Occupancy"
                  :rules="[v => !!v || 'Room occupancy is required']"
                  >
                  </v-select>

                  <p class="body-1 mt-3 gray">Room Inclusions</p>

                  <v-text-field
                  placeholder="Add Inclusion"
                  v-model="room_inclusion"
                  outlined
                  append-icon="mdi-plus-circle"
                  @click:append="addRoomInclusions"
                  >
                  </v-text-field>

                  <v-divider></v-divider>

                  <v-simple-table dense v-if="room.inclusions.length > 0">
                      <template v-slot:default>
                      <thead>
                          <tr>
                              <th class="text-left">
                                  Inclusion
                              </th>
                              <th class="text-right">
                                  Remove
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr
                          v-for="(item, i) in room.inclusions"
                          :key="i"
                          >
                              <td>{{ item }}</td>
                              <td class="text-right">
                                  <v-btn icon color="error" large @click="room.inclusions.splice(i, 1)">
                                  <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                      </template>
                  </v-simple-table>
                  <v-divider></v-divider>
                  <p class="body-1 mt-3 gray">Room Aminities</p>

                  <v-text-field
                  placeholder="Add Aminities"
                  v-model="room_aminity"
                  outlined
                  append-icon="mdi-plus-circle"
                  @click:append="addRoomAminities"
                  >
                  </v-text-field>

                  <v-divider></v-divider>

                  <v-simple-table dense v-if="room.amenities.length > 0">
                      <template v-slot:default>
                      <thead>
                          <tr>
                              <th class="text-left">
                                  Aminity
                              </th>
                              <th class="text-right">
                                  Remove
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr
                          v-for="(item, i) in room.amenities"
                          :key="i"
                          >
                              <td>{{ item }}</td>
                              <td class="text-right">
                                  <v-btn icon color="error" large @click="room.amenities.splice(i, 1)">
                                  <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                      </template>
                  </v-simple-table>
                  <v-divider class="mb-3"></v-divider>

                  <p class="body-1 mt-3 gray">Room Categories</p>

                  <v-text-field
                  placeholder="Add Category"
                  v-model="room_category"
                  outlined
                  append-icon="mdi-plus-circle"
                  @click:append="addRoomCategories"
                  >
                  </v-text-field>

                  <v-divider></v-divider>

                  <v-simple-table dense v-if="room.categories.length > 0">
                      <template v-slot:default>
                      <thead>
                          <tr>
                              <th class="text-left">
                                  Category
                              </th>
                              <th class="text-right">
                                  Remove
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr
                          v-for="(item, i) in room.categories"
                          :key="i"
                          >
                              <td>{{ item }}</td>
                              <td class="text-right">
                                  <v-btn icon color="error" large @click="room.categories.splice(i, 1)">
                                  <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                      </template>
                  </v-simple-table>
                  <v-divider class="mb-3"></v-divider>

                  <v-row justify="space-around" class="px-3">
                      <!-- <v-text-field
                      label="Room Rate Per Night"
                      outlined
                      class="inputNumber mx-1"
                      v-model="room.price_per_day"
                      type="number"
                      :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                      >
                      </v-text-field> -->
                      <v-text-field
                      label="Room Max Adult Number"
                      outlined
                      v-model="room.max_num_adult"
                      type="number"
                      :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                      color="blue"
                      class="mx-1"
                      >
                      </v-text-field>
                      <v-text-field
                      label="Room Max Children Number"
                      outlined
                      v-model="room.max_num_children"
                      type="number"
                      :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                      color="blue"
                      class="mx-1"
                      >
                      </v-text-field>
                  </v-row>

                  <v-row justify="space-around">
                    <table id="" class="text-center">
                      <tbody>
                        <tr v-for="(childtiers, tierIndex) in room.childrentiers" :key="tierIndex">
                          <td>
                            <v-text-field v-model="childtiers.min" label="Min" outlined class="inputNumber mx-1" type="number" color="blue">
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="childtiers.max" label="Max" outlined class="inputNumber mx-1" type="number" color="blue">
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="childtiers.percentage" label="Percentage" outlined class="inputNumber mx-1" type="number" color="blue" prefix="%" :rules="minMaxRules">
                            </v-text-field>
                          </td>
                          <td>
                            <v-btn @click="removeChildrenTier(tierIndex)" color="red" icon elevation="4" style="margin-top: -35px;">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <v-btn @click="addNewChildrentier()" color="primary" class="mr-4">Add New Childrentier</v-btn>
                  </v-row>

                  <v-row justify="space-around">
                    <v-col cols="12" md="5">
                      <v-select
                      v-model="roomSeason.id"
                      :items="seasons"
                      item-value="seasonID"
                      color="blue"
                      outlined
                      label="Room Season"
                      >
                        <template v-slot:item="{ item }">
                          <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="item.seasonStartDate" :date="item.seasonStartDate" />
                          <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="item.seasonEndDate" :date="item.seasonEndDate" />
                        </template>
                        <template v-slot:selection="{ item }">
                          <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="item.seasonStartDate" :date="item.seasonStartDate" />
                          <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="item.seasonEndDate" :date="item.seasonEndDate" />
                        </template>
                      </v-select>
                    </v-col>

                    <v-col cols="12" md="5">
                      <v-text-field
                      label="Room season price Per person"
                      outlined
                      class="inputNumber"
                      v-model="roomSeason.price_per_person"
                      type="number"
                      :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                      color="blue"
                      prefix="$"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                      <v-btn height="56" elevation="0" dark :disabled="!(roomSeason.id && roomSeason.price_per_person)" tile small color="blue"
                      @click="addRoomSeason"
                      >
                      add season</v-btn>
                    </v-col>
                  </v-row>
                  <v-simple-table dense v-if="room.seasons.length > 0">
                    <template v-slot:default>
                    <thead>
                        <tr>
                          <th class="text-left">
                            Room Season
                          </th>
                          <th class="text-left">
                            Season Price Per Person
                          </th>
                          <th class="text-right">
                            Remove
                          </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item, i) in room.seasons"
                        :key="i"
                        >
                          <td>
                            <span v-for="season in seasons" :key="season.seasonID">
                              <span v-if="item.id === season.seasonID">
                                <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="season.seasonStartDate" :date="season.seasonStartDate" />
                                <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="season.seasonEndDate" :date="season.seasonEndDate" />
                              </span>
                            </span>
                          </td>
                          <td>$ {{ item.price_per_person }}</td>
                          <td class="text-right">
                              <v-btn icon color="error" large @click="room.seasons.splice(i, 1)">
                              <v-icon>mdi-trash-can</v-icon>
                              </v-btn>
                          </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                  <v-btn color="success" class="mt-5" :disabled="!roomsFormValid || room.amenities.length < 1 || room.inclusions.length < 1" @click="addRoom">Add Room</v-btn>
                </v-form>
                  <v-divider class="my-5"></v-divider>
                  <v-simple-table dense v-if="cruise.rooms.length">
                      <template v-slot:default>
                      <thead>
                          <tr>
                            <th class="text-left">
                              Room View
                            </th>
                            <th class="text-left">
                              Room Occupancy
                            </th>
                            <th class="text-left">
                              Room Inclusions
                            </th>
                            <th class="text-left">
                              Room Amenities
                            </th>
                            <th class="text-left">
                              Room Categories
                            </th>
                            <th class="text-left">
                              Room Max Adults Num
                            </th>
                            <th class="text-left">
                              Room Max Children Num
                            </th>
                            <!-- <th class="text-left">
                              Room Rate Per Night
                            </th> -->
                            <!-- <th class="text-left">
                              Room Season
                            </th> -->
                            <th class="text-right">
                              Remove
                            </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr
                          v-for="(item, i) in cruise.rooms"
                          :key="i"
                          >
                              <td>{{ item.type }}</td>
                              <td>{{ item.occupancy }}</td>
                              <td><span v-for="(element, x) in item.inclusions" :key="x">{{ element }} , </span></td>
                              <td><span v-for="(element, x) in item.amenities" :key="x">{{ element }} , </span></td>
                              <td><span v-for="(element, x) in item.categories" :key="x">{{ element }} , </span></td>
                              <td>{{ item.max_num_adult }}</td>
                              <td>{{ item.max_num_children }}</td>
                              <!-- <td>{{ item.price_per_day }}</td> -->
                              <!-- <td>
                                <span v-for="season in seasons" :key="season.seasonID">
                                  <span v-if="item.season_id === season.seasonID">
                                    <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="season.seasonStartDate" :date="season.seasonStartDate" />
                                    <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="season.seasonEndDate" :date="season.seasonEndDate" />
                                  </span>
                                </span>
                              </td> -->
                              <td class="text-right">
                                  <v-btn icon color="error" large @click="cruise.rooms.splice(i, 1)">
                                  <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                      </template>
                  </v-simple-table>

                  <v-divider class="my-3"></v-divider>

                  <v-row>

                    <v-btn
                    color="warning"
                    text
                    @click="step = 2"
                    class="ml-5 my-3"
                    :disabled="addCruiseLoading"
                    >
                    Back To Details
                    </v-btn>

                    <v-spacer></v-spacer>

                    <v-btn
                    class="mr-5 my-3"
                    color="primary"
                    :disabled="cruise.rooms < 1"
                    @click="addCruise"
                    :loading="addCruiseLoading"
                    >
                    Add Cruise
                    </v-btn>

                  </v-row>
              </v-stepper-content>
          </v-stepper-items>
      </v-stepper>
  </v-container>
</template>

<script>
import { headers, storeCruise, formLists } from '../../links'
import Editor from '@tinymce/tinymce-vue'
import dateDisplay from '../../components/dateDisplay'

export default {
  components: {
    editor: Editor,
    dateDisplay
  },
  data () {
    return {
      minMaxRules: [
        v => !!v || 'This field is required',
        v => (v && v >= 0) || 'should be equal 0 or more',
        v => (v && v <= 100) || 'should be equal 100 or less'
      ],
      snackbar: false,
      color: '',
      text: '',
      step: 1,
      basicFormValid: true,
      detailsFormValid: true,
      roomsFormValid: true,
      cruise: {
        name: '',
        cruise_line: '',
        ship_name: '',
        facilities: [],
        includes: [],
        excludes: [],
        description: '',
        policies: [],
        stars: '0',
        start_city_id: '',
        cities_ids: [],
        start_days: [],
        master_image: null,
        city_id: null,
        number_of_nights: 1,
        images: [],
        sort: [],
        rooms: [],
        seo_title: '',
        seo_description: ''
      },
      room: {
        type: '',
        occupancy: 'single',
        inclusions: [],
        amenities: [],
        categories: [],
        max_num_adult: null,
        max_num_children: null,
        childrentiers: [
          {
            min: '',
            max: '',
            percentage: ''
          }
        ],
        seasons: []
      },
      roomSeason: {
        id: null,
        price_per_person: ''
      },
      facility: '',
      policy: '',
      inclusion: '',
      exclusion: '',
      room_inclusion: '',
      room_aminity: '',
      room_category: '',
      cities: [],
      seasons: [],
      addCruiseLoading: false
    }
  },
  methods: {
    addFacility () {
      if (this.facility) {
        this.cruise.facilities.push(this.facility)
        this.facility = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a facility before submitting'
      }
    },
    addPolicy () {
      if (this.policy) {
        this.cruise.policies.push(this.policy)
        this.policy = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a policye before submitting'
      }
    },
    addInclusion () {
      if (this.inclusion) {
        this.cruise.includes.push(this.inclusion)
        this.inclusion = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
      }
    },
    addExclusion () {
      if (this.exclusion) {
        this.cruise.excludes.push(this.exclusion)
        this.exclusion = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide excludes before submitting'
      }
    },
    addRoomInclusions () {
      if (this.room_inclusion) {
        this.room.inclusions.push(this.room_inclusion)
        this.room_inclusion = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide inclusions before submitting'
      }
    },
    addRoomAminities () {
      if (this.room_aminity) {
        this.room.amenities.push(this.room_aminity)
        this.room_aminity = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide aminities before submitting'
      }
    },
    addRoomCategories () {
      if (this.room_category) {
        this.room.categories.push(this.room_category)
        this.room_category = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide Categories before submitting'
      }
    },
    addRoomSeason () {
      this.room.seasons.push(this.roomSeason)
      this.roomSeason = {
        id: null,
        price_per_person: ''
      }
    },
    addRoom () {
      this.$refs.roomsForm.validate()
      if (this.roomsFormValid) {
        const room = this.room
        this.cruise.rooms.push(room)
        this.room = {
          type: '',
          inclusions: [],
          amenities: [],
          categories: [],
          max_num_adult: null,
          max_num_children: null,
          childrentiers: [
            {
              min: '',
              max: '',
              percentage: ''
            }
          ],
          price_per_day: null,
          seasons: []
        }
        this.$refs.roomsForm.resetValidation()
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all room fields'
      }
    },
    addCruise () {
      const formData = new FormData()
      formData.append('_method', 'POST')
      formData.append('name', this.cruise.name)
      formData.append('cruise_line', this.cruise.cruise_line)
      formData.append('number_of_nights', this.cruise.number_of_nights)
      for (let i = 0; i < this.cruise.policies.length; i++) {
        formData.append('policies[]', this.cruise.policies[i])
      }
      for (let i = 0; i < this.cruise.facilities.length; i++) {
        formData.append('facilities[]', this.cruise.facilities[i])
      }
      for (let i = 0; i < this.cruise.includes.length; i++) {
        formData.append('includes[]', this.cruise.includes[i])
      }
      for (let i = 0; i < this.cruise.excludes.length; i++) {
        formData.append('excludes[]', this.cruise.excludes[i])
      }
      formData.append('stars', this.cruise.stars)
      formData.append('ship_name', this.cruise.ship_name)
      formData.append('description', this.cruise.description)
      formData.append('start_city_id', this.cruise.start_city_id)
      for (let i = 0; i < this.cruise.cities_ids.length; i++) {
        formData.append('cities_ids[]', this.cruise.cities_ids[i])
      }
      for (let i = 0; i < this.cruise.start_days.length; i++) {
        formData.append('start_days[]', this.cruise.start_days[i])
      }
      formData.append('master_image', this.cruise.master_image, this.cruise.master_image.name)
      for (let i = 0; i < this.cruise.rooms.length; i++) {
        formData.append(`rooms[${i}][type]`, this.cruise.rooms[i].type)
        formData.append(`rooms[${i}][occupancy]`, this.cruise.rooms[i].occupancy)
        for (let j = 0; j < this.cruise.rooms[i].inclusions.length; j++) {
          formData.append(`rooms[${i}][inclusions][]`, this.cruise.rooms[i].inclusions[j])
        }
        for (let j = 0; j < this.cruise.rooms[i].amenities.length; j++) {
          formData.append(`rooms[${i}][amenities][]`, this.cruise.rooms[i].amenities[j])
        }
        for (let j = 0; j < this.cruise.rooms[i].categories.length; j++) {
          formData.append(`rooms[${i}][categories][]`, this.cruise.rooms[i].categories[j])
        }
        formData.append(`rooms[${i}][max_num_adult]`, this.cruise.rooms[i].max_num_adult)
        formData.append(`rooms[${i}][max_num_children]`, this.cruise.rooms[i].max_num_children)
        for (let j = 0; j < this.cruise.rooms[i].seasons.length; j++) {
          formData.append(`rooms[${i}][seasons][${j}][id]`, this.cruise.rooms[i].seasons[j].id)
          formData.append(`rooms[${i}][seasons][${j}][price_per_person]`, this.cruise.rooms[i].seasons[j].price_per_person)
        }
        for (let c = 0; c < this.cruise.rooms[i].childrentiers.length; c++) {
          formData.append(`rooms[${i}][childrens][${c}][min]`, this.cruise.rooms[i].childrentiers[c].min)
          formData.append(`rooms[${i}][childrens][${c}][max]`, this.cruise.rooms[i].childrentiers[c].max)
          formData.append(`rooms[${i}][childrens][${c}][children_Percentage]`, this.cruise.rooms[i].childrentiers[c].percentage)
        }
        // formData.append(`rooms[${i}][season_id]`, this.cruise.rooms[i].season_id)
      }
      // for (let i = 0; i < this.cruise.images.length; i++) {
      //   formData.append('images[]', this.cruise.images[i], this.cruise.images[i].name)
      //   formData.append('sort[]', this.cruise.sort)
      // }
      this.cruise.images.forEach((imageData, index) => {
        formData.append(`images[${index}][image]`, imageData.image ? imageData.image : null)
        formData.append(`images[${index}][sort]`, imageData.sort ? imageData.sort : index + 1)
      })
      formData.append('seo_title', this.cruise.seo_title)
      formData.append('seo_description', this.cruise.seo_description)
      this.addCruiseLoading = true

      this.$http.post(storeCruise, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        console.log(response)
        this.addcruiseLoading = false
        if (response.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Cruise was added successfully'
          this.$router.push({ name: 'cruises' })
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.data.message
          this.addCruiseLoading = false
        }
      }, err => {
        this.addCruiseLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.errors
      }).finally(() => {
        this.addCruiseLoading = false
      })
    },
    addNewChildrentier () {
      const childrentiersArr = this.room.childrentiers

      if (childrentiersArr.length > 0) {
        const lastChildrenTier = childrentiersArr[childrentiersArr.length - 1]
        const newMin = lastChildrenTier.max ? parseInt(lastChildrenTier.max) + 1 : '' // Set the new min value to the previous max value
        const newChildrenTier = {
          name: '',
          min: newMin,
          max: '',
          adult_price: '',
          child_percentage: ''
        }
        this.room.childrentiers.push(newChildrenTier)
      } else {
        // Add new pricing tier for the first tier
        this.room.childrentiers.push({
          min: '',
          max: '',
          percentage: ''
        })
      }
    },
    removeChildrenTier (index) {
      this.room.childrentiers.splice(index, 1)
    },
    addNewimage () {
      const countImages = this.cruise.images.length
      const newImage = {
        image: null,
        sort: countImages + 1
      }
      this.cruise.images.push(newImage)
    },
    removeImage (imageIndex) {
      this.cruise.images.splice(imageIndex, 1)
    },
    isUniqueSort (value) {
      if (value === null || value === undefined) {
        return 'Sort value is required'
      }
      const sortValues = this.editingCruise.images.map(image => image.sort).filter(sort => sort !== null && sort !== undefined)
      return sortValues.filter(sort => sort === value).length <= 1 || 'Sort value must be unique'
    }
  },
  beforeCreate () {
    this.$http.get(formLists, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === 200) {
        this.cities = response.body.data.cities
        this.seasons = response.body.data.seasons
      }
    })
  }

}
</script>
