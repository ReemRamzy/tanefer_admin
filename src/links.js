const tanefer = process.env.NODE_ENV === 'development' ? 'https://be.tanefer.com/api' : 'https://be.tanefer.com/api'
const url = process.env.NODE_ENV === 'development' ? 'https://be.tanefer.com/api/v2' : 'https://be.tanefer.com/api/v2'

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

// activities
export const allActivities = (rowPerPage, page) => `${url}/admin/activities?row_per_page=${rowPerPage}&page=${page}`
export const removeActivity = (id) => `${url}/admin/activities/${id}`
export const addActivity = `${url}/admin/activities`
export const updateActivity = (id) => `${url}/admin/activities/${id}`
export const activitiesBookings = `${url}/admin/activities-bookings`

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
export const packageBookings = `${url}/admin/packages/bookings`
export const bookingDetails = (id) => `${url}/admin/bookingDetails/${id}`
export const slug = (term) => `${url}/admin/packages/slug-availability?slug=${term}`
// headers
export function headers(token) {
  return { Authorization: 'Bearer ' + token, Accept: 'application/json', 'Content-type': 'application/json' }
}

export function headersNoAuth() {
  return { Accept: 'application/json', 'Content-Type': 'application/json' }
}
