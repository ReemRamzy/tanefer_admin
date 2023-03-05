<template>
    <v-container>
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
        <grid
        :items="cruises"
        :headers="cruiseHeaders"
        type="cruises"
        :loading="loading"
        :page="page"
        :total="totalCruises"
        @pageNum="changePage"
        />
    </v-container>
</template>

<script>
import { cruises, headers } from '../../links'
import grid from '../../components/tables.vue'
// import actForm from '../../components/activityForm.vue'

export default {
  components: { grid },
  data () {
    return {
      cruises: [],
      page: 1,
      totalCruises: 0,
      itemsPerRow: 15,
      addDialog: false,
      editDialog: false,
      actionType: 'add',
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      cruiseHeaders: [
        { text: 'Title', value: 'name' },
        { text: 'Cruise line', value: 'cruise_line' },
        { text: 'Nights', value: 'number_of_nights' },
        { text: 'Ship name', value: 'ship_name' },
        { text: 'Stars', value: 'stars' }
      ],
      editingActivity: null,
      showActivityDialog: false,
      removeActivityDialog: false,
      deletedItemId: null,
      activity: null
    }
  },
  methods: {
    getCruises (rows, page) {
      this.loading = true
      this.$http.get(cruises(rows, page), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        console.log(response.body)
        if (response.body.status === 200) {
          this.cruises = response.body.data.CruiseList.data
          this.totalCruises = response.body.data.CruiseTotal
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
      this.getActivities(15, num)
      this.page = num
    }
  },
  created () {
    this.getCruises(15, 1)
    this.page = 1
  }
}
</script>
