<template>
    <v-card>
        <v-card-title primary-title class="orange--text">
            <v-icon color="orange" class="mr-5">
                {{getTableTitle().icon}}
            </v-icon>
            {{getTableTitle().title}}
            <v-spacer></v-spacer>
            <v-btn
            color="blue white--text"
            class="mr-5"
            elevation="0"
            v-if="type === 'hotels'"
            @click="$router.push({ name: 'addHotel' })"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Hotel
            </v-btn>
            <v-btn
            color="blue white--text"
            class="mr-5"
            elevation="0"
            v-if="type === 'cruises'"
            @click="$router.push({ name: 'addCruise' })"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Cruise
            </v-btn>
            <v-btn
            color="blue white--text"
            class="mr-5"
            elevation="0"
            v-if="type === 'activities'"
            @click="$emit('addActivity')"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Activity
            </v-btn>
            <v-btn
            color="blue white--text"
            class="mr-5"
            elevation="0"
            v-if="type === 'cities'"
            @click="$emit('addCity')"
            >
              <v-icon left>mdi-plus</v-icon>
              Add City
            </v-btn>
            <v-btn
            color="blue white--text"
            class="mr-5"
            elevation="0"
            v-if="type === 'seo'"
            @click="$emit('addSEO')"
            >
              <v-icon left>mdi-plus</v-icon>
              Add SEO
            </v-btn>
            <v-btn
            color="blue white--text"
            class="mr-5"
            elevation="0"
            v-if="type === 'tours'"
            @click="$router.push({ name: 'addPackage' })"
            >
              <v-icon left>mdi-plus</v-icon>
              Add Tour
            </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
            <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :item-key="(type === 'manageWhiteAirlines' || type === 'manageBlockedAirlines') ? 'code' : 'id'"
            :items-per-page="15"
            :loading="loading"
            loading-text="Loading... Please wait"
            :search="search"
            :single-select="false"
            :show-select="type === 'manageWhiteAirlines' || type === 'manageBlockedAirlines'"
            :hide-default-footer="type === 'hotels' || type === 'activities' || type === 'tours' || type === 'cruises'"
            :dense="type !== 'tours'"
            >
              <template v-slot:top>
                <v-text-field v-if="type !== 'packageBookings' && type !== 'activitiesBookings' && type !== 'cruisesBookings' && type !== 'hotelsBookings'" v-model="search" label="Search" class="mx-4"></v-text-field>
              </template>

              <!-- cities -->
              <template v-if="type === 'cities'" v-slot:item.editCity="{ item }">
                <v-btn text color="blue" @click="$emit('updateCity', item)">
                  <v-icon left>mdi-pencil</v-icon> Update
                </v-btn>
              </template>
              <template v-if="type === 'cities'" v-slot:item.removeCityById="{ item }">
                <v-btn text color="error" @click="$emit('removeCity', item.id)">
                  <v-icon left>mdi-trash-can-outline</v-icon> Remove
                </v-btn>
              </template>

              <!-- SEO -->
              <template v-if="type === 'seo'" v-slot:item.featured_image="{ item }">
                <img
                :src="item.featured_image"
                alt="SEO Image"
                width="50"
                >
              </template>
              <template v-if="type === 'seo'" v-slot:item.editSEO="{ item }">
                <v-btn text color="blue" @click="$emit('updateSEO', item)">
                  <v-icon left>mdi-pencil</v-icon> Update
                </v-btn>
              </template>

              <!-- tours -->
              <template v-if="type === 'tours'" v-slot:item.packageImage="{ item }">
                <img
                :src="item.packageImage"
                alt="Hotel Image"
                width="50"
                >
              </template>
              <template v-if="type === 'tours'" v-slot:item.packageTitle="{ item }">
                <v-btn text small color="blue lighten--1" @click="goToRoute(item.packageID)">{{ item.packageTitle }}</v-btn>
              </template>
              <template v-if="type === 'tours'" v-slot:item.removeTour="{ item }">
                <v-btn text color="error" @click="$emit('removeTour', item.packageID)">
                  <v-icon left>mdi-trash-can-outline</v-icon> Remove
                </v-btn>
              </template>
              <template v-if="type === 'tours'" v-slot:item.packagePricePerPerson="{ item }">
                <div>$ {{item.packagePricePerPerson}}</div>
              </template>
              <template v-if="type === 'tours'" v-slot:item.destination="{ item }">
                <span v-for="(destination, i) in item.packageCities" :key="destination.packageCityID">
                  {{destination.cityName}}
                  <span v-if="i < item.packageCities.length - 1">, </span>
                </span>
              </template>

              <!-- hotels -->
              <template v-if="type === 'hotels'" v-slot:item.hotelName="{ item }">
                <v-btn text small color="blue lighten--1" @click="goToRoute(item.hotelID)">{{ item.hotelName }}</v-btn>
              </template>
              <template v-if="type === 'hotels'" v-slot:item.hotelImage="{ item }">
                <img
                :src="item.hotelImage"
                alt="Hotel Image"
                width="50"
                >
              </template>
              <template v-if="type === 'hotels'" v-slot:item.removeHotel="{ item }">
                <v-btn text color="error" @click="$emit('removeHotel', item.hotelID)">Remove</v-btn>
              </template>

              <!-- activities -->
              <template v-if="type === 'activities'" v-slot:item.activityTitle="{ item }">
                <v-btn text small color="blue lighten--1" @click="$emit('showActivity', item)">{{ item.activityTitle }}</v-btn>
              </template>
              <template v-if="type === 'activities'" v-slot:item.published="{ item }">
                <v-icon :color="item.published ? 'success' : 'error'">{{item.published ? 'mdi-check' : 'mdi-close'}}</v-icon>
              </template>
              <template v-if="type === 'activities'" v-slot:item.activityImage="{ item }">
                <img
                :src="item.activityImage"
                alt="Activity Image"
                width="50"
                >
              </template>
              <template v-if="type === 'activities'" v-slot:item.activityDuration_digits="{ item }">
                <span>{{item.activityDuration_digits}} {{item.activityDuration_type}}</span>
              </template>
              <template v-if="type === 'activities'" v-slot:item.editActive="{ item }">
                <v-btn text color="blue" @click="$emit('editActivity', item)">Edit</v-btn>
              </template>
              <template v-if="type === 'activities'" v-slot:item.removeActive="{ item }">
                <v-btn text color="error" @click="$emit('removeActivity', item.activityID)">Remove</v-btn>
              </template>

              <!-- cruises -->
              <template v-if="type === 'cruises'" v-slot:item.name="{ item }">
                <v-btn text small color="blue lighten--1" @click="$router.push({name: 'cruise', params: {id: item.id}})">{{ item.name }}</v-btn>
              </template>
              <template v-if="type === 'cruises'" v-slot:item.removeAct="{ item }">
                <v-btn text color="error" @click="$emit('removeCruise', item.id)">Remove</v-btn>
              </template>

              <!-- package bookings -->
              <template v-if="type === 'packageBookings'" v-slot:item.packageId="{ item }">
                <v-btn text small color="blue lighten--1" @click="$router.push({name: 'packageBooking', params: {id: item.id}})">{{ item.id }}</v-btn>
              </template>
              <template v-if="type === 'packageBookings'" v-slot:item.package="{ item }">
                <v-btn v-if="item.package" text small color="blue lighten--1" @click="$router.push({name: 'tour', params: {id: item.package.id}})">{{ item.package.title }}</v-btn>
                <div v-else>---</div>
              </template>

              <!-- activities bookings -->
              <template v-if="type === 'activitiesBookings'" v-slot:item.id="{ item }">
                <v-btn text small color="blue lighten--1" @click="$router.push({name: 'activityBooking', params: {id: item.id}})">{{ item.id }}</v-btn>
              </template>

              <!-- cruises bookings -->
              <template v-else-if="type === 'cruisesBookings'" v-slot:item.id="{ item }">
                <v-btn text small color="blue lighten--1" @click="$router.push({name: 'cruiseBooking', params: {id: item.id}})">{{ item.id }}</v-btn>
              </template>

              <!-- hotel bookings -->
              <template v-else-if="type === 'hotelsBookings'" v-slot:item.id="{ item }">
                <v-btn text small color="blue lighten--1" @click="$router.push({name: 'hotelBooking', params: {id: item.id}})">{{ item.id }}</v-btn>
              </template>
            </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="type === 'hotels' || type === 'activities' || type === 'tours' || type === 'cruises'">
          <v-subheader>Page {{page}}</v-subheader>
          <v-spacer></v-spacer>
          <v-pagination
            v-model="currentPage"
            circle
            :length="pagesNum()"
            :page="page"
            total-visible="15"
            @input="pageNumber"
          ></v-pagination>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
  props: ['headers', 'items', 'type', 'loading', 'blockBtnLoad', 'bookingStatuses', 'paymentStatuses', 'unblockBtnLoad', 'filters', 'dates', 'statuses', 'total', 'page', 'length'],
  data () {
    return {
      search: '',
      selected: [],
      currentPage: 1
    }
  },
  methods: {
    getTableTitle () {
      let title
      switch (this.type) {
        case 'cities':
          title = { icon: 'mdi-city', title: 'Trips Cities' }
          break
        case 'seo':
          title = { icon: 'mdi-web', title: 'SEO' }
          break
        case 'tours':
          title = { icon: 'mdi-beach', title: 'Packages' }
          break
        case 'hotels':
          title = { icon: 'mdi-bed', title: 'Hotels' }
          break
        case 'activities':
          title = { icon: 'mdi-hail', title: 'Adventures' }
          break
        case 'cruises':
          title = { icon: 'mdi-ferry', title: 'Cruises' }
          break
        case 'packageBookings':
          title = { icon: 'mdi-ticket', title: 'Packages Bookings' }
          break
        case 'activitiesBookings':
          title = { icon: 'mdi-hail', title: 'Adventures Bookings' }
          break
        case 'cruisesBookings':
          title = { icon: 'mdi-hail', title: 'Cruises Bookings' }
          break
        case 'hotelsBookings':
          title = { icon: 'mdi-hail', title: 'Hotels Bookings' }
          break
      }
      return title
    },
    filterText (name, search, item) {
      return name != null &&
        search != null &&
        typeof name === 'string' &&
        name.toString().indexOf(search) !== -1
    },
    pagesNum () {
      const num = this.total / 15
      const total = Math.ceil(num)
      return total
    },
    pageNumber (num) {
      this.$emit('pageNum', num)
    },
    goToRoute (id) {
      let route
      if (this.type === 'tours') route = 'editPackage'
      else if (this.type === 'hotels') route = 'hotel'
      this.$router.push({ name: route, params: { id: id } })
    }
  }
}
</script>
