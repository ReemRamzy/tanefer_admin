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
        @removeCruise="showDeletionDialog"
        />
        <v-dialog max-width="700" v-model="removeActivityDialog">
          <v-card>
            <v-card-title>Are you sure you want to delete this cruise ?</v-card-title>
            <v-divider class="my-2"></v-divider>
            <v-card-actions>
              <v-btn color="warning" text @click="removeActivityDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" tile @click="removeCruise">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { cruises, removeCruise, headers } from '../../links'
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
        { text: 'Stars', value: 'stars' },
        { text: 'Remove', value: 'removeAct' }
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
      this.getCruises(15, num)
      this.page = num
    },
    showDeletionDialog (id) {
      this.deletedItemId = id
      this.removeActivityDialog = true
    },
    removeCruise () {
      this.$http.delete(removeCruise(this.deletedItemId), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.removeActivityDialog = false
        if (response.body.status === 200) {
          this.getCruises(15, 1)
          this.snackbar = true
          this.color = 'success'
          this.text = 'Deleted Successfully'
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
      })
    }
  },
  created () {
    this.getCruises(15, 1)
    this.page = 1
  }
}
</script>
