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
        <v-progress-linear
        indeterminate
        color="cyan"
        v-if="loading"
        ></v-progress-linear>
        <!-- basic info -->
        <v-card
        class="mx-12 my-5"
        v-if="hotel"
        >

            <v-img
            height="250"
            :src="hotel.hotelImage"
            >
              <v-btn @click="imageDialog = true; mainImage = true;" class="ma-2" right absolute fab color="blue" large><v-icon color="white">mdi-image-edit</v-icon></v-btn>
            </v-img>

            <v-card-title class="pb-0">
                <v-row justify="space-between" class="px-5">
                    <span>{{hotel.hotelName}} <sub class="grey--text"> /{{hotel.hotelTourCity.CityName}}</sub></span>
                    <v-rating
                    :value="Number(hotel.hotelStars)"
                    length="5"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="20"
                    ></v-rating>
                </v-row>
            </v-card-title>

            <v-card-text>

            <div class="my-4 subtitle-1">
                <v-icon color="cyan" left>mdi-map-marker</v-icon>{{hotel.hotelAddress}}
            </div>

            <div class="my-4 subtitle-1">
                <v-icon color="cyan" left>mdi-phone</v-icon>{{hotel.hotelPhone}}
            </div>
            <v-divider class="my-4"></v-divider>
            <div v-html="hotel.hotelDescription"></div>
            </v-card-text>

            <v-divider class="my-4"></v-divider>

            <v-card-title>Facilities</v-card-title>

            <v-card-text>
                <v-chip-group
                column
                >
                    <v-chip v-for="item in hotel.hotelFacilities" :key="item"><span v-if="item !== ''">{{item}}</span></v-chip>
                </v-chip-group>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-title>Children Policies</v-card-title>

            <v-card-text>
                <p v-for="item in hotel.hotelPolicies" :key="item">{{item}}</p>
            </v-card-text>

            <v-card-actions>
              <v-btn
              color="blue lighten-1 white--text"
              @click="$router.push({name: 'hotelPolicies', params: {type: 'hotel', id: hotel.id, occupancy: 'single'}})"
              >
                Single Room
                </v-btn>
                  <v-btn
              color="blue lighten-1 white--text"
              @click="$router.push({name: 'hotelPolicies', params: {type: 'hotel', id: hotel.id, occupancy: 'douple'}})"
              >
                Double Room
                </v-btn>
                  <v-btn
              color="blue lighten-1 white--text"
              @click="$router.push({name: 'hotelPolicies', params: {type: 'hotel', id: hotel.id, occupancy: 'triple'}})"
              >
               Triple Room
                </v-btn>
              <v-spacer></v-spacer>
              <v-btn
              color="blue lighten-1 white--text"
              @click="basicInfoFormDialog = true"
              >
                Edit Basic Info
              </v-btn>
            </v-card-actions>
        </v-card>
        <!-- images -->
        <v-card
        class="mx-12 my-5 pa-5"
        v-if="hotel && hotel.hotelImages.length > 0"
        >
            <v-card-title>
              <v-row class="px-1" justify="space-between" align="center">
                <div>Hotel Images</div>
                <v-btn @click="imageDialog = true; mainImage = false" small fab color="blue"><v-icon color="white">mdi-image-plus</v-icon></v-btn>
              </v-row>
            </v-card-title>
            <v-row justify="space-around">
                <v-img max-width="48%" class="ma-1" v-for="(image, i) in hotel.hotelImages" :key="i" :src="image" max-height="150"></v-img>
            </v-row>
        </v-card>
        <!-- rooms -->
        <v-card
        class="mx-12 my-5 pa-5"
        v-if="hotel && hotel.hotelRooms.length > 0"
        >
            <v-card-title>
              <v-row class="px-1" justify="space-between" align="center">
                <div>Hotel Rooms</div>
                <v-btn @click="roomsDialog = true; isUpdateForm = false;" tile color="blue white--text"><v-icon color="white">mdi-plus</v-icon> Add Room</v-btn>
              </v-row>
            </v-card-title>
            <v-divider class="mb-2"></v-divider>
            <v-simple-table dense>
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
                            <!-- <th class="text-left">
                            Room Aminities
                            </th> -->
                            <th class="text-left" style="min-width: 200px; !important">
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
                            <th class="text-left" style="min-width: 400px; !important">
                            Room Season
                            </th>
                            <th class="text-right">
                            Update
                            </th>
                            <th class="text-right">
                            Remove
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item, i) in hotel.hotelRooms"
                        :key="i"
                        >
                            <td>{{ item.roomType }}</td>
                            <td>{{ item.roomOccupancy }}</td>
                            <td><span v-for="(element, x) in item.roomInclusions" :key="x"> {{ element }} ,</span></td>
                            <!-- <td><span v-for="(element, x) in item.roomAmenities" :key="x"> {{ element }} ,</span></td> -->
                            <td><span v-for="(element, x) in item.roomCategories" :key="x"> {{ element }} ,</span></td>
                            <td>{{ item.roomMaxNumberOfAdult }}</td>
                            <td>{{ item.roomMaxNumberOfChildren }}</td>
                            <!-- <td>{{ item.roomSeason.roomSeasonPricePerDay }}</td> -->
                            <td>
                              <div v-for="season in item.roomSeasons" :key="season.roomSeasonID">
                                <span class="blue--text">From &nbsp; </span>
                                <dateDisplay :date="season.roomSeasonStartDate" />
                                <span class="blue--text"> &nbsp; To &nbsp; </span>
                                <dateDisplay :date="season.roomSeasonEndDate" />
                                <span class="blue--text"> ${{season.roomSeasonPricePerDay}} per day</span>
                              </div>
                            </td>
                            <td class="text-right">
                              <v-btn icon color="blue" large @click="editRoom(item, i)">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </td>
                            <td class="text-right">
                              <v-btn :disabled="hotel.hotelRooms.length < 2" icon color="error" large @click="deleteRoom(i)">
                                <v-icon>mdi-trash-can</v-icon>
                              </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card>

        <!-- basic info form -->
        <v-dialog persistent v-if="editingHotel" max-width="800" v-model="basicInfoFormDialog">
          <v-card class="pa-5">
            <v-card-title>Update Basic Info</v-card-title>
            <v-form ref="basicForm" v-model="basicFormValid">
                <v-text-field
                label="Hotel Name"
                v-model="editingHotel.hotelName"
                type="text"
                outlined
                class="mt-3"
                :rules="[v => !!v || 'item is required']"
                color="blue"
                >
                </v-text-field>
                <v-text-field
                label="Hotel Address"
                v-model="editingHotel.hotelAddress"
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
                      v-model="editingHotel.hotelPhone"
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
                      v-model="editingHotel.hotelStars"
                      type="number"
                      :rules="[v => !!v || 'item is required', v => v.length === 1 || 'Stars must be between 0 and 7', v => /^[0-7]*$/.test(v) || 'Stars must be between 0 and 7']"
                      color="blue"
                      max="7"
                      min="0"
                      class="mx-1"
                      >
                      </v-text-field>
                    </v-col>
                </v-row>
                <v-select
                v-model="editingHotel.hotelTourCity.CityID"
                :items="cities"
                item-value="CityID"
                item-text="CityName"
                color="blue"
                outlined
                label="Hotel City"
                :rules="[v => !!v || 'city is required']"
                >
                </v-select>
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

                  <v-simple-table dense v-if="editingHotel.hotelFacilities.length > 0">
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
                          v-for="(item, i) in editingHotel.hotelFacilities"
                          :key="i"
                          >
                              <td>{{ item }}</td>
                              <td class="text-right">
                                  <v-btn icon color="error" large @click="editingHotel.hotelFacilities.splice(i, 1)">
                                  <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                      </template>
                  </v-simple-table>
                  <v-divider></v-divider>

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

                  <v-simple-table dense v-if="editingHotel.hotelPolicies.length > 0">
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
                          v-for="(item, i) in editingHotel.hotelPolicies"
                          :key="i"
                          >
                              <td>{{ item }}</td>
                              <td class="text-right">
                                  <v-btn icon color="error" large @click="editingHotel.hotelPolicies.splice(i, 1)">
                                  <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                              </td>
                          </tr>
                      </tbody>
                      </template>
                  </v-simple-table>
                <v-divider></v-divider>
                <editor
                v-model="editingHotel.hotelDescription"
                api-key="k73spamkrjccv5w3e5c9f2oa0h5hm3ncwotken8jtkfq2il4"
                :init="{
                  placeholder: 'Hotel Description',
                  height: 200,
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
                <gmap-map
                :center="mapLocation"
                :zoom="7"
                style="height: 300px; margin: 20px 0"
                ref="mapRef"
                >
                </gmap-map>
                <p>Lat: {{mapLocation.lat}}, Lng: {{mapLocation.lng}}</p>
                {{linkMap()}}
            </v-form>
            <v-divider class="my-4"></v-divider>
            <v-card-actions>
              <v-btn text color="warning" @click="basicInfoFormDialog = false; updateHotelLoading = false;">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn tile color="success" :loading="updateHotelLoading" @click="updateHotel">Update</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- images form -->
        <v-dialog persistent max-width="500" v-model="imageDialog">
          <v-card class="pa-5">
            <v-card-title>{{mainImage ? 'Change Image' : 'Add Images'}}</v-card-title>
            <v-card-text>
              <v-file-input
              v-model="image"
              accept="image/*"
              label="Hotel Image"
              class="my-4"
              color="blue"
              outlined
              show-size
              v-if="mainImage"
              >
              </v-file-input>
              <v-file-input
              v-model="images"
              accept="image/*"
              label="Hotel Image"
              class="my-4"
              color="blue"
              outlined
              multiple
              show-size
              v-else
              >
              </v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="warning" @click="image = null; images = []; imageDialog = false; updateHotelLoading = false;">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="mainImage" tile color="success white--text" @click="updateHotel" :loading="updateHotelLoading" :disabled="!image">Change</v-btn>
              <v-btn v-else tile color="success white--text" @click="updateHotel" :loading="updateHotelLoading" :disabled="images.length === 0">ADD</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- rooms form -->
        <v-dialog persistent max-width="700" v-model="roomsDialog">
          <v-card class="pa-5">
            <v-card-text>
              <v-form ref="roomForm" v-model="roomFormValid">
                <p class="body-1 gray--tex">Add Room</p>
                <v-text-field
                label="Room View"
                v-model="room.roomType"
                outlined
                :rules="[v => !!v || 'Type is required!']"
                color="blue"
                >
                </v-text-field>
                <v-select
                v-model="room.roomOccupancy"
                :items="['Single', 'Double', 'Triple']"
                color="blue"
                outlined
                label="Room Occupancy"
                :rules="[v => !!v || 'Room occupancy is required']"
                >
                </v-select>

                <p class="body-1 mt-3 gray">Room Inclusions</p>

                <v-text-field
                placeholder="Add Inclusion and press Plus"
                v-model="room_inclusion"
                outlined
                append-icon="mdi-plus-circle"
                @click:append="addRoomInclusions"
                >
                </v-text-field>

                <v-divider></v-divider>

                <v-simple-table dense v-if="room && room.roomInclusions.length > 0">
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
                        v-for="(item, i) in room.roomInclusions"
                        :key="i"
                        >
                            <td>{{ item }}</td>
                            <td class="text-right">
                                <v-btn icon color="error" large @click="room.roomInclusions.splice(i, 1)">
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
                placeholder="Add Aminity and press Plus"
                v-model="room_aminity"
                outlined
                append-icon="mdi-plus-circle"
                @click:append="addRoomAminities"
                >
                </v-text-field>

                <v-divider></v-divider>

                <v-simple-table dense v-if="room && room.roomAmenities.length > 0">
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Amenities
                            </th>
                            <th class="text-right">
                                Remove
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item, i) in room.roomAmenities"
                        :key="i"
                        >
                            <td>{{ item }}</td>
                            <td class="text-right">
                                <v-btn icon color="error" large @click="room.roomAmenities.splice(i, 1)">
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
                placeholder="Add Category and press Plus"
                v-model="room_category"
                outlined
                append-icon="mdi-plus-circle"
                @click:append="addRoomCategories"
                >
                </v-text-field>

                <v-divider></v-divider>

                <v-simple-table dense v-if="room && room.roomCategories.length > 0">
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Categories
                            </th>
                            <th class="text-right">
                                Remove
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item, i) in room.roomCategories"
                        :key="i"
                        >
                            <td>{{ item }}</td>
                            <td class="text-right">
                                <v-btn icon color="error" large @click="room.roomCategories.splice(i, 1)">
                                <v-icon>mdi-trash-can</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                <v-divider class="mb-3"></v-divider>

                <v-row justify="space-around">
                    <v-col cols="12" sm="6">
                      <v-text-field
                      label="Room Max Adult Number"
                      outlined
                      v-model="room.roomMaxNumberOfAdult"
                      type="number"
                      :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                      color="blue"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                      label="Room Max Children Number"
                      outlined
                      v-model="room.roomMaxNumberOfChildren"
                      type="number"
                      :rules="[v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                      color="blue"
                      >
                      </v-text-field>
                    </v-col>
                </v-row>

                <v-row justify="space-around">
                  <v-col cols="12" md="5">
                    <v-select
                    v-model="roomSeason.SeasonDetails.seasonID"
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
                    v-model="roomSeason.roomSeasonPricePerDay"
                    type="number"
                    :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                    color="blue"
                    prefix="$"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-btn height="56" elevation="0" dark :disabled="!(roomSeason.SeasonDetails.seasonID && roomSeason.roomSeasonPricePerDay)" tile small color="blue" @click="addRoomSeason">add season</v-btn>
                  </v-col>
                </v-row>
                <v-simple-table dense v-if="room.roomSeasons.length > 0">
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
                      v-for="(item, i) in room.roomSeasons"
                      :key="i"
                      >
                        <td>
                          <span v-for="season in seasons" :key="season.seasonID">
                            <span v-if="item.SeasonDetails.seasonID === season.seasonID">
                              <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="season.seasonStartDate" :date="season.seasonStartDate" />
                              <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="season.seasonEndDate" :date="season.seasonEndDate" />
                            </span>
                          </span>
                        </td>
                        <td>$ {{ item.roomSeasonPricePerDay }}</td>
                        <td class="text-right">
                            <v-btn icon color="error" large @click="room.roomSeasons.splice(i, 1)">
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
              <v-btn text color="warning" @click="roomsDialog = false; updateHotelLoading = false;">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="isUpdateForm" tile color="success" :disabled="!roomFormValid && room.roomAmenities.length === 0 && room.roomCategories.length === 0 && room.roomInclusions === 0" :loading="updateHotelLoading" @click="updateRoom">Update room</v-btn>
              <v-btn v-else tile color="success" :disabled="!roomFormValid || room.roomAmenities.length === 0 || room.roomCategories.length === 0 || room.roomInclusions === 0" :loading="updateHotelLoading" @click="addRoom">Add room</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { showHotel, updateHotel, headers, formLists } from '../../links'
import dateDisplay from '../../components/dateDisplay'
import Editor from '@tinymce/tinymce-vue'

export default {
  components: {
    editor: Editor,
    dateDisplay
  },
  data () {
    return {
      hotel: null,
      editingHotel: null,
      loading: true,
      snackbar: false,
      color: '',
      text: '',
      cities: [],
      seasons: [],
      image: null,
      images: [],
      hotel_facility: '',
      hotel_policy: '',
      hotel_includes: '',
      hotel_excludes: '',
      basicInfoFormDialog: false,
      basicFormValid: true,
      imageDialog: false,
      roomsDialog: false,
      room: {
        roomType: '',
        occupancy: 'Single',
        roomInclusions: [],
        roomAmenities: [],
        roomCategories: [],
        roomMaxNumberOfAdult: null,
        roomMaxNumberOfChildren: null,
        roomSeasons: []
      },
      roomSeason: {
        roomSeasonPricePerDay: '',
        SeasonDetails: {
          seasonID: null
        }
      },
      roomIndex: null,
      roomFormValid: true,
      mainImage: true,
      updateHotelLoading: false,
      isUpdateForm: false,
      room_inclusion: '',
      room_aminity: '',
      room_category: '',
      map: null,
      location: null,
      firstLoad: true
    }
  },
  computed: {
    mapLocation () {
      if (!this.map) {
        return this.location
      }
      return {
        lat: Number(this.map.getCenter().lat().toFixed(4)),
        lng: Number(this.map.getCenter().lng().toFixed(4))
      }
    }
  },
  methods: {
    editRoom (item, i) {
      this.room = item
      this.roomIndex = i
      this.roomsDialog = true
      this.isUpdateForm = true
      if (!this.room.roomSeason.SeasonDetails) {
        this.room.roomSeason.SeasonDetails = {
          seasonID: null
        }
      }
    },
    linkMap () {
      if (this.$refs.mapRef) {
        this.$refs.mapRef.$mapPromise.then(res => {
          if (this.firstLoad) {
            res.panTo({ lat: this.location.lat, lng: this.location.lng })
            this.firstLoad = false
          }
          this.map = res
        })
      }
    },
    addHotelFacility () {
      if (this.hotel_facility) {
        this.hotel.hotelFacilities.push(this.hotel_facility)
        this.hotel_facility = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a facility before submitting'
      }
    },
    addHotelPolicy () {
      if (this.hotel_policy) {
        this.hotel.hotelPolicies.push(this.hotel_policy)
        this.hotel_policy = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a policye before submitting'
      }
    },
    addHotelIncludes () {
      if (this.hotel_includes) {
        this.hotel.hotelIncludes.push(this.hotel_includes)
        this.hotel_includes = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
      }
    },
    addHotelExcludes () {
      if (this.hotel_excludes) {
        this.hotel.hotelExcludes.push(this.hotel_excludes)
        this.hotel_excludes = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide excludes before submitting'
      }
    },
    addRoomInclusions () {
      if (this.room_inclusion) {
        this.room.roomInclusions.push(this.room_inclusion)
        this.room_inclusion = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide inclusions before submitting'
      }
    },
    addRoomAminities () {
      if (this.room_aminity) {
        this.room.roomAmenities.push(this.room_aminity)
        this.room_aminity = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide aminities before submitting'
      }
    },
    addRoomCategories () {
      if (this.room_category) {
        this.room.roomCategories.push(this.room_category)
        this.room_category = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide categories before submitting'
      }
    },
    addRoomSeason () {
      this.room.roomSeasons.push(this.roomSeason)
      this.roomSeason = {
        roomSeasonPricePerDay: '',
        SeasonDetails: {
          seasonID: null
        }
      }
    },
    addRoom () {
      this.$refs.roomForm.validate()
      if (this.roomFormValid) {
        const room = this.room
        this.editingHotel.hotelRooms.push(room)
        this.updateHotel()
        this.$refs.roomForm.resetValidation()
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all room fields'
      }
    },
    deleteRoom (i) {
      this.editingHotel.hotelRooms.splice(i, 1)
      this.updateHotel()
    },
    updateRoom () {
      this.$refs.roomForm.validate()
      if (this.roomFormValid) {
        const room = this.room
        this.editingHotel.hotelRooms[this.roomIndex] = room
        this.updateHotel()
        this.$refs.roomForm.resetValidation()
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all room fields'
      }
    },
    getHotel () {
      this.loading = true
      this.$http.get(showHotel(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.body.status === 200) {
          this.hotel = response.body.data
          this.$store.state.childPolicies = response.body.data.childrenPolicies
          this.hotel.hotelRooms.forEach(element => {
            if (!element.roomCategories) element.roomCategories = []
          })
          this.editingHotel = { ...this.hotel }
          this.editingHotel.hotelDescription = this.hotel.hotelDescription
          this.location = { lat: Number(this.editingHotel.hotelLatitude), lng: Number(this.editingHotel.hotelLongitude) }
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
    },
    updateHotel () {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('hotel_name', this.editingHotel.hotelName)
      formData.append('hotel_address', this.editingHotel.hotelAddress)
      formData.append('hotel_latitude', this.mapLocation.lat)
      formData.append('hotel_longitude', this.mapLocation.lng)
      for (let i = 0; i < this.editingHotel.hotelPolicies.length; i++) {
        formData.append('hotel_policies[]', this.editingHotel.hotelPolicies[i])
      }
      for (let i = 0; i < this.editingHotel.hotelFacilities.length; i++) {
        formData.append('hotel_facilities[]', this.editingHotel.hotelFacilities[i])
      }
      formData.append('hotel_stars', this.editingHotel.hotelStars)
      formData.append('hotel_description', this.editingHotel.hotelDescription)
      formData.append('hotel_city_id', this.editingHotel.hotelTourCity.CityID)
      formData.append('hotel_phone', this.editingHotel.hotelPhone)
      if (this.image) {
        formData.append('hotel_image', this.image, this.image.name)
      }
      for (let i = 0; i < this.editingHotel.hotelRooms.length; i++) {
        if (this.editingHotel.hotelRooms[i].roomID) formData.append(`rooms[${i}][room_id]`, this.editingHotel.hotelRooms[i].roomID)
        else formData.append(`rooms[${i}][room_id]`, '0')
        formData.append(`rooms[${i}][type]`, this.editingHotel.hotelRooms[i].roomType)
        formData.append(`rooms[${i}][occupancy]`, this.editingHotel.hotelRooms[i].roomOccupancy)
        for (let j = 0; j < this.editingHotel.hotelRooms[i].roomInclusions.length; j++) {
          formData.append(`rooms[${i}][inclusions][]`, this.editingHotel.hotelRooms[i].roomInclusions[j])
        }
        for (let j = 0; j < this.editingHotel.hotelRooms[i].roomAmenities.length; j++) {
          formData.append(`rooms[${i}][amenities][]`, this.editingHotel.hotelRooms[i].roomAmenities[j])
        }
        for (let j = 0; j < this.editingHotel.hotelRooms[i].roomCategories.length; j++) {
          formData.append(`rooms[${i}][categories][]`, this.editingHotel.hotelRooms[i].roomCategories[j])
        }
        formData.append(`rooms[${i}][max_num_adult]`, this.editingHotel.hotelRooms[i].roomMaxNumberOfAdult)
        formData.append(`rooms[${i}][max_num_children]`, this.editingHotel.hotelRooms[i].roomMaxNumberOfChildren)
        // formData.append(`rooms[${i}][price_per_day]`, this.editingHotel.hotelRooms[i].roomSeasons.roomSeasonPricePerDay)
        // const SeasonDetails = this.editingHotel.hotelRooms[i].roomSeason.SeasonDetails
        // const seasonID = SeasonDetails ? SeasonDetails.seasonID : null
        // console.log(seasonID)
        // formData.append(`rooms[${i}][season_id]`, seasonID)
        for (let j = 0; j < this.editingHotel.hotelRooms[i].roomSeasons.length; j++) {
          if (!this.editingHotel.hotelRooms[i].roomSeasons[j].SeasonDetails) {
            this.room.roomSeasons.pop()
            this.snackbar = true
            this.color = 'error'
            this.text = 'Can not add season to this room'
            this.roomsDialog = false
            return false
          }
          formData.append(`rooms[${i}][seasons][${j}][id]`, this.editingHotel.hotelRooms[i].roomSeasons[j].SeasonDetails.seasonID)
          formData.append(`rooms[${i}][seasons][${j}][price_per_person]`, this.editingHotel.hotelRooms[i].roomSeasons[j].roomSeasonPricePerDay)
        }
      }
      if (this.images.length > 0) {
        for (let i = 0; i < this.images.length; i++) {
          formData.append('hotel_images[]', this.images[i], this.images[i].name)
        }
      }
      this.updateHotelLoading = true
      this.$http.post(updateHotel(this.hotel.hotelID), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.updateHotelLoading = false
        if (response.body.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Hotel data was updated successfully'
          this.basicInfoFormDialog = false
          this.imageDialog = false
          this.loading = true
          this.roomsDialog = false
          this.getHotel()
          this.room = {
            roomType: '',
            roomInclusions: [],
            roomAmenities: [],
            roomCategories: [],
            roomMaxNumberOfAdult: null,
            roomMaxNumberOfChildren: null,
            roomSeasons: []
          }
          this.image = null
          this.images = []
          if (this.$refs.roomForm) this.$refs.roomForm.resetValidation()
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.updateHotelLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    }
  },
  created () {
    this.getHotel()
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
