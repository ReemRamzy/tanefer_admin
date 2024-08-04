// const tanefer = process.env.NODE_ENV === 'development' ? 'https://be.tanefer.com/api' : 'https://be.tanefer.com/api'
// const url = process.env.NODE_ENV === 'development' ? 'https://be.tanefer.com/api/v2' : 'https://be.tanefer.com/api/v2'
// const tanefer = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : 'http://localhost:8000/api'
// const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/v2' : 'http://localhost:8000/api/v2'
// const tanefer = process.env.NODE_ENV === 'development' ? 'https://tanefer.nahrdev.com/api' : 'https://tanefer.nahrdev.com/api'
// const url = process.env.NODE_ENV === 'development' ? 'https://tanefer.nahrdev.com/api/v2' : 'https://tanefer.nahrdev.com/api/v2'
const tanefer = process.env.NODE_ENV === 'development' ? 'https://api.tanefer.com/api' : 'https://api.tanefer.com/api'
const url = process.env.NODE_ENV === 'development' ? 'https://api.tanefer.com/api/v2' : 'https://api.tanefer.com/api/v2'

// login
export const login = `${tanefer}/user/login`
export const logout = `${tanefer}/user/logout`
export const profile = `${tanefer}/user/profile`
export const resetPasswordCode = `${tanefer}/reset-password-code`
export const resetPassword = `${tanefer}/reset-password`

// trips
// trips citites
export const tripCities = `${url}/admin/cities`
export const tripCity = (id) => `${url}/admin/cities/${id}`
export const getAirports = (city) => `${url}/admin/tour/city/airportAutocomplete?term=${city}`

// hotels
export const allHotels = (rowPerPage, page) => `${url}/admin/hotel?row_per_page=${rowPerPage}&page=${page}`
export const addHotel = `${url}/admin/hotel/store`
export const removeHotel = (id) => `${url}/admin/hotel/${id}/delete`
export const showHotel = (id) => `${url}/admin/hotel/${id}/show`
export const updateHotel = (id) => `${url}/admin/hotel/${id}/update`
export const hotelSeasons = `${url}/admin/season`
export const addHotelSeasons = `${url}/admin/season/store`
export const removeHotelSeasons = (id) => `${url}/admin/season/${id}/delete`
export const editHotelSeasons = (id) => `${url}/admin/season/${id}/update`
export const formLists = `${url}/admin/hotel/form-lists`
export const childPolicy = `${url}/admin/hotel/children`
export const hotelsBookings = `${url}/admin/hotels-bookings`
export const cancelReservation = `${url}/packages/get-cancel-booking`

// activities
// update row_per_page to solve the search issue temp-sloution
export const allActivities = (rowPerPage, page) => `${url}/admin/activities?row_per_page=100&page=${page}`
export const removeActivity = (id) => `${url}/admin/activities/${id}`
export const addActivity = `${url}/admin/activities`
export const updateActivity = (id) => `${url}/admin/activities/${id}`
export const activitiesBookings = `${url}/admin/activities-bookings`

// cruises
export const cruises = (rowPerPage, page) => `${url}/admin/cruises?row_per_page=${rowPerPage}&page=${page}`
export const storeCruise = `${url}/admin/cruises/store`
export const cruise = (id) => `${url}/admin/cruises/${id}`
export const updateCruise = (id) => `${url}/admin/cruises/${id}/update`
export const removeCruise = (id) => `${url}/admin/cruises/${id}/delete`
export const cruisesBookings = `${url}/admin/cruises-bookings`
export const sendEmailCruise = `${url}/admin/cruises/send_email`

// packages
export const allPackages = (rowPerPage, page) => `${url}/admin/packages?row_per_page=${rowPerPage}&page=${page}`
export const addPackage = `${url}/admin/packages/add`
export const removePackage = (id) => `${url}/admin/packages/${id}/delete`
export const updatePackage = (id) => `${url}/admin/packages/${id}/update`
export const showPackage = (id) => `${url}/admin/packages/${id}/show`
export const packageLists = `${url}/admin/packages/form-lists`
export const hotelsByCityId = (id) => `${url}/admin/hotel/hotel-list?city_id=${id}`
export const roomsByHotelId = (id) => `${url}/admin/hotel/hotel-rooms?hotel_id=${id}`
export const activitiesByCityId = (id) => `${url}/admin/activities/activity/list?city_id=${id}`
export const activitiesCruiseByCityId = (id, type) => `${url}/admin/activitiescruise/activity/list?city_id=${id}&activity_type=${type}`
export const packageBookings = `${url}/admin/packages/bookings`
export const bookingDetails = (id) => `${url}/admin/bookingDetails/${id}`
export const slug = (term) => `${url}/admin/packages/slug-availability?slug=${term}`
export const gtaCountries = (id) => `${url}/packages/gta-get-country`
export const gtaCities = (id) => `${url}/packages/gta-get-city?country_code=${id}`
export const gtaHotels = (id) => `${url}/packages/gta-get-hotel?city_id=${id}`

// Settings SEO
export const settingSEOs = `${url}/admin/seo`
export const settingSEO = (id) => `${url}/admin/seo/${id}`
export const settingAddSEO = `${url}/admin/seo/add`
export const settingUpdateSEO = (id) => `${url}/admin/seo/update/${id}`

// headers
export function headers (token) {
  const tokenStorage = localStorage.getItem('token')
  const isExpired = isTokenExpired(tokenStorage)
  if (!isExpired) {
    return { Authorization: 'Bearer ' + tokenStorage, Accept: 'application/json', 'Content-type': 'application/json' }
  } else {
    return { Authorization: 'Bearer ' + token, Accept: 'application/json', 'Content-type': 'application/json' }
  }
}

export function headersNoAuth () {
  return { Accept: 'application/json', 'Content-Type': 'application/json' }
}

export function isTokenExpired (token) {
  const decodedToken = JSON.parse(atob(token.split('.')[1])) // Decode the token
  // Get the expiration time (in seconds)
  const expirationTime = decodedToken.exp
  // Get the current time (in seconds)
  const currentTime = Math.floor(Date.now() / 1000)
  // Check if the token is expired
  return currentTime > expirationTime
}
