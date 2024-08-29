<template>
    <div>
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
      <v-container>
          <grid
          :items="tours"
          :headers="tourHeaders"
          type="tours"
          :loading="loading"
          :page="page"
          :total="totalPackages"
          @pageNum="changePage"
          @addTour="addTourForm"
          @removeTour="showDeletionDialog"
          />

          <v-dialog :retain-focus="false" max-width="900" v-model="dialog">
            <v-card>
                <v-card-title class="primary white--text text-capitalize">Add Tour</v-card-title>
                <v-card-text class="pa-5">
                  <v-form v-model="valid" ref="form">
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

                    <!-- start days -->
                    <v-select
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
                    <v-card outlined v-if="tour.tourSeasons.length" class="pa-1 mb-5">
                      <v-card-text>
                        <dir v-for="(item, i) in tour.tourSeasons" :key="i" class="d-flex align-center justify-space-between">
                          <p class="text-h6">Season: from{{item.from + ' to ' + item.to}}</p>
                          <v-btn icon color="error" @click="tour.tourSeasons = tour.tourSeasons.filter(data => data.from !== item.from && data.to !== item.to)"><v-icon>mdi-delete</v-icon></v-btn>
                        </dir>
                      </v-card-text>
                    </v-card>

                    <!-- recommended start date -->
                    <v-menu
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
                    </v-menu>
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
                        label="Occupancy"
                        outlined
                        v-model="tour.packageOccupancy"
                        type="number"
                        :rules="[v => !!v || 'item is required', v => /^[0-9]*$/.test(v) || 'item must be numbers']"
                        color="blue"
                        class="mx-1"
                    >
                    </v-text-field>
                    <v-text-field
                        label="Solo Price (1 person)"
                        outlined
                        class="inputNumber mx-1"
                        v-model="tour.solopackagePricePerPerson"
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
                        v-model="tour.limopackagePricePerPerson"
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
                    v-model="tour.limoChildrenpercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>
                    <v-text-field
                        label="Hi/Ac Price Per Person (3-8 persons)"
                        outlined
                        class="inputNumber mx-1"
                        v-model="tour.hiacpackagePricePerPerson"
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
                    v-model="tour.hiacChildrenpercentage"
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
                        v-model="tour.casterpackagePricePerPerson"
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
                    v-model="tour.casterChildrenpercentage"
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
                        v-model="tour.buspackagePricePerPerson"
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
                    v-model="tour.busChildrenpercentage"
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
                    v-model="tour.childrenpercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>

                    <v-text-field
                    label="Single Supplement percentage"
                    outlined
                    class="inputNumber mx-1"
                    v-model="tour.singleSupplementPercentage"
                    type="number"
                    min="0"
                    color="blue"
                    prefix="%"
                    >
                    </v-text-field>
                    <v-text-field
                        label="Additional cost"
                        outlined
                        class="inputNumber mx-1"
                        v-model="tour.additionalcost"
                        type="number"
                        :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                        color="blue"
                        prefix="$"
                    >
                    </v-text-field>
                    <v-text-field
                        label="Expected price"
                        outlined
                        class="inputNumber mx-1"
                        v-model="tour.expectedprice"
                        type="number"
                        :rules="[v => /^[0-9]*$/.test(v) || 'Price must be numbers']"
                        color="blue"
                        prefix="$"
                    >
                    </v-text-field>
                    <v-file-input
                    v-model="image"
                    accept="image/*"
                    label="Package Image"
                    :rules="[value => !value || value.size < 2000000 || 'Image size should be less than 5 MB!']"
                    color="blue"
                    outlined
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

                    <!-- <v-row>
                      <v-col cols="12">
                        <v-checkbox
                            :label="`International flight`"
                            v-model="tour.internationalairport">
                        </v-checkbox>
                        <p class="font-weight-bold">Starting airport</p>
                        <v-autocomplete
                            v-model="tour.packagestartingairport"
                            :items="Airports"
                            color="blue"
                            outlined
                            no-filter
                            label="Starting Airport"
                            :search-input.sync="search"
                            :disabled="!tour.internationalairport">>
                          <template slot="selection" slot-scope="data">
                            {{ data.item.Code }} - {{ data.item.Name }}
                          </template>
                          <template slot="item" slot-scope="data">
                            {{ data.item.Code }} - {{ data.item.Name }}
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row> -->
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
                        @input="getHotelsByCity(); getActivitiesByCity(); getcityAirports()"
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
                        <v-text-field
                        label="Duration"
                        outlined
                        v-model="cityDuration"
                        color="blue"
                        class="mx-1"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <p class="font-weight-bold">Package city activities</p>
                    <v-row>
                      <v-col cols="12" sm="8" md="5">
                        <v-select
                        v-model="activity.id"
                        :items="activities"
                        item-value="activityID"
                        item-text="activityTitle"
                        color="blue"
                        outlined
                        label="Package Activity"
                        :disabled="!cityID"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-select
                        v-model="activity.dayNumber"
                        :items="cityDays"
                        color="blue"
                        outlined
                        label="Package Activity Day"
                        :disabled="!cityDayNumber"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-btn block height="56" color="success" tile :disabled="!activity.dayNumber || !activity.id" @click="addActivity">Add</v-btn>
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-simple-table dense v-if="cityActivities.length > 0">
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Activity
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
                              <tr
                              v-for="(item, i) in cityActivities"
                              :key="i"
                              >
                                <td>
                                  <span v-for="activity in activities" :key="activity.activityID">
                                    <span v-if="activity.activityID === item.id">{{activity.activityTitle}}</span>
                                  </span>
                                </td>
                                <td>{{ item.dayNumber }}</td>
                                <td class="text-right">
                                  <v-btn icon color="error" large @click="cityActivities.splice(i, 1)">
                                    <v-icon>mdi-trash-can</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                    </v-row>
                    <p class="font-weight-bold">Package city hotel</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                        v-model="hotelID"
                        :items="hotels"
                        item-value="hotelID"
                        item-text="hotelName"
                        color="blue"
                        outlined
                        label="Package Hotel"
                        :disabled="!cityID"
                        @input="getRoomsByHotel"
                        >
                        </v-select>
                      </v-col>
                      <!-- <v-col cols="12" md="6">
                        <v-btn tile block height="56" color="primary" @click="openRoomDialog()" :disabled="!hotelID">Choose Room</v-btn>
                        <span class="caption" v-if="chosenRoom && chosenRoom.roomSeason">{{ chosenRoom.roomType }} ${{ chosenRoom.roomSeason.roomSeasonPricePerDay || 0 }}</span>
                      </v-col> -->
                    </v-row>
                    <p class="font-weight-bold">Package City Transportaions</p>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-select
                        v-model="transportation.type"
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
                              v-model="transportation.date"
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
                            v-model="transportation.date"
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
                        v-model="transportation.price"
                        type="number"
                        color="blue"
                        prefix="$"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-btn height="56" @click="addTransportation" tile block color="success" :disabled="!transportation.type || !transportation.price"><v-icon left>mdi-plus</v-icon><span>Add</span></v-btn>
                      </v-col>
                    </v-row>
                    <v-simple-table dense v-if="transportations.length > 0">
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
                          v-for="(item, i) in transportations"
                          :key="i"
                          >
                            <td>{{ item.type }}</td>
                            <td>{{ item.date }}</td>
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
                    <v-btn class="my-3" tile color="primary" @click="addProgram" :disabled="(!hotelID && cityActivities.length < 1) || !cityDayNumber || !cityDuration">Add City Program</v-btn>
                    <v-simple-table dense v-if="tour.cities.length > 0">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              City
                            </th>
                            <th class="text-right">
                              Remove
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                          v-for="(item, i) in tour.cities"
                          :key="i"
                          >
                            <td>
                              <span v-for="city in cities" :key="city.CityID">
                                <span v-if="city.CityID === item.id">{{city.CityName}}</span>
                              </span>
                            </td>
                            <td class="text-right">
                              <v-btn icon color="error" large @click="tour.cities.splice(i, 1)">
                                <v-icon>mdi-trash-can</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>

                    <p class="font-weight-bold mt-2">Package Cruise (Optional)</p>
                    <v-row class="my-2">
                      <v-col cols="12" md="6">
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
                      </v-col>

                      <v-col cols="12" md="6">
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
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-5">
                  <v-btn text color="warning" @click="dialog = false">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn tile :disabled="!valid || tour.cities.length < 1" :loading="btnLoad" color="blue white--text" @click="addTour()">Add Package</v-btn>
                </v-card-actions>
            </v-card>
          </v-dialog>

        <!-- <v-dialog max-width="700" v-model="roomsDialog">
          <v-card class="mb-3">
            <v-card-title class="primary white--text d-flex flex-wrap justify-space-between">
              <div>Choose Room</div>
              <v-btn icon @click="roomsDialog = false"><v-icon large>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card @click="chooseRoom(item)" class="ma-3" v-for="item in rooms" :key="item.roomID">
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
            </v-card>
          </v-card>
        </v-dialog> -->

        <v-dialog max-width="700" v-model="removePackageDialog">
          <v-card>
            <v-card-title>Are you sure you want to delete this item ?</v-card-title>
            <v-divider class="my-2"></v-divider>
            <v-card-actions>
              <v-btn color="warning" text @click="removePackageDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" tile @click="removeTour">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
</template>

<script>
import { slug, allPackages, activitiesByCityId, hotelsByCityId, roomsByHotelId, addPackage, removePackage, packageLists, getAirports, cruisesByCity, headers } from '../../links'
import grid from '../../components/tables.vue'
// import dateDisplay from '../../components/dateDisplay'

export default {
  components: {
    grid
    // dateDisplay
  },
  watch: {
    search (val) {
      if (!val) {
        return
      }
      this.getcityAirports(val)
    }
  },
  data () {
    return {
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
        // { text: 'Starting Airport', value: 'packagestartingairport' },
        // { text: 'Start City', value: 'packageStartCity.cityName' },
        // { text: 'Destinations', value: 'destination' },
        // { text: 'Occupancy', value: 'package_occupancy' },
        // { text: 'Expected Price', value: 'expected_price' },
        { text: 'Duration', value: 'packageDuration' },
        { text: 'Night Number', value: 'packageNightsNumber' },
        { text: 'Remove', value: 'removeTour', align: 'end' }
      ],
      actionType: 'add',
      tour: {
        packageTitle: '',
        additionalcost: 0,
        expectedprice: 0,
        internationalairport: false,
        packagestartingairport: '',
        packageOverview: '',
        packageStartDate: '',
        packageDuration: '',
        packagePricePerPerson: '',
        solopackagePricePerPerson: '',
        limopackagePricePerPerson: '',
        hiacpackagePricePerPerson: '',
        casterpackagePricePerPerson: '',
        buspackagePricePerPerson: '',
        limoChildrenpercentage: '',
        hiacChildrenpercentage: '',
        casterChildrenpercentage: '',
        busChildrenpercentage: '',
        childrenpercentage: '',
        singleSupplementPercentage: '',
        packageNightsNumber: '',
        packageOccupancy: '',
        additionalCost: 0,
        expectedPrice: 0,
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
      },
      image: null,
      images: [],
      cityID: '',
      cityName: '',
      cityDayNumber: '',
      cityDays: [],
      cityDuration: '',
      hotelID: '',
      roomID: '',
      chosenRoom: {},
      activity: {
        id: '',
        dayNumber: ''
      },
      cityActivities: [],
      transportations: [],
      transportation: {
        price: '',
        type: '',
        date: ''
      },
      roomsDialog: false,
      dialog: false,
      valid: true,
      btnLoad: false,
      deletedItemId: '',
      removePackageDialog: false,
      slugErrors: '',
      slugAlt: ''
    }
  },
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
    createDaysArray () {
      if (Number(this.cityDayNumber) > 0) {
        this.cityDays = []
        for (let i = 0; i < Number(this.cityDayNumber); i++) {
          this.cityDays[i] = i + 1
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
      this.$http.get(activitiesByCityId(this.cityID), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.activities = response.body.data
        }
      })
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
        price: '',
        type: '',
        date: ''
      }
    },
    addProgram () {
      this.tour.cities.push(
        {
          id: this.cityID,
          city_day_number: this.cityDayNumber,
          city_duration: this.cityDuration,
          hotelId: this.hotelID,
          activities: this.cityActivities,
          transportations: this.transportations
        }
      )
      this.cityID = ''
      this.cityDayNumber = ''
      this.cityDuration = ''
      this.hotelID = ''
      this.cityActivities = []
      this.transportations = []
    },
    addTourForm () {
      this.dialog = true
      this.hotelID = ''
      this.chosenRoom = {}
      this.tour = {
        packageTitle: '',
        additionalcost: 0,
        expectedprice: 0,
        internationalairport: false,
        packagestartingairport: '',
        packageOverview: '',
        packageStartDate: '',
        packageDuration: '',
        packagePricePerPerson: '',
        solopackagePricePerPerson: '',
        limopackagePricePerPerson: '',
        hiacpackagePricePerPerson: '',
        casterpackagePricePerPerson: '',
        buspackagePricePerPerson: '',
        limoChildrenpercentage: '',
        hiacChildrenpercentage: '',
        casterChildrenpercentage: '',
        busChildrenpercentage: '',
        childrenpercentage: '',
        singleSupplementPercentage: '',
        packageNightsNumber: '',
        packageOccupancy: '',
        additionalCost: 0,
        expectedPrice: 0,
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
      }).finally()
    },
    addTour () {
      this.$refs.form.validate()
      if (this.valid) {
        this.btnLoad = true
        const formData = new FormData()
        formData.append('package_title', this.tour.packageTitle)
        formData.append('package_overview', this.tour.packageOverview)
        formData.append('package_duration', this.tour.packageDuration)
        formData.append('price_per_person', this.tour.expectedprice)
        formData.append('package_nights_number', this.tour.packageNightsNumber)
        formData.append('package_start_date', this.tour.packageStartDate)
        formData.append('package_starting_airport', this.tour.packagestartingairport.City)
        formData.append('package_occupancy', this.tour.packageOccupancy)
        formData.append('additional_cost', this.tour.additionalCost)
        formData.append('expected_price', this.tour.expectedPrice)
        formData.append('international_flight', this.tour.internationalairport)
        formData.append('additional_cost', this.tour.additionalcost)
        formData.append('expected_price', this.tour.expectedprice)
        formData.append('solo_packageprice', this.tour.solopackagePricePerPerson)
        formData.append('Limo_packageprice', this.tour.limopackagePricePerPerson)
        formData.append('HiAC_packageprice', this.tour.hiacpackagePricePerPerson)
        formData.append('Caster_packageprice', this.tour.casterpackagePricePerPerson)
        formData.append('bus_packageprice', this.tour.buspackagePricePerPerson)
        formData.append('limo_children_percentage', this.tour.limoChildrenpercentage)
        formData.append('hiac_children_percentage', this.tour.hiacChildrenpercentage)
        formData.append('caster_children_percentage', this.tour.casterChildrenpercentage)
        formData.append('bus_children_percentage', this.tour.busChildrenpercentage)
        formData.append('children_percentage', this.tour.childrenpercentage)
        formData.append('single_supplement_percentage', this.tour.singleSupplementPercentage)
        formData.append('slug', this.tour.slug)
        formData.append('image_alt', this.tour.image_alt)
        formData.append('image_caption', this.tour.image_caption)
        formData.append('meta_title', this.tour.packageMetaTitle)
        formData.append('meta_desc', this.tour.packageMetaDesc)
        if (this.tour.is_top) formData.append('is_top', this.tour.is_top ? 1 : 0)
        if (this.tour.rank) formData.append('rank', this.tour.rank)
        for (let i = 0; i < this.tour.cities.length; i++) {
          formData.append('package_cities[' + i + '][city_id]', this.tour.cities[i].id)
          formData.append('package_cities[' + i + '][city_day_number]', this.tour.cities[i].city_day_number)
          formData.append('package_cities[' + i + '][city_duration]', this.tour.cities[i].city_duration)
          if (this.tour.cities[i].hotelId) {
            formData.append('package_cities[' + i + '][hotel_id]', this.tour.cities[i].hotelId)
          }
          for (let k = 0; k < this.tour.cities[i].activities.length; k++) {
            formData.append('package_cities[' + i + '][activity][' + k + '][id]', this.tour.cities[i].activities[k].id)
            formData.append('package_cities[' + i + '][activity][' + k + '][day_number]', this.tour.cities[i].activities[k].dayNumber)
          }
          for (let j = 0; j < this.tour.cities[i].transportations.length; j++) {
            formData.append('package_cities[' + i + '][transportation][' + j + '][type]', this.tour.cities[i].transportations[j].type)
            formData.append('package_cities[' + i + '][transportation][' + j + '][date]', this.tour.cities[i].transportations[j].date)
            formData.append('package_cities[' + i + '][transportation][' + j + '][price_per_person]', this.tour.cities[i].transportations[j].price)
          }
        }
        for (let i = 0; i < this.tour.startDays.length; i++) {
          formData.append('start_days[' + i + ']', this.tour.startDays[i])
        }
        for (let i = 0; i < this.tour.tourSeasons.length; i++) {
          formData.append('seasons[' + i + '][from]', this.tour.tourSeasons[i].from)
          formData.append('seasons[' + i + '][to]', this.tour.tourSeasons[i].to)
        }
        if (this.image) formData.append('package_image', this.image, this.image.name)

        for (let i = 0; i < this.images.length; i++) {
          formData.append('images[' + i + ']', this.images[i], this.images[i].name)
        }

        // cruiseID
        if (this.cruiseID) formData.append('cruise_id', this.cruiseID)

        this.$http.post(addPackage, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.body.status === 200) {
            this.btnLoad = false
            this.snackbar = true
            this.color = 'success'
            this.text = 'Package was added'
            this.$refs.form.reset()
            this.dialog = false
            this.getTours(15, 1)
          } else {
            this.btnLoad = false
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.errors[0]
          }
        }, err => {
          this.btnLoad = false
          this.snackbar = true
          this.color = 'error'
          this.text = err.body.errors[0]
        })
      } else {
        this.btnLoad = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Please Fill all fields'
      }
    },
    showDeletionDialog (id) {
      this.deletedItemId = id
      this.removePackageDialog = true
    },
    removeTour () {
      this.$http.delete(removePackage(this.deletedItemId), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.removePackageDialog = false
        console.log(response.data.status)
        if (response.data.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Tour was deleted'
          this.getTours(15, 1)
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.data.message
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
    changePage (num) {
      this.getTours(15, num)
      this.page = num
    }
  },
  created () {
    this.getTours(15, 1)
    this.page = 1
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
#map {
  height: 200px;
}
</style>
