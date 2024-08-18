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
import hotelsBookings from '../views/hotels/hotelsBookings.vue'
import hotelBooking from '../views/hotels/hotelBooking.vue'

// activities
import activities from '../views/activities/activities.vue'
import adventuresBookings from '../views/activities/adventuresBookings.vue'
import activityBooking from '../views/activities/activityBooking.vue'

// cruises
import cruises from '../views/cruises/list.vue'
import addCruise from '../views/cruises/form.vue'
// import storeCruise from '../views/cruises/form.vue'
import cruise from '../views/cruises/cruise.vue'
import cruisesBookings from '../views/cruises/cruisesBookings.vue'
import cruiseBooking from '../views/cruises/cruiseBooking.vue'

// trips
import tripsCities from '../views/trips/cities.vue'
import tripsTours from '../views/trips/tours.vue'
import tour from '../views/trips/tour.vue'
import tripBookings from '../views/trips/packageBookings.vue'
import packageBooking from '../views/trips/packageBooking.vue'
import addPackage from '../views/trips/addPackage.vue'
import editPackage from '../views/trips/editPackage.vue'

// trips
import settingSeo from '../views/settings/seo.vue'

// users
import registeredUsers from '../views/registeredUsers.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
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
  {
    path: '/registeredUsers',
    name: 'registeredUsers',
    component: registeredUsers
  },
  // hotels
  {
    path: '/hotels',
    name: 'hotels',
    component: hotels,
    meta: { requiresAuth: true }
  },
  {
    path: '/hotel/:id',
    name: 'hotel',
    component: hotel,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-hotel',
    name: 'addHotel',
    component: addHotel,
    meta: { requiresAuth: true }
  },
  {
    path: '/hotels/bookings',
    name: 'hotelsBookings',
    component: hotelsBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/hotel/booking/:id',
    name: 'hotelBooking',
    component: hotelBooking,
    meta: { requiresAuth: true }
  },
  {
    path: '/children-policies/:type/:id/:occupancy',
    name: 'hotelPolicies',
    component: hotelPolicies,
    meta: { requiresAuth: true }
  },
  {
    path: '/seasons',
    name: 'seasons',
    component: seasons,
    meta: { requiresAuth: true }
  },

  // activities
  {
    path: '/activities',
    name: 'activities',
    component: activities,
    meta: { requiresAuth: true }
  },
  {
    path: '/adventures/bookings',
    name: 'adventuresBookings',
    component: adventuresBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/activity/booking/:id',
    name: 'activityBooking',
    component: activityBooking,
    meta: { requiresAuth: true }
  },

  // tours
  {
    path: '/trip-cities',
    name: 'tripsCities',
    component: tripsCities,
    meta: { requiresAuth: true }
  },
  {
    path: '/trip-tours',
    name: 'tripsTours',
    component: tripsTours,
    meta: { requiresAuth: true }
  },
  {
    path: '/trip-tour/:id',
    name: 'tour',
    component: tour,
    meta: { requiresAuth: true }
  },
  {
    path: '/add-package',
    name: 'addPackage',
    component: addPackage,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-package',
    name: 'editPackage',
    component: editPackage,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/adventures/bookings',
  //   name: 'adventuresBookings',
  //   component: adventuresBookings
  // },
  {
    path: '/package/bookings',
    name: 'tripBookings',
    component: tripBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/package/booking/:id',
    name: 'packageBooking',
    component: packageBooking,
    meta: { requiresAuth: true }
  },
  {
    path: '/cruises',
    name: 'cruises',
    component: cruises,
    meta: { requiresAuth: true }
  },
  {
    path: '/cruises/add',
    name: 'addCruise',
    component: addCruise,
    meta: { requiresAuth: true }
  },
  {
    path: '/cruise/:id',
    name: 'cruise',
    component: cruise,
    meta: { requiresAuth: true }
  },
  {
    path: '/cruises/bookings',
    name: 'cruisesBookings',
    component: cruisesBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/cruise/booking/:id',
    name: 'cruiseBooking',
    component: cruiseBooking,
    meta: { requiresAuth: true }
  },

  // Settings
  {
    path: '/setting-seo',
    name: 'settingSeo',
    component: settingSeo,
    meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  let isAuthenticated = false
  // const getCookie = this.$cookies.get('userToken')
  // console.log(token)
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])) // Decode the token
    // Get the expiration time (in seconds)
    const expirationTime = decodedToken.exp
    // Get the current time (in seconds)
    const currentTime = Math.floor(Date.now() / 1000)
    isAuthenticated = token && currentTime < expirationTime
  } else {
    isAuthenticated = token && currentTime < expirationTime
  }
  // Check if the token is expired
  // return currentTime > expirationTime;
  // console.log(currentTime < expirationTime, currentTime, expirationTime)
  // let isAuthenticated = false
  // if (token && currentTime < expirationTime) {
  //   isAuthenticated = true
  // } else {
  //   isAuthenticated = false
  // }
  // const isAuthenticated = token && currentTime < expirationTime
  // console.log(isAuthenticated, currentTime, expirationTime)
  // console.log(to)
  // console.log(to.name === 'login' && isAuthenticated)
  // console.log(to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated, to.matched.some(record => record.name), to.matched.some(record => record.meta.requiresAuth), !isAuthenticated)
  // console.log(to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated)
  // if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
  //   next({
  //     name: 'login', // Redirect to the login page if not authenticated
  //     query: { redirect: to.fullPath } // Optionally pass the original path as a query parameter
  //   })
  // } else if (to.name === 'login' && isAuthenticated) {
  //   next({ name: 'Home' })
  //   // next()
  // } else {
  //   next() // Continue with the navigation
  // }

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({
      name: 'login', // Redirect to the login page if not authenticated
      query: { redirect: to.fullPath } // Optionally pass the original path as a query parameter
    })
  } else {
    next() // Continue with the navigation
  }
})

export default router
