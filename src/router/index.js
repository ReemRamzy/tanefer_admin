import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import login from '../views/login.vue'
import resetPassword from '../views/resetPassword.vue'
import unauth from '../views/403.vue'
import empty from '../views/404.vue'

// hotels
import hotels from '../views/hotels/hotels.vue'
import hotel from '../views/hotels/hotel.vue'
import hotelPolicies from '../views/hotels/hotelPolicies.vue'
import addHotel from '../views/hotels/addHotel.vue'
import seasons from '../views/hotels/seasons.vue'

// activities
import activities from '../views/activities/activities.vue'
import adventuresBookings from '../views/activities/adventuresBookings.vue'
import activityBooking from '../views/activities/activityBooking.vue'

// cruises
import cruises from '../views/cruises/list.vue'
import addCruise from '../views/cruises/form.vue'
import cruise from '../views/cruises/cruise.vue'

// trips
import tripsCities from '../views/trips/cities.vue'
import tripsTours from '../views/trips/tours.vue'
import tour from '../views/trips/tour.vue'
import tripBookings from '../views/trips/packageBookings.vue'
import packageBooking from '../views/trips/packageBooking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: resetPassword
  },

  // hotels
  {
    path: '/hotels',
    name: 'hotels',
    component: hotels
  },
  {
    path: '/hotel/:id',
    name: 'hotel',
    component: hotel
  },
  {
    path: '/add-hotel',
    name: 'addHotel',
    component: addHotel
  },
  {
    path: '/children-policies/:type/:id/:occupancy',
    name: 'hotelPolicies',
    component: hotelPolicies
  },
  {
    path: '/seasons',
    name: 'seasons',
    component: seasons
  },

  // activities
  {
    path: '/activities',
    name: 'activities',
    component: activities
  },
  {
    path: '/adventures/bookings',
    name: 'adventuresBookings',
    component: adventuresBookings
  },
  {
    path: '/activity/booking/:id',
    name: 'activityBooking',
    component: activityBooking
  },

  // tours
  {
    path: '/trip-cities',
    name: 'tripsCities',
    component: tripsCities
  },
  {
    path: '/trip-tours',
    name: 'tripsTours',
    component: tripsTours
  },
  {
    path: '/trip-tour/:id',
    name: 'tour',
    component: tour
  },
  // {
  //   path: '/adventures/bookings',
  //   name: 'adventuresBookings',
  //   component: adventuresBookings
  // },
  {
    path: '/package/bookings',
    name: 'tripBookings',
    component: tripBookings
  },
  {
    path: '/package/booking/:id',
    name: 'packageBooking',
    component: packageBooking
  },
  {
    path: '/cruises',
    name: 'cruises',
    component: cruises
  },
  {
    path: '/cruises/add',
    name: 'addCruise',
    component: addCruise
  },
  {
    path: '/cruise/:id',
    name: 'cruise',
    component: cruise
  },

  // error pages
  {
    path: '/unauth',
    name: 'unauth',
    component: unauth
  },
  {
    path: '*',
    name: '404',
    component: empty
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
