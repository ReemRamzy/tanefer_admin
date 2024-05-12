<template>
    <div>
        <div class="text-center my-10" v-if="loading">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </div>
        <p v-if="!loading && !bookingDetails" class="my-10 text-center">Couldn't get the booking details <router-link
                to="/">Back home</router-link> </p>
        <v-container v-if="!loading && bookingDetails">
            <v-row justify="space-between" class="headline px-5 my-5 primary--text font-weight-black">
                <v-col cols="11" class="d-flex">
                    <v-img v-if="bookingDetails.package.packageImage" class="mr-5 rounded-lg"
                        :src="bookingDetails.package.packageImage" max-width="150"></v-img>
                    <span>
                        {{ bookingDetails.package.packageTitle }}
                        <br>
                        <span v-if="bookingDetails.package.start_date" class="caption grey--text">
                            {{ new Date(bookingDetails.package.start_date.replaceAll('-', '/')).toDateString() }}
                        </span>
                        <details class="mt-5">
                            <summary class="body-1">overview <v-icon>mdi-chevron-down</v-icon></summary>
                            <p class="body-2 black--text" v-html="bookingDetails.package.overview"></p>
                        </details>
                    </span>
                </v-col>
                <span class="grey--text">$ {{ bookingDetails.total_price }}</span>
            </v-row>

            <v-expansion-panels>
                <v-expansion-panel v-if="bookingDetails.package.packageIncludes">
                    <v-expansion-panel-header>
                        Includes
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-if="!Array.isArray(bookingDetails.package.packageIncludes)">
                            <p v-for="item in bookingDetails.package.packageIncludes.replaceAll('[', '').replaceAll(']', '').split(',')"
                                :key="item"><v-icon>mdi-check</v-icon> {{ item }}</p>
                        </div>
                        <div v-else>
                            <p v-for="item in bookingDetails.package.packageIncludes" :key="item"><v-icon>mdi-check</v-icon>
                                {{ item }}</p>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-if="bookingDetails.package.packageExcludes">
                    <v-expansion-panel-header>
                        Excludes
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-if="!Array.isArray(bookingDetails.package.packageExcludes)">
                            <p v-for="item in bookingDetails.package.packageExcludes.replaceAll('[', '').replaceAll(']', '').split(',')"
                                :key="item"><v-icon>mdi-check</v-icon> {{ item }}</p>
                        </div>
                        <div v-else>
                            <p v-for="item in bookingDetails.package.packageExcludes" :key="item"><v-icon>mdi-check</v-icon>
                                {{ item }}</p>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-card outlined>
                <v-card-title class="primary--text">Booking Info</v-card-title>

                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Adults
                                </th>
                                <th class="text-left">
                                    Children
                                </th>
                                <th class="text-left">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left">
                                    {{ bookingDetails.adults }}
                                </td>
                                <td class="text-left">
                                    {{ bookingDetails.children }}
                                </td>
                                <td class="text-left">
                                    <span v-if="bookingDetails.status === 'pending payment' && checkHasCruise === true">
                                        <v-btn
                                            tile
                                            :loading="btnLoad"
                                            :disabled="disableButtonEmail"
                                            color="blue white--text"
                                            @click="sendEmail"
                                        >
                                            Accept
                                        </v-btn>
                                    </span>
                                    <span v-else>
                                        {{bookingDetails.status}}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-divider></v-divider>

                <v-card-title class="primary--text">Contact Info</v-card-title>

                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Phone
                                </th>
                                <th class="text-left">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left">
                                    {{ bookingDetails.booking_data.contact_name }}
                                </td>
                                <td class="text-left">
                                    {{ bookingDetails.booking_data.contact_name }}
                                </td>
                                <td class="text-left">
                                    {{ bookingDetails.booking_data.contact_email }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-divider></v-divider>

                <v-card-title class="primary--text">Travellers</v-card-title>

                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Title
                                </th>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Gender
                                </th>
                                <th class="text-left">
                                    Birth Date
                                </th>
                                <th class="text-left">
                                    Passport Number
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in bookingDetails.booking_traveler" :key="item.id">
                                <td class="text-left">
                                    {{ item.passengerTitle || '-' }}
                                </td>
                                <td class="text-left">
                                    {{ item.passengerFirstName + ' ' + item.passengerLastName }}
                                </td>
                                <td class="text-left">
                                    {{ item.passengerGender }}
                                </td>
                                <td class="text-left">
                                    {{ new Date(item.date_of_birth.replaceAll('-', '/')).toDateString() }}
                                </td>
                                <td class="text-left">
                                    {{ item.passport_number }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>

                <v-card-title class="primary--text">Activities Details</v-card-title>

                <div v-for="(activity, i) in bookingDetails.package.activities" :key="i">
                    <v-expansion-panels v-model="panelExpandedActivities[i]" focusable class="mb-5">
                        <v-expansion-panel style="border-radius: 18px;">
                            <v-expansion-panel-header class="font-weight-bold text-h6 change-icon-style"
                                style="border-radius: 8px;">
                                <v-row v-if="activity.type === 'adventure'">
                                    <v-col lg="6" md="6" sm="6">
                                        {{ activity.cityname }}
                                    </v-col>
                                    <v-col lg="6" md="6" sm="6">
                                        <span style="float: right;">
                                            <span class="quantity text-center font-weight-bold">{{ activity.days_number }}
                                                days</span>
                                        </span>
                                    </v-col>
                                </v-row>
                                <v-row v-else>
                                    <v-col cols="12">
                                        {{ activity.cityname }}
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="my-8">
                                <div v-if="activity.type === 'adventure'">
                                    <v-card v-for="(day, x) in activity.days" :key="x" class="my-2">
                                        <v-card-title class="white--text" style="background-color: #4f3316;">
                                            Day <span v-if="day.start_day !== null"> {{ day.start_day }}</span> <span
                                                v-if="packageStartDay !== null" class="ml-4">{{ day.start_text_day }}</span>
                                        </v-card-title>
                                        <v-card-text class="pt-4">
                                            <v-row>
                                                <v-col cols="12">
                                                    <div v-if="day.days.length > 0">
                                                        <div v-for="(adventures, adventureIndex) in day.days"
                                                            :key="adventureIndex">
                                                            <div v-if="adventures.adventrue">
                                                                <v-row>
                                                                    <v-col cols="12">
                                                                        {{ adventures.adventrue.activityTitle }}
                                                                    </v-col>
                                                                </v-row>
                                                            </div>
                                                            <v-divider class="my-2" />
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        You Have Free Time
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>
                                <div v-else>
                                    <v-card class="my-2">
                                        <v-card-title class="white--text"
                                            style="background-color: #4f3316;display: flow-root;">
                                            <span class="float-left">Day {{ activity.package_day }}</span> <span
                                                v-if="packageStartDay !== null" class="ml-4">{{ activity.package_text_day
                                                }}</span> <span class="float-right">Nile Cruise</span>
                                        </v-card-title>
                                        <v-card-text class="pt-4">
                                            <v-row>
                                                <v-col cols="12">
                                                    <div v-for="(cruise, c) in activity.cruise" :key="c">
                                                        <v-row class="">
                                                            <v-col v-if="cruise.master_image" cols="12" md="4" class="pt-4">
                                                                <v-img max-height="350" :src="cruise.master_image"
                                                                    max-width="250" class="rounded-lg" />
                                                            </v-col>
                                                            <v-col cols="10" :md="cruise.master_image ? 6 : 10">
                                                                <div class="cruise-result-trip justify-space-between pt-4">
                                                                    <div>
                                                                        <h5 class="text-h5 font-weight-bold">
                                                                            {{ cruise.name }}
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>

                <v-divider></v-divider>

                <v-card-title class="primary--text">Hotels</v-card-title>

                <div v-for="(hotel, h) in bookingDetails.booking_hotels" :key="h">
                    <v-expansion-panels v-model="panelExpandedHotels[h]" focusable class="mb-5">
                        <v-expansion-panel style="border-radius: 18px;">
                            <v-expansion-panel-header class="font-weight-bold text-h6 change-icon-style"
                                style="border-radius: 8px;">
                                <v-row>
                                    <v-col cols="12">
                                        {{ hotel.hotel.name }}
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="my-8">
                                <div>
                                    <v-card class="my-2">
                                        <v-card-title class="white--text"
                                            style="background-color: #4f3316;display: flow-root;">
                                            <span class="float-left">Hotel JPD Code {{ hotel.hotel.Jpd_code }}</span>                                        </v-card-title>
                                        <v-card-text class="pt-4">
                                            <v-row class="">
                                                <v-col cols="12">
                                                    <div class="cruise-result-trip justify-space-between pt-4">
                                                        <div>
                                                            <h5 class="text-h5 font-weight-bold">
                                                                Address: {{ hotel.hotel.address }}
                                                            </h5>
                                                            <h5 class="text-h5 font-weight-bold">
                                                                Start Date: {{ hotel.start_date }}
                                                            </h5>
                                                            <h5 class="text-h5 font-weight-bold">
                                                                End Date: {{ hotel.end_date }}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>

                <v-divider></v-divider>
            </v-card>

            <v-card class="mt-5" v-for="city in bookingDetails.booking_city" :key="city.city_id" outlined>
                <v-card-title class="primary--text">
                    {{ city.city.name + ' ' + city.nights_number + ' nights' }}
                </v-card-title>
                <v-card-text>
                    <v-row v-if="city.package_hotel">
                        <v-col cols="12" md="3">
                            <v-img height="100%" :src="city.package_hotel.image" v-if="city.package_hotel"
                                class="rounded-lg"></v-img>
                        </v-col>
                        <v-col cols="12" md="9">
                            <div>
                                <div class="headline font-weight-bold mb-2">{{ city.package_hotel.name }}</div>
                                <div class="body-1 mb-2"><v-icon>mdi-map-marker</v-icon> {{ city.package_hotel.address }}
                                </div>
                                <div class="body-1" v-html="city.package_hotel.description"></div>
                            </div>
                            <v-btn tile color="primary"
                                @click="packageHotelDetails = city.package_hotel; room = city.package_hotel_room; showHotelDetails = true;">Show
                                Rooms</v-btn>
                        </v-col>
                    </v-row>

                    <v-expansion-panels class="mt-5" dense outlined v-if="city.booking_city_activity.length">
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Activities
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-timeline>
                                    <v-timeline-item v-for="(activity, i) in city.booking_city_activity" :key="'act' + i"
                                        color="primary" small>
                                        <template v-slot:opposite>
                                            <span :class="`headline font-weight-bold primary--text`"
                                                v-text="'Day ' + activity.day_number"></span>
                                        </template>
                                        <v-card class="pa-4">
                                            <v-img :src="activity.package_activity.image" class="rounded-lg"></v-img>
                                            <h3 :class="`headline font-weight-light mb-4 primary--text`">
                                                {{ activity.package_activity.title }}
                                            </h3>
                                            <h4 :class="`headline font-weight-light mb-4 primary--text`">
                                                {{ activity.package_activity.activity_type }}
                                                {{ activity.package_activity.duration_digits + ' ' +
                                                    activity.package_activity.duration_type }}
                                            </h4>
                                            <div>
                                                <details class="mt-5">
                                                    <summary class="body-1">overview <v-icon>mdi-chevron-down</v-icon>
                                                    </summary>
                                                    <p class="body-2 black--text"
                                                        v-html="activity.package_activity.overview"></p>
                                                </details>
                                                <details class="mt-5">
                                                    <summary class="body-1">Includes <v-icon>mdi-chevron-down</v-icon>
                                                    </summary>
                                                    <div v-if="!Array.isArray(activity.package_activity.includes)">
                                                        <p v-for="(item, i) in activity.package_activity.includes.replaceAll('[', '').replaceAll(']', '').split(',')"
                                                            :key="i"><v-icon>mdi-check</v-icon> {{ item }}</p>
                                                    </div>
                                                    <div v-else>
                                                        <p v-for="(item, i) in activity.package_activity.includes" :key="i">
                                                            <v-icon>mdi-check</v-icon> {{ item }}
                                                        </p>
                                                    </div>
                                                </details>
                                                <details class="mt-5">
                                                    <summary class="body-1">Excludes <v-icon>mdi-chevron-down</v-icon>
                                                    </summary>
                                                    <div v-if="!Array.isArray(activity.package_activity.excludes)">
                                                        <p v-for="(item, i) in activity.package_activity.excludes.replaceAll('[', '').replaceAll(']', '').split(',')"
                                                            :key="i"><v-icon>mdi-check</v-icon> {{ item }}</p>
                                                    </div>
                                                    <div v-else>
                                                        <p v-for="(item, i) in activity.package_activity.excludes" :key="i">
                                                            <v-icon>mdi-check</v-icon> {{ item }}
                                                        </p>
                                                    </div>
                                                </details>
                                            </div>
                                        </v-card>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>

            <v-dialog v-model="showHotelDetails" fullscreen>
                <v-card v-if="packageHotelDetails" tile>
                    <v-card-title class="primary white--text">
                        <v-btn icon color="white" large @click="showHotelDetails = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        Hotel Details
                    </v-card-title>
                    <v-img :src="packageHotelDetails.image" max-height="200"></v-img>
                    <v-card-text class="pa-5">
                        <v-row justify="space-between" align="end">
                            <div>
                                <h3>{{ packageHotelDetails.name }}</h3>
                                <p class="grey--text"><v-icon>mdi-map-marker</v-icon> {{ packageHotelDetails.address }}</p>
                                <p class="grey--text"><v-icon>mdi-phone</v-icon> {{ packageHotelDetails.phone }}</p>
                            </div>
                            <div>
                                <v-rating v-model="packageHotelDetails.stars" background-color="orange lighten-3"
                                    color="orange"></v-rating>
                            </div>
                        </v-row>
                        <p v-html="packageHotelDetails.description"></p>
                        <v-row justify="space-around">
                            <div>
                                <h4>Facilities</h4>
                                <div v-if="!Array.isArray(packageHotelDetails.facilities)">
                                    <p v-for="item in packageHotelDetails.facilities.replaceAll('[', '').replaceAll(']', '').split(',')"
                                        :key="item"><v-icon>mdi-check</v-icon> {{ item }}</p>
                                </div>
                                <div v-else>
                                    <p v-for="item in packageHotelDetails.facilities" :key="item"><v-icon>mdi-check</v-icon>
                                        {{ item }}</p>
                                </div>
                            </div>
                            <div>
                                <h4>Policies</h4>
                                <div v-if="!Array.isArray(packageHotelDetails.policies)">
                                    <p v-for="item in packageHotelDetails.policies.replaceAll('[', '').replaceAll(']', '').split(',')"
                                        :key="item"><v-icon>mdi-check</v-icon> {{ item }}</p>
                                </div>
                                <div v-else>
                                    <p v-for="item in packageHotelDetails.policies" :key="item"><v-icon>mdi-check</v-icon>
                                        {{ item }}</p>
                                </div>
                            </div>
                        </v-row>

                        <v-card class="mb-3">
                            <h4>Room</h4>
                            <v-card-title class="primary white--text">{{ room.type }}, {{ room.occupancy }}</v-card-title>
                            <v-card-text class="pa-3">
                                <v-row justify="space-around">
                                    <div>
                                        <h4>Aminities</h4>
                                        <div v-if="!Array.isArray(room.amenities)">
                                            <p v-for="item in room.amenities.replaceAll('[', '').replaceAll(']', '').split(',')"
                                                :key="item"><v-icon>mdi-check</v-icon> {{ item }}</p>
                                        </div>
                                        <div v-else>
                                            <p v-for="item in room.amenities" :key="item"><v-icon>mdi-check</v-icon>
                                                {{ item }}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4>Inclusions</h4>
                                        <div v-if="!Array.isArray(room.inclusions)">
                                            <p v-for="item in room.inclusions.replaceAll('[', '').replaceAll(']', '').split(',')"
                                                :key="item"><v-icon>mdi-check</v-icon> {{ item }}</p>
                                        </div>
                                        <div v-else>
                                            <p v-for="item in room.inclusions" :key="item"><v-icon>mdi-check</v-icon>
                                                {{ item }}</p>
                                        </div>
                                    </div>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="showAdventureDetailsDialog" max-width="900" content-class="rounded-xl hide-overflow"
                scrollable>
                <v-card>
                    <v-card-title class="white--text" style="background-color: #4f3316;">
                        Adventure Details
                        <v-btn text color="white" style="background-color: transparent;border: 1px solid #fff;color: #fff;"
                            elevation="4" icon small absolute right class="float-right"
                            @click="showAdventureDetailsDialog = false">
                            <v-icon color="white">
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <div v-if="adventureDetails !== null">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <div>
                                        <v-card class="mb-5" style="border-radius: 15px;">
                                            <v-card-text>
                                                <v-row class="">
                                                    <v-col v-if="adventureDetails.activityImages.length" cols="12" md="4"
                                                        class="pt-4">
                                                        <v-img max-height="350" :src="adventureDetails.activityImages[0][0]"
                                                            max-width="250" class="rounded-lg" />
                                                    </v-col>
                                                    <v-col cols="10" :md="adventureDetails.activityImages.length ? 6 : 10">
                                                        <div class="cruise-result-trip justify-space-between pt-4">
                                                            <div>
                                                                <h5 class="text-h5 font-weight-bold">
                                                                    {{ adventureDetails.activityTitle }}
                                                                </h5>
                                                            </div>
                                                            <div class="black--text">
                                                                <h5 class="text-h5 font-weight-bold">
                                                                    Start from ${{ adventureDetails.activityPricePerPerson
                                                                    }} per person
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" md="12">
                                                        <!-- eslint-disable-next-line vue/no-v-html -->
                                                        <v-tabs v-model="tab" color="deep-black accent-4">
                                                            <v-tab href="#intro">
                                                                Intro
                                                            </v-tab>
                                                            <v-tab href="#itinerary">
                                                                Itinerary
                                                            </v-tab>
                                                            <v-tab href="#notes">
                                                                Notes
                                                            </v-tab>
                                                        </v-tabs>
                                                        <v-tabs-items v-model="tab">
                                                            <v-tab-item :value="'intro'">
                                                                <v-card flat>
                                                                    <v-card-text>
                                                                        <div class="mb-3"
                                                                            v-html="adventureDetails.activityIntro" />
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-tab-item>
                                                            <v-tab-item :value="'itinerary'">
                                                                <v-card flat>
                                                                    <v-card-text>
                                                                        <div class="mb-3"
                                                                            v-html="adventureDetails.activityItinerary" />
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-tab-item>
                                                            <v-tab-item :value="'notes'">
                                                                <v-card flat>
                                                                    <v-card-text>
                                                                        <div class="mb-3"
                                                                            v-html="adventureDetails.activityOverview" />
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-tab-item>
                                                        </v-tabs-items>
                                                        <div class="trips-cityname" style="margin: 10px 0;">
                                                            <v-expansion-panels>
                                                                <v-expansion-panel
                                                                    v-if="adventureDetails.activityIncludes.length">
                                                                    <v-expansion-panel-header>
                                                                        Includes
                                                                    </v-expansion-panel-header>
                                                                    <v-expansion-panel-content>
                                                                        <span
                                                                            v-for="(include, i) in adventureDetails.activityIncludes"
                                                                            :key="i">
                                                                            <v-chip label large color="#F6F6F6"
                                                                                class="my-1 px-4 ma-2 py-2">{{ include
                                                                                }}</v-chip>
                                                                        </span>
                                                                    </v-expansion-panel-content>
                                                                </v-expansion-panel>
                                                            </v-expansion-panels>
                                                        </div>
                                                        <div>
                                                            <v-expansion-panels>
                                                                <v-expansion-panel
                                                                    v-if="adventureDetails.activityExcludes.length">
                                                                    <v-expansion-panel-header>
                                                                        Excludes
                                                                    </v-expansion-panel-header>
                                                                    <v-expansion-panel-content>
                                                                        <span
                                                                            v-for="(exclude, i) in adventureDetails.activityExcludes"
                                                                            :key="i">
                                                                            <v-chip label large color="#F6F6F6"
                                                                                class="my-1 px-4 ma-2 py-2">{{ exclude
                                                                                }}</v-chip>
                                                                        </span>
                                                                    </v-expansion-panel-content>
                                                                </v-expansion-panel>
                                                            </v-expansion-panels>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-else class="my-5 text-center">
                            Not selected adventure!
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="showCruiseDetailsDialog" max-width="900" content-class="rounded-xl hide-overflow" scrollable>
                <v-card>
                    <v-card-title class="white--text" style="background-color: #4f3316;">
                        Cruise Details
                        <v-btn text color="white" style="background-color: transparent;border: 1px solid #fff;color: #fff;"
                            elevation="4" icon small absolute right class="float-right"
                            @click="showCruiseDetailsDialog = false">
                            <v-icon color="white">
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text class="pt-4">
                        <div v-if="cruiseDetails !== null">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-card class="pa-3">
                                        <v-row>
                                            <v-col cols="12" md="6">
                                                <v-img :src="image" height="200" class="rounded" />
                                            </v-col>
                                            <v-col cols="12" md="6" class="d-flex flex-wrap">
                                                <v-img v-for="(item, i) in cruiseDetails.images" :key="i" :src="item.image"
                                                    height="70" width="70" class="rounded ma-1 gallery-image"
                                                    @click="image = item.image" />
                                            </v-col>
                                        </v-row>
                                        <v-card-title class="d-flex justify-space-between flex-wrap align-cener px-0 py-0">
                                            {{ cruiseDetails.name }}
                                            <v-rating background-color="green lighten-2" color="warning" dense
                                                empty-icon="mdi-star-outline" full-icon="mdi-star" length="5" readonly
                                                size="15" :value="cruiseDetails.stars" />
                                        </v-card-title>
                                        <v-card-subtitle class="py-0 px-0 my-1">
                                            Cruise Line: {{ cruiseDetails.cruise_line }} / Ship: {{ cruiseDetails.ship_name
                                            }} / Nights: {{ cruiseDetails.number_of_nights }} / Cities:
                                            <span v-for="(item, i) in cruiseDetails.cities" :key="i">{{ item.name + ', '
                                            }}</span>
                                        </v-card-subtitle>
                                        <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
                                        <v-card-text class="px-0" v-html="cruiseDetails.description" />
                                        <div v-if="cruiseDetails.available_dates.length">
                                            <h6>This Crusise is available to book during the following dates:</h6>
                                            <div v-for="(season, k) in cruiseDetails.available_dates" :key="k">
                                                <p><strong>From</strong> {{ new Date(season.start_date.replaceAll('-',
                                                    '/')).toDateString() }} <strong>To</strong> {{ new
        Date(season.end_date.replaceAll('-', '/')).toDateString() }} </p>
                                            </div>
                                        </div>
                                        <div v-if="cruiseDetails.includes.length">
                                            <p class="text-h6">
                                                Includes
                                            </p>
                                            <v-chip v-for="(item, i) in cruiseDetails.includes" :key="i" class="ma-1">
                                                {{ item }}
                                            </v-chip>
                                        </div>
                                        <div v-if="cruiseDetails.excludes.length">
                                            <p class="text-h6">
                                                Excludes
                                            </p>
                                            <v-chip v-for="(item, i) in cruiseDetails.excludes" :key="i" class="ma-1">
                                                {{ item }}
                                            </v-chip>
                                        </div>
                                        <div v-if="cruiseDetails.facilities.length">
                                            <p class="text-h6">
                                                Facilities
                                            </p>
                                            <v-chip v-for="(item, i) in cruiseDetails.facilities" :key="i" class="ma-1">
                                                {{ item }}
                                            </v-chip>
                                        </div>
                                        <div v-if="cruiseDetails.policies.length">
                                            <p class="text-h6">
                                                Policies
                                            </p>
                                            <v-chip v-for="(item, i) in cruiseDetails.policies" :key="i" class="ma-1">
                                                {{ item }}
                                            </v-chip>
                                        </div>
                                        <div v-if="cruiseDetails.start_days.length">
                                            <p class="text-h6">
                                                Start Days
                                            </p>
                                            <v-chip v-for="(item, i) in cruiseDetails.start_days" :key="i" class="ma-1">
                                                {{ item }}
                                            </v-chip>
                                        </div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-else class="my-5 text-center">
                            Not selected cruise!
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
import { bookingDetails, headers, sendEmailCruise } from '../../links'

export default {
  data () {
    return {
      bookingDetails: null,
      showHotelDetails: false,
      packageHotelDetails: null,
      room: null,
      loading: true,
      startingDay: 0,
      panelExpandedActivities: [],
      panelExpandedHotels: [],
      showAdventureDetailsDialog: false,
      showCruiseDetailsDialog: false,
      packageStartDay: null,
      adventureDetails: null,
      cruiseDetails: null,
      checkHasCruise: false,
      disableButtonEmail: false
    }
  },
  created () {
    this.$http.get(bookingDetails(this.$route.params.id), { headers: headers(this.$cookies.get('userToken')) }).then(res => {
      this.bookingDetails = res.body.bookingDetails
      this.calcDaysFromDetails()
    }).catch(() => { }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    formatDateAllDays (date, num, type = null) {
      if (!date) { return null }
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (type === 'default') {
        const newDate = `${year}-${month}-${parseInt(day) + parseInt(num) - 1}`
        return newDate
      } else {
        const newDate = `${parseInt(day) + parseInt(num) - 1} ${months[month - 1]} ${year}`
        return newDate
      }
    },
    calcDaysFromDetails () {
      this.startingDay = 0
      this.packageStartDay = this.bookingDetails.start_date
      const activities = this.bookingDetails.package.activities
      for (let i = 0; i < activities.length; i++) {
        if (activities[i].type === 'adventure') {
          const activity = activities[i].days
          for (let x = 0; x < activity.length; x++) {
            activity[x].start_day = ++this.startingDay
            activity[x].start_format_day = this.formatDateAllDays(this.packageStartDay, activity[x].start_day, 'default')
            activity[x].start_text_day = this.formatDateAllDays(this.packageStartDay, activity[x].start_day)
          }
        } else {
          const startDay = this.startingDay + 1
          this.startingDay += activities[i].days_number
          const endDay = this.startingDay
          activities[i].package_day = startDay + '-' + endDay
          activities[i].package_text_day = this.packageStartDay != null ? (this.formatDateAllDays(this.packageStartDay, startDay) + ' - ' + this.formatDateAllDays(this.packageStartDay, endDay)) : null
          activities[i].start_day = startDay
          activities[i].end_day = endDay
          this.checkHasCruise = true
        }
      }
    },
    sendEmail () {
      const formData = new FormData()
      formData.append('book_id', this.bookingDetails.id)
      formData.append('price', this.bookingDetails.total_price)
      formData.append('status', 'accept')

        this.$http.post(sendEmailCruise, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.btnLoad = false
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'Email was Sent'
            this.disableButtonEmail = true
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
            this.disableButtonEmail = false
          }
        }, err => {
          this.snackbar = true
          this.color = 'error'
          this.text = err.body.message
          this.btnLoad = false
      })
    }
  }
}
</script>

<style>
/* .v-dialog__content--active {
    z-index: 10001 !important;
} */
</style>
