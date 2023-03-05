import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    airlines: [],
    blockedAirlines: [],
    airports: [],
    blockedAirports: [],
    countries: [],
    cities: [],
    pnrStatus: [],
    hotelStatus: [],
    carStatus: [],
    hotelPaymentStatuses: [],
    airlineCountry: {},
    airportCountry: {},
    airportCity: {},
    user: null,
    childPolicies: null
  },
  mutations: {
    setAirlines (state, payload) {
      state.airlines = payload
    },
    setBlockedAirlines (state, payload) {
      state.blockedAirlines = payload
    },
    setAirlineCountry (state, payload) {
      state.airlineCountry = payload
    },
    setAirports (state, payload) {
      state.airports = payload
    },
    setBlockedAirports (state, payload) {
      state.blockedAirports = payload
    },
    setCountries (state, payload) {
      state.countries = payload
    },
    setCities (state, payload) {
      state.cities = payload
    },
    setAirportCountry (state, payload) {
      state.airportCountry = payload
    },
    setAirportCity (state, payload) {
      state.airportCity = payload
    },
    setStatus (state, payload) {
      state.pnrStatus = payload
    },
    setHotelStatus (state, payload) {
      state.hotelStatus = payload
    },
    setHotelPaymentStatuses (state, payload) {
      state.hotelPaymentStatuses = payload
    },
    setCarStatus (state, payload) {
      state.carStatus = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    removeUser (state) {
      state.user = null
    }
  },
  actions: {
    setAirlines (context, payload) {
      context.commit('setAirlines', payload)
    },
    setBlockedAirlines (context, payload) {
      context.commit('setBlockedAirlines', payload)
    },
    setAirlineCountry (context, payload) {
      context.commit('setAirlineCountry', payload)
    },
    setAirports (context, payload) {
      context.commit('setAirports', payload)
    },
    setBlockedAirports (context, payload) {
      context.commit('setBlockedAirports', payload)
    },
    setCountries (context, payload) {
      context.commit('setCountries', payload)
    },
    setCities (context, payload) {
      context.commit('setCities', payload)
    },
    setAirportCountry (context, payload) {
      context.commit('setAirportCountry', payload)
    },
    setAirportCity (context, payload) {
      context.commit('setAirportCity', payload)
    },
    setStatus (context, payload) {
      context.commit('setStatus', payload)
    },
    setHotelStatus (context, payload) {
      context.commit('setHotelStatus', payload)
    },
    setHotelPaymentStatuses (context, payload) {
      context.commit('setHotelPaymentStatuses', payload)
    },
    setCarStatus (context, payload) {
      context.commit('setCarStatus', payload)
    },
    setUser (context, payload) {
      context.commit('setUser', payload)
    },
    removeUser (context) {
      context.commit('removeUser')
    }
  },
  modules: {
  }
})
