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
      v-if="cruise"
      >

          <v-img
          height="250"
          :src="cruise.master_image"
          >
            <v-btn @click="masterImageDialog = true; mainImage = true;" class="ma-2" right absolute fab color="blue" large><v-icon color="white">mdi-image-edit</v-icon></v-btn>
          </v-img>

          <v-card-title class="pb-0">
            <v-row justify="space-between" class="px-5">
              <span>{{cruise.name + '/ ' + cruise.number_of_nights + 'nights'}}</span>
              <div class="grey--text" ><v-icon color="blue">mdi-map-marker</v-icon>{{cruise.cruise_line}}</div>
              <v-rating
              :value="Number(cruise.stars)"
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
              <v-icon color="cyan" left>mdi-ferry</v-icon>{{cruise.ship_name}}
          </div>
          <v-divider class="my-4"></v-divider>
          <div v-html="cruise.description"></div>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-title>Facilities</v-card-title>

          <v-card-text>
              <v-chip-group
              column
              >
                  <v-chip v-for="(item, i) in cruise.facilities" :key="i"><span v-if="item !== ''">{{item}}</span></v-chip>
              </v-chip-group>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title v-if="cruise.start_days.length">Start Days</v-card-title>

          <v-card-text v-if="cruise.start_days.length">
            <v-chip class="mx-1" v-for="(item, i) in cruise.start_days" :key="i"><span v-if="item !== ''">{{item}}</span></v-chip>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-title v-if="cruise.policies.length">Policies</v-card-title>

          <v-card-text v-if="cruise.policies.length">
              <p v-for="(item, i) in cruise.policies" :key="i">{{item}}</p>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-title v-if="cruise.includes.length">Inclusions</v-card-title>

          <v-card-text v-if="cruise.includes.length">
              <v-chip-group
              column
              >
                  <v-chip v-for="(item, i) in cruise.includes" :key="i"><span v-if="item !== ''">{{item}}</span></v-chip>
              </v-chip-group>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-title v-if="cruise.excludes.length">Exclusions</v-card-title>

          <v-card-text v-if="cruise.excludes.length">
              <v-chip-group
              column
              >
                  <v-chip v-for="(item, i) in cruise.excludes" :key="i"><span v-if="item !== ''">{{item}}</span></v-chip>
              </v-chip-group>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <!-- <v-card-title v-if="cruise.childrenPolicies.length">Children Policies</v-card-title>

          <v-card-text v-if="cruise.childrenPolicies.length">
            <v-simple-table dense class="policies">
              <template v-slot:default>
                  <thead>
                      <tr>
                          <th class="text-left">Room</th>
                          <th class="text-left">
                          Age 1
                          </th>
                          <th class="text-left">
                          Age 2
                          </th>
                          <th class="text-left">
                            Age 3
                          </th>
                          <th class="text-left">
                            Age 4
                          </th>
                          <th class="text-left">
                            Age 5
                          </th>
                          <th class="text-left">
                            Age 6
                          </th>
                          <th class="text-left">
                            Age 7
                          </th>
                          <th class="text-left">
                            Age 8
                          </th>
                          <th class="text-left">
                            Age 9
                          </th>
                          <th class="text-left">
                            Age 10
                          </th>
                          <th class="text-left">
                            Age 11
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td style="min-width: 120px !important; font-weight: bold;">{{cruise.childrenPolicies[0].occupancy}} room First Child</td>
                        <td v-for="(item, i) in cruise.childrenPolicies[0].first_child" :key="i">{{item}}%</td>
                      </tr>
                      <tr>
                        <td style="min-width: 120px !important; font-weight: bold;">{{cruise.childrenPolicies[0].occupancy}} room Second Child</td>
                        <td v-for="(item, i) in cruise.childrenPolicies[0].second_child" :key="i">{{item}}%</td>
                      </tr>
                      <tr>
                        <td style="min-width: 120px !important; font-weight: bold;">{{cruise.childrenPolicies[1].occupancy}} room First Child</td>
                        <td v-for="(item, i) in cruise.childrenPolicies[1].first_child" :key="i">{{item}}%</td>
                      </tr>
                      <tr>
                        <td style="min-width: 120px !important; font-weight: bold;">{{cruise.childrenPolicies[1].occupancy}} room Second Child</td>
                        <td v-for="(item, i) in cruise.childrenPolicies[1].second_child" :key="i">{{item}}%</td>
                      </tr>
                  </tbody>
                  <tbody>
                </tbody>
              </template>
          </v-simple-table>
          </v-card-text> -->
          <!-- @click="$store.state.childPolicies = cruise.childrenPolicies.find(el => el.occupancy === 'single'); $router.push({name: 'hotelPolicies', params: {type: 'cruise', id: cruise.id, occupancy: 'single'}})" -->
          <!-- @click="$store.state.childPolicies = cruise.childrenPolicies.find(el => el.occupancy === 'double'); $router.push({name: 'hotelPolicies', params: {type: 'cruise', id: cruise.id, occupancy: 'douple'}})" -->
          <v-card-actions>
            <v-btn
            color="blue lighten-1 white--text"
            >
              Single Room
            </v-btn>
            <v-btn
            color="blue lighten-1 white--text"
            >
              Douple Room
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
      v-if="cruise && cruise.images.length > 0"
      >
          <v-card-title>
            <v-row class="px-1 mb-2" justify="space-between" align="center">
              <div>Cruise Images</div>
              <v-btn @click="imageDialog = true; mainImage = false" small fab color="blue"><v-icon color="white">mdi-image-plus</v-icon></v-btn>
            </v-row>
          </v-card-title>
          <v-row justify="space-around">
            <v-img max-width="48%" class="ma-1" v-for="(image, i) in cruise.images" :key="i" :src="image.image" max-height="150"></v-img>
          </v-row>
      </v-card>
      <!-- rooms -->
      <v-card
      class="mx-12 my-5 pa-5"
      v-if="cruise && cruise.rooms.length"
      >
          <v-card-title>
            <v-row class="px-1" justify="space-between" align="center">
              <div>Cruise Rooms</div>
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
                          Room amenities
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
                      v-for="(item, i) in cruise.rooms"
                      :key="i"
                      >
                          <td>{{ item.type }}</td>
                          <td>{{ item.occupancy }}</td>
                          <td><span v-for="(element, x) in item.inclusions" :key="x"> {{ element }} ,</span></td>
                          <td><span v-for="(element, x) in item.categories" :key="x"> {{ element }} ,</span></td>
                          <td>{{ item.max_num_adult }}</td>
                          <td>{{ item.max_num_children }}</td>
                          <td>
                            <div v-for="season in item.package_hotel_room_season" :key="season.id">
                              <span class="blue--text">From &nbsp; </span>
                              <dateDisplay :date="season.start_date" />
                              <span class="blue--text"> &nbsp; To &nbsp; </span>
                              <dateDisplay :date="season.end_date" />
                              <span class="blue--text"> ${{season.price_per_day}} per person</span>
                            </div>
                          </td>
                          <td class="text-right">
                            <v-btn icon color="blue" large @click="editRoom(item, i)">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </td>
                          <td class="text-right">
                            <v-btn :disabled="cruise.rooms.length < 2" icon color="error" large @click="deleteRoom(i)">
                              <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                          </td>
                      </tr>
                  </tbody>
              </template>
          </v-simple-table>
      </v-card>

      <!-- basic info form -->
      <v-dialog persistent v-if="editingCruise" max-width="800" v-model="basicInfoFormDialog">
        <v-card class="pa-5">
          <v-card-title>Update Basic Info</v-card-title>
          <v-form ref="basicForm" v-model="basicFormValid">
              <v-text-field
              label="Cruise Name"
              v-model="editingCruise.name"
              type="text"
              outlined
              class="mt-3"
              :rules="[v => !!v || 'item is required']"
              color="blue"
              >
              </v-text-field>
              <v-text-field
              label="Cruise sort"
              v-model="editingCruise.sort"
              type="number"
              outlined
              class="mt-3"
              :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be positive numbers']"
              color="blue"
              >
              </v-text-field>
              <v-text-field
              label="Cruise Line"
              v-model="editingCruise.cruise_line"
              type="text"
              outlined
              :rules="[v => !!v || 'item is required']"
              color="blue"
              >
              </v-text-field>
              <v-text-field
                label="SEO Title"
                v-model="editingCruise.seo_title"
                type="text"
                outlined
                class="mt-3"
                color="blue"
              >
              </v-text-field>
              <v-text-field
                label="SEO Description"
                v-model="editingCruise.seo_description"
                type="text"
                outlined
                class="mt-3"
                color="blue"
              >
              </v-text-field>
              <v-row>
                  <v-col cols="12" sm="6">
                      <v-text-field
                      label="Cruise Ship Name"
                      v-model="editingCruise.ship_name"
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
                    v-model="editingCruise.stars"
                    type="number"
                    :rules="[v => !!v || 'item is required', v => v.length === 1 || 'Stars must be between 0 and 7', v => /^[0-7]*$/.test(v) || 'Stars must be between 0 and 7']"
                    color="blue"
                    max="7"
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
                    v-model="editingCruise.number_of_nights"
                    min="1"
                    type="number"
                    :rules="[v => !!v || 'Nights number is required']"
                    color="blue"
                    >
                    </v-text-field>
                  </v-col>
              </v-row>

              <!-- start days -->
              <!-- <v-select
              v-model="editingCruise.start_days"
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

              <!-- <v-select
              v-model="editingCruise.start_city_id"
              :items="cities"
              item-value="CityID"
              item-text="CityName"
              color="blue"
              outlined
              label="Cruise Start City"
              :rules="[v => !!v || 'cities are required']"
              >
              </v-select> -->
              <!-- <v-select
              v-model="editingCruise.cities_ids"
              :items="cities"
              item-value="CityID"
              item-text="CityName"
              color="blue"
              outlined
              multiple
              label="Cruise Cities"
              :rules="[v => !!v || 'cities are required']"
              >
              </v-select> -->

              <p class="body-1 gray">Cruise Faciliteis</p>

                <v-text-field
                placeholder="Add Facility"
                v-model="facility"
                outlined
                append-icon="mdi-plus-circle"
                @click:append="addCruiseFacility"
                >
                </v-text-field>

                <v-divider></v-divider>

                <v-simple-table dense v-if="editingCruise.facilities.length">
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
                        v-for="(item, i) in editingCruise.facilities"
                        :key="i"
                        >
                            <td>{{ item }}</td>
                            <td class="text-right">
                                <v-btn icon color="error" large @click="editingCruise.facilities.splice(i, 1)">
                                <v-icon>mdi-trash-can</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                <v-divider></v-divider>

                <p class="body-1 mt-3 gray">Cruise Policies</p>

                <v-text-field
                placeholder="Add Policy"
                v-model="policy"
                outlined
                append-icon="mdi-plus-circle"
                @click:append="addCruisePolicy"
                >
                </v-text-field>

                <v-divider></v-divider>

                <v-simple-table dense v-if="editingCruise.policies.length">
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
                        v-for="(item, i) in editingCruise.policies"
                        :key="i"
                        >
                            <td>{{ item }}</td>
                            <td class="text-right">
                                <v-btn icon color="error" large @click="editingCruise.policies.splice(i, 1)">
                                <v-icon>mdi-trash-can</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
              <v-divider></v-divider>

              <p class="body-1 gray">Cruise Inclusions</p>

              <v-text-field
              placeholder="Add Facility"
              v-model="inclusion"
              outlined
              append-icon="mdi-plus-circle"
              @click:append="addCruiseInclusion"
              >
              </v-text-field>

              <v-divider></v-divider>

              <v-simple-table dense v-if="editingCruise.includes.length">
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
                      v-for="(item, i) in editingCruise.includes"
                      :key="i"
                      >
                          <td>{{ item }}</td>
                          <td class="text-right">
                              <v-btn icon color="error" large @click="editingCruise.includes.splice(i, 1)">
                              <v-icon>mdi-trash-can</v-icon>
                              </v-btn>
                          </td>
                      </tr>
                  </tbody>
                  </template>
              </v-simple-table>
              <v-divider></v-divider>

              <p class="body-1 gray">Cruise Exclusions</p>

              <v-text-field
              placeholder="Add Facility"
              v-model="exclusion"
              outlined
              append-icon="mdi-plus-circle"
              @click:append="addCruiseExclusion"
              >
              </v-text-field>

              <v-divider></v-divider>

              <v-simple-table dense v-if="editingCruise.excludes.length">
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
                      v-for="(item, i) in editingCruise.excludes"
                      :key="i"
                      >
                          <td>{{ item }}</td>
                          <td class="text-right">
                              <v-btn icon color="error" large @click="editingCruise.excludes.splice(i, 1)">
                              <v-icon>mdi-trash-can</v-icon>
                              </v-btn>
                          </td>
                      </tr>
                  </tbody>
                  </template>
              </v-simple-table>
              <v-divider class="my-2"></v-divider>
              <!-- api-key="k73spamkrjccv5w3e5c9f2oa0h5hm3ncwotken8jtkfq2il4" -->
              <editor
              v-model="editingCruise.description"
              api-key="x21puj7j5tdxkuct1ma1pa63pwru6yf0skeh4huvvgxv4f5x"
              :init="{
                placeholder: 'Cruise Description',
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
          </v-form>
          <v-divider class="my-4"></v-divider>
          <v-card-actions>
            <v-btn text color="warning" @click="basicInfoFormDialog = false; updateCruiseLoading = false;">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn tile color="success" :loading="updateCruiseLoading" @click="updateCruise">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog  persistent max-width="1000" v-model="masterImageDialog">
        <v-card class="pa-5">
          <v-card-title>Change Image</v-card-title>
          <v-card-text>
            <v-row>
              <v-img max-width="30%" class="my-4 pa-4 text-center" :src="master_image" max-height="150"></v-img>
              <v-col cols="12" sm="12">
                <v-file-input
                v-model="editingCruise.master_image"
                accept="image/*"
                label="Cruise Master Image"
                color="blue"
                outlined
                show-size
                @change="loadMasterImage"
                >
                </v-file-input>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="warning" @click="masterImageDialog = false; updateCruiseLoading = false;">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn tile color="success white--text" @click="updateCruise" :loading="updateCruiseLoading">Change</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- images form -->
      <v-dialog persistent max-width="1000" v-model="imageDialog">
        <v-card class="pa-5">
          <v-card-title>{{mainImage ? 'Change Image' : 'Edit Images'}}</v-card-title>
          <v-card class="my-4 pa-4 text-center" v-for="(imageData, index) in this.editingCruise.images"  :key="index">
            <v-img max-width="30%" class="text-center"  :key="index" :src="load_images[index].image" max-height="150"></v-img>
            <h1 v-bind:style="{ textAlign: 'left', fontWeight: 'Medium',padding: '1rem',fontSize: '20px' } "
            > image {{ imageData.sort ? imageData.sort : index + 1 }} </h1>
            <v-row>
              <v-col cols="12" sm="9">
             <v-file-input
            v-model="imageData.file"
            accept="image/*"
            label="Cruise Extra Images"
            :rules="[v => !!v || 'Please insert a photo',  value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!']"
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
            :rules="[v => !!v || 'Item is required', v => isUniqueSort(v), v => v.length === 1]"
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
            <v-btn text color="warning" @click="image = null; imageDialog = false; updateCruiseLoading = false;">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="mainImage" tile color="success white--text" @click="updateCruise" :loading="updateCruiseLoading" :disabled="!image">Change</v-btn>
            <v-btn v-else tile color="success white--text" @click="updateCruise" :loading="updateCruiseLoading" :disabled="!hasImages">Update</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- rooms form -->
      <v-dialog persistent max-width="700" v-model="roomsDialog">
        <v-card class="pa-5" v-if="room">

          <v-card-text>
            <v-form ref="roomForm" v-model="roomFormValid">
              <p class="body-1 gray--tex">Add Room</p>
              <v-text-field
              label="Room Type"
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
              placeholder="Add Inclusion and press Plus"
              v-model="room_inclusion"
              outlined
              append-icon="mdi-plus-circle"
              @click:append="addRoomInclusions"
              >
              </v-text-field>

              <v-divider></v-divider>

              <v-simple-table dense v-if="room && room.inclusions.length > 0">
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
              <p class="body-1 mt-3 gray">Room Amenities</p>

              <v-text-field
              placeholder="Add Aminity and press Plus"
              v-model="room_aminity"
              outlined
              append-icon="mdi-plus-circle"
              @click:append="addRoomAmenities"
              >
              </v-text-field>

              <v-divider></v-divider>

              <v-simple-table dense v-if="room && room.amenities.length > 0">
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
              placeholder="Add Category and press Plus"
              v-model="room_category"
              outlined
              append-icon="mdi-plus-circle"
              @click:append="addRoomCategories"
              >
              </v-text-field>

              <v-divider></v-divider>

              <v-simple-table dense v-if="room && room.categories.length > 0">
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

              <v-row justify="space-around">
                  <v-col cols="12" sm="6">
                    <v-text-field
                    label="Room Max Adult Number"
                    outlined
                    v-model="room.max_num_adult"
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
                    v-model="room.max_num_children"
                    type="number"
                    :rules="[v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                    color="blue"
                    >
                    </v-text-field>
                  </v-col>
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
                  v-model="roomSeason.price_per_day"
                  type="number"
                  :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                  color="blue"
                  prefix="$"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-btn height="56" elevation="0" dark :disabled="!(roomSeason.id && roomSeason.price_per_day)" tile small color="blue" @click="addRoomSeason">add season</v-btn>
                </v-col>
              </v-row>
              <v-simple-table dense v-if="room.package_hotel_room_season.length">
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
                    v-for="(item, i) in room.package_hotel_room_season"
                    :key="i"
                    >
                      <td>
                        <!-- <div>
                          <span class="blue--text">From &nbsp; </span>
                          <dateDisplay :date="item.start_date" />
                          <span class="blue--text"> &nbsp; To &nbsp; </span>
                          <dateDisplay :date="item.end_date" />
                        </div> -->
                        <span v-for="season in seasons" :key="season.seasonID">
                          <span v-if="item.package_hotel_season_id === season.seasonID">
                            <span class="blue--text">From &nbsp; </span>  <dateDisplay v-if="season.seasonStartDate" :date="season.seasonStartDate" />
                            <span class="blue--text"> &nbsp; To &nbsp; </span>  <dateDisplay v-if="season.seasonEndDate" :date="season.seasonEndDate" />
                          </span>
                        </span>
                      </td>
                      <td>$ {{ item.price_per_day }}</td>
                      <td class="text-right">
                          <v-btn icon color="error" large @click="room.package_hotel_room_season.splice(i, 1)">
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
            <v-btn text color="warning" @click="roomsDialog = false; updateCruiseLoading = false;">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="isUpdateForm" tile color="success" :disabled="!roomFormValid && !room.amenities.length && !room.categories.length && !room.inclusions.length" :loading="updateCruiseLoading" @click="updateRoom">Update room</v-btn>
            <!--  -->
            <v-btn v-else tile color="success" :disabled="!roomFormValid || !room.amenities.length || !room.categories.length || !room.inclusions.length" :loading="updateCruiseLoading" @click="addRoom">Add room</v-btn>
            <!--  -->
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import { cruise, updateCruise, headers, formLists } from '../../links'
import dateDisplay from '../../components/dateDisplay'
import Editor from '@tinymce/tinymce-vue'

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
      cruise: null,
      editingCruise: null,
      startCity: {},
      loading: true,
      snackbar: false,
      color: '',
      text: '',
      cities: [],
      seasons: [],
      image: null,
      master_image: null,
      load_images: [],
      images: [],
      imageUrl: '',
      facility: '',
      policy: '',
      inclusion: '',
      exclusion: '',
      basicInfoFormDialog: false,
      basicFormValid: true,
      imageDialog: false,
      masterImageDialog: false,
      roomsDialog: false,
      room: {
        type: '',
        occupancy: 'Single',
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
        package_hotel_room_season: []
      },
      roomSeason: {
        price_per_day: '',
        id: null
      },
      childrentiers: [
        {
          min: '',
          max: '',
          percentage: ''
        }
      ],
      roomIndex: null,
      roomFormValid: true,
      mainImage: true,
      updateCruiseLoading: false,
      isUpdateForm: false,
      room_inclusion: '',
      room_aminity: '',
      room_category: '',
      firstLoad: true
    }
  },
  computed: {
    hasImages () {
      return this.editingCruise.images.length > 0
    }
  },
  methods: {
    editRoom (item, i) {
      this.room = item
      this.roomIndex = i
      this.roomsDialog = true
      this.isUpdateForm = true
    //   if (!this.room.roomSeason.SeasonDetails) {
    //     this.room.roomSeason.SeasonDetails = {
    //       seasonID: null
    //     }
    //   }
    },
    addCruiseFacility () {
      if (this.facility) {
        this.cruise.facilities.push(this.facility)
        this.facility = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a facility before submitting'
      }
    },
    addCruisePolicy () {
      if (this.policy) {
        this.cruise.policies.push(this.policy)
        this.policy = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide a policye before submitting'
      }
    },
    addCruiseInclusion () {
      if (this.inclusion) {
        this.cruise.includes.push(this.inclusion)
        this.inclusion = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
      }
    },
    addCruiseExclusion () {
      if (this.exclusion) {
        this.cruise.excludes.push(this.exclusion)
        this.exclusion = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide includes before submitting'
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
    addRoomAmenities () {
      if (this.room_aminity) {
        this.room.amenities.push(this.room_aminity)
        this.room_aminity = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide amenities before submitting'
      }
    },
    addRoomCategories () {
      if (this.room_category) {
        this.room.categories.push(this.room_category)
        this.room_category = ''
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please provide categories before submitting'
      }
    },
    addRoomSeason () {
      this.roomSeason.package_hotel_season_id = this.roomSeason.id
      this.room.package_hotel_room_season.push(this.roomSeason)
      this.roomSeason = {
        price_per_day: '',
        id: ''
      }
    },
    addRoom () {
      this.$refs.roomForm.validate()
      if (this.roomFormValid) {
        const room = this.room
        this.editingCruise.rooms.push(room)
        this.updateCruise()
        this.$refs.roomForm.resetValidation()
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all room fields'
      }
    },
    deleteRoom (i) {
      this.editingCruise.rooms.splice(i, 1)
      this.updateCruise()
    },
    updateRoom () {
      this.$refs.roomForm.validate()
      if (this.roomFormValid) {
        const room = this.room
        this.editingCruise.rooms[this.roomIndex] = room
        this.updateCruise()
        this.$refs.roomForm.resetValidation()
      } else {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please fill all room fields'
      }
    },
    getCruise () {
      this.loading = true
      this.$http.get(cruise(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.status === 200) {
          this.cruise = response.body.cruise
          this.cruise.childrenPolicies = response.body.cruiseChildrenPolicies
          // this.$store.state.childPolicies = response.body.cruiseChildrenPolicies[0]
          this.cruise.rooms.forEach(element => {
            if (!element.categories) element.categories = []
          })
          this.cruise.rooms = this.cruise.rooms.filter(el => el.package_hotel_room_season.length)
          this.editingCruise = { ...this.cruise }
          // this.editingCruise.sort = this.cruise.sort
          this.editingCruise.description = this.cruise.description
          this.editingCruise.start_city_id = this.editingCruise.cities.find(el => el.pivot.is_start).id
          this.startCity = this.editingCruise.cities.find(el => el.pivot.is_start)
          this.editingCruise.cities.splice(this.editingCruise.cities.findIndex(item => item.pivot.is_start), 1)
          this.editingCruise.cities_ids = this.editingCruise.cities.map(el => el.id)
          this.master_image = this.cruise.master_image
          // this.images = this.cruise.images
          this.load_images = this.cruise.images
          // this.editingCruise.images = this.cruise.images
          // this.editingCruise.sort = this.cruise.showNumImg
          // for (let index = 0; index < this.cruise.images.length; index++) {
          //   // const imageData = this.cruise.images[index]
          //   // this.editingCruise.images.push({ id: imageData.id, image: imageData.image, sort: index + 1 })
          // }
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
    updateCruise () {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', this.editingCruise.name)
      formData.append('sort', this.editingCruise.sort)
      formData.append('cruise_line', this.editingCruise.cruise_line)
      formData.append('ship_name', this.editingCruise.ship_name)
      formData.append('number_of_nights', this.editingCruise.number_of_nights)
      for (let i = 0; i < this.editingCruise.policies.length; i++) {
        formData.append('policies[]', this.editingCruise.policies[i])
      }
      for (let i = 0; i < this.editingCruise.facilities.length; i++) {
        formData.append('facilities[]', this.editingCruise.facilities[i])
      }
      for (let i = 0; i < this.editingCruise.includes.length; i++) {
        formData.append('includes[]', this.editingCruise.includes[i])
      }
      for (let i = 0; i < this.editingCruise.excludes.length; i++) {
        formData.append('excludes[]', this.editingCruise.excludes[i])
      }
      formData.append('stars', this.editingCruise.stars)
      formData.append('description', this.editingCruise.description)
      formData.append('start_city_id', this.editingCruise.start_city_id)
      for (let i = 0; i < this.editingCruise.cities_ids.length; i++) {
        formData.append('cities_ids[]', this.editingCruise.cities_ids[i])
      }
      for (let i = 0; i < this.editingCruise.start_days.length; i++) {
        if (this.editingCruise.start_days[i] && this.editingCruise.start_days[i] !== 'undefined') formData.append('start_days[]', this.editingCruise.start_days[i])
      }
      if (this.editingCruise.master_image instanceof File) {
        formData.append('master_image', this.editingCruise.master_image)
      }
      this.editingCruise.images.forEach((imageData, index) => {
        formData.append(`images[id][${index}]`, imageData.id ? imageData.id : null)
        formData.append(`images[file][${index}]`, imageData.file ? imageData.file : null)
        formData.append(`images[sort][${index}]`, imageData.sort ? imageData.sort : index + 1)
      })
      for (let i = 0; i < this.editingCruise.rooms.length; i++) {
        // if (this.editingCruise.rooms[i].package_hotel_room_season.length) {
        if (this.editingCruise.rooms[i].id) formData.append(`rooms[${i}][room_id]`, this.editingCruise.rooms[i].id)
        else formData.append(`rooms[${i}][room_id]`, '0')
        formData.append(`rooms[${i}][type]`, this.editingCruise.rooms[i].type)
        formData.append(`rooms[${i}][occupancy]`, this.editingCruise.rooms[i].occupancy)
        for (let j = 0; j < this.editingCruise.rooms[i].inclusions.length; j++) {
          formData.append(`rooms[${i}][inclusions][]`, this.editingCruise.rooms[i].inclusions[j])
        }
        for (let j = 0; j < this.editingCruise.rooms[i].amenities.length; j++) {
          formData.append(`rooms[${i}][amenities][]`, this.editingCruise.rooms[i].amenities[j])
        }
        for (let j = 0; j < this.editingCruise.rooms[i].categories.length; j++) {
          formData.append(`rooms[${i}][categories][]`, this.editingCruise.rooms[i].categories[j])
        }
        formData.append(`rooms[${i}][max_num_adult]`, this.editingCruise.rooms[i].max_num_adult)
        formData.append(`rooms[${i}][max_num_children]`, this.editingCruise.rooms[i].max_num_children)
        for (let j = 0; j < this.editingCruise.rooms[i].package_hotel_room_season.length; j++) {
          // if (!this.editingCruise.rooms[i].package_hotel_room_season[j]) {
          //   this.room.package_hotel_room_season.pop()
          //   this.snackbar = true
          //   this.color = 'error'
          //   this.text = 'Can not add season to this room'
          //   this.roomsDialog = false
          //   return false
          // }
          if (this.editingCruise.rooms[i].package_hotel_room_season[j].id) {
            formData.append(`rooms[${i}][seasons][${j}][id]`, this.editingCruise.rooms[i].package_hotel_room_season[j].id)
            formData.append(`rooms[${i}][seasons][${j}][price_per_person]`, this.editingCruise.rooms[i].package_hotel_room_season[j].price_per_day)
          }
        }
        for (let c = 0; c < this.editingCruise.rooms[i].childrentiers.length; c++) {
          formData.append(`rooms[${i}][childrens][${c}][min]`, this.cruise.rooms[i].childrentiers[c].min)
          formData.append(`rooms[${i}][childrens][${c}][max]`, this.cruise.rooms[i].childrentiers[c].max)
          formData.append(`rooms[${i}][childrens][${c}][children_Percentage]`, this.cruise.rooms[i].childrentiers[c].percentage)
        }
        // }
      }
      formData.append('seo_title', this.editingCruise.seo_title)
      formData.append('seo_description', this.editingCruise.seo_description)
      // if (this.images.length > 0) {
      //   for (let i = 0; i < this.images.length; i++) {
      //     formData.append('images[]', this.images[i], this.images[i].name)
      //   }
      // }
      this.updateCruiseLoading = true
      this.$http.post(updateCruise(this.cruise.id), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.updateCruiseLoading = false
          this.updateCruiseLoading = false
          this.snackbar = true
          this.color = 'success'
          this.text = 'Cruise data was updated successfully'
          this.basicInfoFormDialog = false
          this.imageDialog = false
          this.masterImageDialog = false
          this.loading = true
          this.roomsDialog = false
          this.getCruise()
          this.room = {
            type: '',
            occupancy: 'Single',
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
            package_hotel_room_season: []
          }
          this.image = null
          this.images = []
          if (this.$refs.roomForm) this.$refs.roomForm.resetValidation()
        } else {
          this.updateCruiseLoading = false
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.updateCruiseLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    },
    addNewChildrentier () {
      const childrentiersArr = this.room.childrentiers

      if (childrentiersArr.length > 0) {
        // const lastChildrenTier = childrentiersArr[childrentiersArr.length - 1]
        // const newMin = lastChildrenTier.max ? parseInt(lastChildrenTier.max) + 1 : '' // Set the new min value to the previous max value
        const newChildrenTier = {
          min: '',
          max: '',
          price: ''
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
      this.editingCruise.images.push({
        image: null,
        file: null,
        sort: null
      })
    },
    removeImage (imageIndex) {
      this.editingCruise.images.splice(imageIndex, 1)
    },
    isUniqueSort (value) {
      if (value === null || value === undefined) {
        return 'Sort value is required'
      }
      const sortValues = this.editingCruise.images.map(image => image.sort).filter(sort => sort !== null && sort !== undefined)
      return sortValues.filter(sort => sort === value).length <= 1 || 'Sort value must be unique'
    },
    loadMasterImage (file) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.master_image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    loadImagesUrl (file, index) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.load_images[index].image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  },
  created () {
    this.getCruise()
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

<style>
.policies td, .policies th {
min-width: 100px;
text-transform: capitalize;
}
.policies thead tr th {
font-weight: bold !important;
}
</style>
