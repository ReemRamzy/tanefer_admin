<template>
    <div>
        <v-btn class="mx-5 my-5" fab color="white" @click="bar = true" v-if="$vuetify.breakpoint.smAndDown">
            <v-icon color="orange">mdi-menu</v-icon>
        </v-btn>
        <v-navigation-drawer
            color="blue"
            v-model="bar"
            src="../assets/img/bg.png"
            dark
            :permanent="$vuetify.breakpoint.mdAndUp"
            app
            class="side"
        >

            <v-list
            dense
            nav
            class="py-0 pt-3"
            >
                <v-list-item v-if="$store.state.user">
                    <v-list-item-avatar>
                        <v-avatar color="orange" size="48">
                            <span class="white--text mr-2 headline">{{$store.state.user.name.charAt(0).toUpperCase()}}</span>
                        </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                color="white --text"
                                text
                                v-on="on"
                                >
                                  {{$store.state.user.name}}
                                  <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="logout">
                                <v-list-item-title>Logout</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-list-item-content>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item
                    link
                    to="/"
                    color="white"
                >
                    <v-list-item-icon>
                        <v-icon color="white">mdi-view-dashboard</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title class="white--text"><span class="white--text">Dashboard</span></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <!-- <v-list-group
                    prepend-icon="mdi-airplane"
                    :value="false"
                    color="white"
                    v-if="$store.state.user.role.includes('admin')"
                >
                    <template v-slot:activator>
                        <v-list-item-title>Flights</v-list-item-title>
                    </template>
                    <v-list-item
                        link
                        to="/airports"
                        color="white"
                        class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-airport</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Airports</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                        link
                        to="/airlines"
                        class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-airplane-takeoff</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Airlines</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group> -->
                <!-- <v-list-group
                prepend-icon="mdi-ticket-confirmation-outline"
                :value="false"
                color="white"
                >
                    <template v-slot:activator>
                        <v-list-item-title>Bookings</v-list-item-title>
                    </template>
                    <v-list-item
                    link
                    to="/pnr"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-airplane</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Flight Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/hotels-bookings"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-domain</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Hotels Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/cars-bookings"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-car</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Cars Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group> -->
                <v-list-group
                prepend-icon="mdi-beach"
                :value="true"
                color="white"
                >
                    <template v-slot:activator>
                        <v-list-item-title>Packages</v-list-item-title>
                    </template>
                    <v-list-item
                    link
                    to="/trip-cities"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-city</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Trips' Cities</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/trip-tours"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-beach</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Packages</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/hotels"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-bed</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Hotels</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/seasons"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-calendar</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Hotels Seasons</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/activities"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-hail</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Adventures</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>

                <v-list-item
                    link
                    to="/cruises"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-ferry</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Cruises</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                <!-- <v-list-item
                link
                to="/users"
                v-if="$store.state.user.role.includes('admin')"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-account-multiple</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Users</v-list-item-title>
                    </v-list-item-content>
                </v-list-item> -->
                <!-- <v-list-item
                link
                to="/activity"
                v-if="$store.state.user.role.includes('admin')"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-view-list</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Activity Log</v-list-item-title>
                    </v-list-item-content>
                </v-list-item> -->
                <v-list-group
                prepend-icon="mdi-ticket"
                :value="false"
                color="white"
                >
                    <template v-slot:activator>
                        <v-list-item-title>Bookings</v-list-item-title>
                    </template>
                    <v-list-item
                    link
                    to="/package/bookings"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-ticket</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Package Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/adventures/bookings"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-ticket</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Adventures Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/cruises/bookings"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-ticket</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Cruises Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/hotels/bookings"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-ticket</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Hotels Bookings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <!-- <v-list-item
                    link
                    to="/profits"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-currency-usd</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Profits Settings</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                    link
                    to="/applications"
                    class="pl-5"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-web</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Applications</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item> -->
                </v-list-group>
                <v-list-item
                link
                to="/setting-seo"
                >
                    <v-list-item-icon>
                        <v-icon>mdi-web</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>SEO</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
   </div>
</template>

<script>
import { headers, logout } from '../links'
export default {
  data () {
    return {
      bar: true,
      breakpoint: ''
    }
  },
  watch: {
    breakpoint (val) {
      if (val.smAndDown) this.bar = false
      if (val.mdAndUp) {
        this.bar = true
      }
    }
  },
  methods: {
    logout () {
      this.$http.post(logout, null, { headers: headers(this.$cookies.get('userToken')) }).then(() => {
        this.$store.dispatch('removeUser')
        this.$cookies.remove('userToken')
        localStorage.removeItem('token')
        this.$router.push({ name: 'login' })
      })
    }
  },
  created () {
    this.breakpoint = this.$vuetify.breakpoint
  }
}
</script>

<style scoped>
    .side {
        box-shadow: 2px 0px 2px grey;
    }
</style>
