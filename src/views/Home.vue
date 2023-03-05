<template>
    <div>
        <v-container>
            <!-- <v-row v-if="$store.state.user">
                <v-col cols="12" sm="3" v-if="$store.state.user.role.includes('admin')">
                    <v-card
                    @click="$router.push({name: 'airlines'})"
                    color="blue"
                    class="card-background"
                    max-height="130px"
                    >
                        <v-img
                        src="../assets/img/airline.jpg"
                        gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="130px"
                        >
                            <v-card-title>
                                <v-icon class="mx-auto" color="white" x-large>mdi-airplane</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                            <span class="display-1 white--text">Airlines</span>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="3" v-if="$store.state.user.role.includes('admin')">
                    <v-card
                    @click="$router.push({name: 'airports'})"
                    color="blue"
                    class="card-background"
                    max-height="130px"
                    >
                        <v-img
                        src="../assets/img/airport.jpg"
                        gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="130px"
                        >
                            <v-card-title>
                                <v-icon class="mx-auto" color="white" x-large>mdi-airport</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-1 white--text">Airport</span>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="3" v-if="$store.state.user.role.includes('admin')">
                    <v-card
                    @click="$router.push({name: 'pnr'})"
                    color="blue"
                    class="card-background"
                    max-height="130px"
                    >
                        <v-img
                        src="../assets/img/ticket.jpg"
                        gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="130px"
                        >
                            <v-card-title>
                                <v-icon class="mx-auto" color="white" x-large>mdi-view-list</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-1 white--text">PNRs</span>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-card
                    @click="$router.push({name: 'points'})"
                    color="blue"
                    class="card-background"
                    max-height="130px"
                    >
                        <v-img
                        src="../assets/img/points.jpg"
                        gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="130px"
                        >
                            <v-card-title>
                                <v-icon class="mx-auto" color="white" x-large>mdi-seal-variant</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-1 white--text">Points</span>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row> -->
            <v-row>
                <v-col cols="12" sm="6">
                    <v-card
                    @click="$router.push({name: 'hotels'})"
                    color="blue"
                    class="card-background"
                    max-height="150px"
                    >
                        <v-img
                        src="../assets/img/hotel.jpg"
                        gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="150px"
                        >
                            <v-card-title>
                                <v-icon class="mx-auto" color="white" x-large>mdi-bed</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-1 white--text">Hotels</span>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-card
                    @click="$router.push({name: 'tripsTours'})"
                    color="blue"
                    class="card-background"
                    max-height="150px"
                    >
                        <v-img
                        src="../assets/img/trip.jpg"
                        gradient="to top, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="150px"
                        >
                            <v-card-title>
                                <v-icon class="mx-auto" color="white" x-large>mdi-beach</v-icon>
                            </v-card-title>
                            <v-card-text class="text-center">
                                <span class="display-1 white--text">Packages</span>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
    .card-background {
        background: #4b6cb7;
        background: -webkit-linear-gradient(to top, #2F80C2, #2f5cc7);
        background: linear-gradient(to top, #2F80C2, #2f5cc7);
    }
</style>
