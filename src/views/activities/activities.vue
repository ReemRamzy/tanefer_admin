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
    :items="activities"
    :headers="activityHeaders"
    type="activities"
    :loading="loading"
    :page="page"
    :total="totalActivities"
    @pageNum="changePage"
    @removeActivity="showDeletionDialog"
    @editActivity="editActivity"
    @addActivity="actionType = 'add'; editingActivity = null; addDialog = true; "
    @showActivity="showActivity"
    />

    <v-dialog max-width="1000" v-model="addDialog">
        <actForm :data="editingActivity" :type="actionType" @close="addDialog = false" @added="closeDialog" />
    </v-dialog>
    <v-dialog max-width="1000" v-model="editDialog">
        <actForm :data="editingActivity" :type="actionType" @close="editDialog = false" @added="closeDialog" />
    </v-dialog>
    <v-dialog max-width="700" v-model="removeActivityDialog">
      <v-card>
        <v-card-title>Are you sure you want to delete this item ?</v-card-title>
        <v-divider class="my-2"></v-divider>
        <v-card-actions>
          <v-btn color="warning" text @click="removeActivityDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" tile @click="removeActivity">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <v-dialog max-width="700" v-model="showActivityDialog">
          <v-card v-if="activity">
              <v-card-title class="orange--text">
                  <v-row justify="space-between">
                      <div>{{activity.activityTitle}} <sub class="grey--text">/ {{activity.activityType}}</sub></div>
                      <span class="headline">${{activity.activityPricePerPerson}} <sub>/person</sub></span>
                  </v-row>
              </v-card-title>
              <v-card-text>
                  <p><v-icon>mdi-map-marker</v-icon>{{activity.activityCity.CityName}}</p>
                  <v-row v-if="activity.activityImages.length" class="my-3">
                    <v-img v-for="image in activity.activityImages" :key="image[0]" :src="image[0]" max-width="150" class="rounded-lg d-flex ma-3"></v-img>
                  </v-row>
                  <p v-html="activity.activityOverview"></p>
                  <v-divider class="my-1"></v-divider>
                  <p class="body-1 mt-3 gray">Activity Excludes</p>
                  <v-chip-group
                  column
                  >
                    <v-chip v-for="item in activity.activityExcludes" :key="item"><span v-if="item !== ''">{{item}}</span></v-chip>
                  </v-chip-group>
                  <v-divider class="my-1"></v-divider>
                  <p class="body-1 mt-3 gray">Activity Includes</p>
                  <v-chip-group
                  column
                  >
                      <v-chip v-for="item in activity.activityIncludes" :key="item"><span v-if="item !== ''">{{item}}</span></v-chip>
                  </v-chip-group>
                  <v-divider v-if="activity.sideActivity" class="my-1"></v-divider>
                  <p v-if="activity.sideActivity" class="body-1 mt-3 gray">Side Activity</p>
                  <v-simple-table dense v-if="activity.sideActivity.length > 0">
                    <template v-slot:default>
                      <thead>
                          <tr>
                              <th class="text-left">
                                  Title
                              </th>
                              <th class="text-left">
                                  Time
                              </th>
                              <th class="text-left">
                                  Day Number
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr
                          v-for="(item, i) in activity.sideActivity"
                          :key="i"
                          >
                              <td>{{ item.activityName }}</td>
                              <td>{{ item.activityTime }}</td>
                              <td>{{ item.activityDayNumber }}</td>
                          </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="warning" @click="showActivityDialog = false">Close</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import { allActivities, removeActivity, headers } from '../../links'
import grid from '../../components/tables.vue'
import actForm from '../../components/activityForm.vue'

export default {
  components: { grid, actForm },
  data () {
    return {
      activities: [],
      page: 1,
      totalActivities: 0,
      itemsPerRow: 15,
      addDialog: false,
      editDialog: false,
      actionType: 'add',
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      activityHeaders: [
        { text: 'Title', value: 'activityTitle' },
        { text: 'City', value: 'activityCity.CityName' },
        { text: 'Duration', value: 'activityDuration_digits' },
        { text: 'Published', value: 'published' },
        { text: 'Edit', value: 'editAct' },
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
    showActivity (item) {
      this.activity = item
      this.showActivityDialog = true
    },
    getActivities (rows, page) {
      this.loading = true
      this.$http.get(allActivities(rows, page), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.body.status === 200) {
          this.activities = response.body.data.ActivityList
          this.totalActivities = response.body.data.ActivityTotal
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
    editActivity (item) {
      this.actionType = 'edit'
      this.editingActivity = item
      this.editDialog = true
    },
    closeDialog () {
      this.getActivities(15, 1)
      this.page = 1
      this.editDialog = false
      this.addDialog = false
    },
    showDeletionDialog (id) {
      this.deletedItemId = id
      this.removeActivityDialog = true
    },
    removeActivity () {
      this.$http.delete(removeActivity(this.deletedItemId), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.removeActivityDialog = false
        if (response.body.status === 200) {
          this.getActivities(15, 1)
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
    },
    changePage (num) {
      this.getActivities(15, num)
      this.page = num
    }
  },
  created () {
    this.getActivities(15, 1)
    this.page = 1
  }
}
</script>
