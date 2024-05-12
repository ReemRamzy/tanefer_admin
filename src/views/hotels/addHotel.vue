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
        <h3 class="headline gray--text my-5">Add Hotel</h3>
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
                    Hotel Details
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                step="3"
                >
                    Hotel Rooms
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-form ref="basicForm" v-model="basicFormValid">
                        <v-text-field
                        label="Hotel Name"
                        v-model="hotel.hotel_name"
                        type="text"
                        outlined
                        class="mt-3"
                        :rules="[v => !!v || 'item is required']"
                        color="blue"
                        >
                        </v-text-field>
                        <v-text-field
                        label="Hotel Address"
                        v-model="hotel.hotel_address"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'item is required']"
                        color="blue"
                        >
                        </v-text-field>
                        <v-row>
                          <v-col cols="12" sm="9">
                            <v-text-field
                            label="Hotel Phone"
                            outlined
                            class="inputNumber"
                            v-model="hotel.hotel_phone"
                            type="number"
                            :rules="[v => !!v || 'Phone is required', v => /^[0-9]*$/.test(v) || 'Phone must be numbers']"
                            color="blue"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="3">
                            <v-text-field
                            label="Hotel Stars"
                            outlined
                            v-model="hotel.hotel_stars"
                            type="number"
                            :rules="[v => !!v || 'item is required', v => v.length === 1 || 'Stars must be between 0 and 5', v => /^[0-5]*$/.test(v) || 'Stars must be between 0 and 5']"
                            color="blue"
                            max="5"
                            min="0"
                            class="mx-1"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-select
                        v-model="hotel.hotel_city_id"
                        :items="cities"
                        item-value="CityID"
                        item-text="CityName"
                        color="blue"
                        outlined
                        label="Hotel City"
                        :rules="[v => !!v || 'city is required']"
                        >
                        </v-select>
                        <v-file-input
                        v-model="hotel.hotel_image"
                        accept="image/*"
                        label="Hotel Image"
                        :rules="[v => !!v || 'Please insert a photo', value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!']"
                        color="blue"
                        outlined
                        show-size
                        >
                        </v-file-input>
                        <!-- api-key="k73spamkrjccv5w3e5c9f2oa0h5hm3ncwotken8jtkfq2il4" -->
                        <editor
                        v-model="hotel.hotel_description"
                        api-key="414unjfipp8yuhppj7tjmvs14aaneoj3dv7el0p4b2h3lsax"
                        :init="{
                          placeholder: 'Hotel Description',
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
                    <!-- :disabled="!basicFormValid && hotel.hotel_description" -->
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                    color="primary"
                    @click="step = 2"
                    class="my-3"
                    :disabled="!basicFormValid || hotel.hotel_description === ''"
                    >
                    Continue To Details
                    </v-btn>

                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-form ref="detailsForm" v-model="detailsFormValid">
                        <p class="body-1 gray">Hotel Faciliteis</p>

                        <v-text-field
                        placeholder="Add Facility"
                        v-model="hotel_facility"
                        outlined
                        append-icon="mdi-plus-circle"
                        @click:append="addHotelFacility"
                        >
                        </v-text-field>

                        <v-divider></v-divider>

                        <v-simple-table dense v-if="hotel.hotel_facilities.length > 0">
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
                                v-for="(item, i) in hotel.hotel_facilities"
                                :key="i"
                                >
                                    <td>{{ item }}</td>
                                    <td class="text-right">
                                        <v-btn icon color="error" large @click="hotel.hotel_facilities.splice(i, 1)">
                                        <v-icon>mdi-trash-can</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            </template>
                            <v-divider></v-divider>
                        </v-simple-table>

                        <p class="body-1 mt-3 gray">Hotel Policies</p>

                        <v-text-field
                        placeholder="Add Policy"
                        v-model="hotel_policy"
                        outlined
                        append-icon="mdi-plus-circle"
                        @click:append="addHotelPolicy"
                        >
                        </v-text-field>

                        <v-divider></v-divider>

                        <v-simple-table dense v-if="hotel.hotel_policies.length > 0">
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
                                v-for="(item, i) in hotel.hotel_policies"
                                :key="i"
                                >
                                    <td>{{ item }}</td>
                                    <td class="text-right">
                                        <v-btn icon color="error" large @click="hotel.hotel_policies.splice(i, 1)">
                                        <v-icon>mdi-trash-can</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            </template>
                            <v-divider></v-divider>
                        </v-simple-table>
                        <gmap-map
                        :center="mapLocation"
                        :zoom="2"
                        style="height: 300px"
                        ref="mapRef"
                        >
                          <!-- <gmap-marker
                          :position="mapLocation"
                          :draggable="true"
                          /> -->
                        </gmap-map>
                        <p>Lat: {{mapLocation.lat}}, Lng: {{mapLocation.lng}}</p>
                        <!-- <p class="body-1 mt-3 gray">Hotel Includes</p>

                        <v-text-field
                        placeholder="Add Includes"
                        v-model="hotel_includes"
                        outlined
                        append-icon="mdi-plus-circle"
                        @click:append="addHotelIncludes"
                        >
                        </v-text-field>

                        <v-divider></v-divider>

                        <v-simple-table dense v-if="hotel.hotel_includes.length > 0">
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
                                <tr
                                v-for="(item, i) in hotel.hotel_includes"
                                :key="i"
                                >
                                    <td>{{ item }}</td>
                                    <td class="text-right">
                                        <v-btn icon color="error" large @click="hotel.hotel_includes.splice(i, 1)">
                                        <v-icon>mdi-trash-can</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            </template>
                            <v-divider></v-divider>
                        </v-simple-table>

                        <p class="body-1 mt-3 gray">Hotel Excludes</p>

                        <v-text-field
                        placeholder="Add Excludes"
                        v-model="hotel_excludes"
                        outlined
                        append-icon="mdi-plus-circle"
                        @click:append="addHotelExcludes"
                        >
                        </v-text-field>

                        <v-divider></v-divider>

                        <v-simple-table dense v-if="hotel.hotel_excludes.length > 0">
                            <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Excludes
                                    </th>
                                    </th>
                                    <th class="text-right">
                                        Remove
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="(item, i) in hotel.hotel_excludes"
                                :key="i"
                                >
                                    <td>{{ item }}</td>
                                    <td class="text-right">
                                        <v-btn icon color="error" large @click="hotel.hotel_excludes.splice(i, 1)">
                                        <v-icon>mdi-trash-can</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                            </template>
                            <v-divider></v-divider>
                        </v-simple-table> -->
<!-- :rules="[files => !files || !files.some(file => file.size > 2e6) || 'Avatar size should be less than 2 MB!']" -->
                        <v-file-input
                        v-model="hotel.hotel_images"
                        accept="image/*"
                        label="Hotel Images"
                        color="blue"
                        class="mt-3"
                        multiple
                        outlined
                        show-size
                        counter
                        >
                        </v-file-input>
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
                        :disabled="hotel.hotel_facilities.length < 1 || hotel.hotel_policies.length < 1"
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
                    :items="['Single', 'Double', 'Triple']"
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
                        <v-text-field
                        label="Room Rate Per Night"
                        outlined
                        class="inputNumber mx-1"
                        v-model="room.price_per_day"
                        type="number"
                        :rules="[v => !!v || 'Price is required', v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                        color="blue"
                        prefix="$"
                        >
                        </v-text-field>
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
                    <v-simple-table dense v-if="hotel.rooms.length > 0">
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
                              <th class="text-left">
                                Room Rate Per Night
                              </th>
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
                            v-for="(item, i) in hotel.rooms"
                            :key="i"
                            >
                                <td>{{ item.type }}</td>
                                <td>{{ item.occupancy }}</td>
                                <td><span v-for="(element, x) in item.inclusions" :key="x">{{ element }} , </span></td>
                                <td><span v-for="(element, x) in item.amenities" :key="x">{{ element }} , </span></td>
                                <td><span v-for="(element, x) in item.categories" :key="x">{{ element }} , </span></td>
                                <td>{{ item.max_num_adult }}</td>
                                <td>{{ item.max_num_children }}</td>
                                <td>{{ item.price_per_day }}</td>
                                <!-- <td>
                                  <span v-for="season in seasons" :key="season.seasonID">
                                    <span v-if="item.season_id === season.seasonID">
                                      <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="season.seasonStartDate" :date="season.seasonStartDate" />
                                      <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="season.seasonEndDate" :date="season.seasonEndDate" />
                                    </span>
                                  </span>
                                </td> -->
                                <td class="text-right">
                                    <v-btn icon color="error" large @click="hotel.rooms.splice(i, 1)">
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
                      :disabled="addHotelLoading"
                      >
                      Back To Details
                      </v-btn>

                      <v-spacer></v-spacer>

                      <v-btn
                      class="mr-5 my-3"
                      color="primary"
                      :disabled="hotel.rooms < 1"
                      @click="addHotel"
                      :loading="addHotelLoading"
                      >
                      Add Hotel
                      </v-btn>

                    </v-row>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-container>
</template>

<script>
import { headers, addHotel, formLists } from '../../links'
import Editor from '@tinymce/tinymce-vue'
import dateDisplay from '../../components/dateDisplay'

export default {
  components: {
    editor: Editor,
    dateDisplay
  },
  data () {
    return {
      snackbar: false,
      color: '',
      text: '',
      step: 1,
      basicFormValid: true,
      detailsFormValid: true,
      roomsFormValid: true,
      hotel: {
        hotel_name: '',
        hotel_address: '',
        hotel_facilities: [],
        hotel_includes: [],
        hotel_excludes: [],
        hotel_description: '',
        hotel_policies: [],
        hotel_stars: '0',
        hotel_phone: '',
        hotel_image: null,
        hotel_city_id: null,
        hotel_images: [],
        rooms: []
      },
      room: {
        type: '',
        occupancy: 'single',
        inclusions: [],
        amenities: [],
        categories: [],
        max_num_adult: null,
        max_num_children: null,
        price_per_day: null,
        seasons: []
      },
      roomSeason: {
        id: null,
        price_per_person: ''
      },
      hotel_facility: '',
      hotel_policy: '',
      hotel_includes: '',
      hotel_excludes: '',
      room_inclusion: '',
      room_aminity: '',
      room_category: '',
      cities: [],
      seasons: [],
      addHotelLoading: false,
      map: null
    }
  },
  computed: {
    mapLocation () {
      if (!this.map) {
        return {
          lat: 26.8206,
          lng: 30.8025
        }
      }
      return {
        lat: Number(this.map.getCenter().lat().toFixed(4)),
        lng: Number(this.map.getCenter().lng().toFixed(4))
      }
    }
  },
  methods: {
    addHotelFacility () {
      if (this.hotel_facility) {
        this.hotel.hotel_facilities.push(this.hotel_facility)
        this.hotel_facility = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a facility before submitting'
      }
    },
    addHotelPolicy () {
      if (this.hotel_policy) {
        this.hotel.hotel_policies.push(this.hotel_policy)
        this.hotel_policy = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a policye before submitting'
      }
    },
    addHotelIncludes () {
      if (this.hotel_includes) {
        this.hotel.hotel_includes.push(this.hotel_includes)
        this.hotel_includes = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
      }
    },
    addHotelExcludes () {
      if (this.hotel_excludes) {
        this.hotel.hotel_excludes.push(this.hotel_excludes)
        this.hotel_excludes = ''
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
        this.hotel.rooms.push(room)
        this.room = {
          type: '',
          inclusions: [],
          amenities: [],
          categories: [],
          max_num_adult: null,
          max_num_children: null,
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
    addHotel () {
      this.addHotelLoading = true
      const formData = new FormData()
      formData.append('_method', 'POST')
      formData.append('hotel_name', this.hotel.hotel_name)
      formData.append('hotel_address', this.hotel.hotel_address)
      formData.append('hotel_latitude', this.mapLocation.lat)
      formData.append('hotel_longitude', this.mapLocation.lng)
      for (let i = 0; i < this.hotel.hotel_policies.length; i++) {
        formData.append('hotel_policies[]', this.hotel.hotel_policies[i])
      }
      for (let i = 0; i < this.hotel.hotel_facilities.length; i++) {
        formData.append('hotel_facilities[]', this.hotel.hotel_facilities[i])
      }
      formData.append('hotel_stars', this.hotel.hotel_stars)
      formData.append('hotel_description', this.hotel.hotel_description)
      formData.append('hotel_city_id', this.hotel.hotel_city_id)
      formData.append('hotel_phone', this.hotel.hotel_phone)
      formData.append('hotel_image', this.hotel.hotel_image, this.hotel.hotel_image.name)
      for (let i = 0; i < this.hotel.rooms.length; i++) {
        formData.append(`rooms[${i}][type]`, this.hotel.rooms[i].type)
        formData.append(`rooms[${i}][occupancy]`, this.hotel.rooms[i].occupancy)
        for (let j = 0; j < this.hotel.rooms[i].inclusions.length; j++) {
          formData.append(`rooms[${i}][inclusions][]`, this.hotel.rooms[i].inclusions[j])
        }
        for (let j = 0; j < this.hotel.rooms[i].amenities.length; j++) {
          formData.append(`rooms[${i}][amenities][]`, this.hotel.rooms[i].amenities[j])
        }
        for (let j = 0; j < this.hotel.rooms[i].categories.length; j++) {
          formData.append(`rooms[${i}][categories][]`, this.hotel.rooms[i].categories[j])
        }
        formData.append(`rooms[${i}][max_num_adult]`, this.hotel.rooms[i].max_num_adult)
        formData.append(`rooms[${i}][max_num_children]`, this.hotel.rooms[i].max_num_children)
        formData.append(`rooms[${i}][price_per_day]`, this.hotel.rooms[i].price_per_day)
        for (let j = 0; j < this.hotel.rooms[i].seasons.length; j++) {
          formData.append(`rooms[${i}][seasons][${j}][id]`, this.hotel.rooms[i].seasons[j].id)
          formData.append(`rooms[${i}][seasons][${j}][price_per_person]`, this.hotel.rooms[i].seasons[j].price_per_person)
        }
        // formData.append(`rooms[${i}][season_id]`, this.hotel.rooms[i].season_id)
      }
      for (let i = 0; i < this.hotel.hotel_images.length; i++) {
        formData.append('hotel_images[]', this.hotel.hotel_images[i], this.hotel.hotel_images[i].name)
      }
      this.$http.post(addHotel, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        console.log(response)
        this.addHotelLoading = false
        if (response.body.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Hotel was added successfully'
          this.$router.push({ name: 'hotels' })
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.addHotelLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.errors
      })
    }
  },
  mounted () {
    if (this.$refs.mapRef) this.$refs.mapRef.$mapPromise.then(map => { this.map = map })
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
