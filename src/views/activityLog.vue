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
        <v-card class="px-3 pt-5 my-5">
          <v-container>
            <v-row justify="space-between">
              <v-select
              :items="admins"
              label="Filter Users"
              clearable
              item-text="name"
              item-value="id"
              height="50"
              return-object
              solo
              :menu-props="{nudgeTop: -50}"
              v-model="selectedAdmin"
              class="mr-1"
              >
              </v-select>
              <v-btn
              :loading="filterLoad"
              color="orange"
              dark
              height="50"
              @click="applyFilters"
              >
                Filterate
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
        <grid
        :loading="loading"
        :items="logs"
        :headers="logHeaders"
        type="logs"
        >
        </grid>
    </v-container>
</template>

<script>
import { headers, listActivities, listAdmins } from '../links'
import grid from '../components/tables.vue'

export default {
  components: {
    grid
  },
  data () {
    return {
      logs: [],
      admins: [],
      selectedAdmin: { name: 'All', id: 'all' },
      logHeaders: [
        { text: 'User Name', value: 'user_name' },
        { text: 'Action Made', value: 'action' },
        { text: 'Parameters', value: 'params', width: '50%' },
        { text: 'Date', value: 'date' }
      ],
      loading: true,
      filterLoad: false,
      snackbar: false,
      color: '',
      text: ''
    }
  },
  methods: {
    getActivities () {
      this.loading = true
      let term = ''
      if (this.selectedAdmin && this.selectedAdmin.id !== 'all') term = `?user_id=${this.selectedAdmin.id}`
      this.$http.get(listActivities(term), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status) {
          this.logs = response.body.data
        }
        this.loading = false
        this.filterLoad = false
      }, () => {
        this.loading = false
        this.filterLoad = false
      })
    },
    applyFilters () {
      this.filterLoad = true
      this.getActivities()
    }
  },
  created () {
    this.$http.get(listAdmins, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status) {
        this.admins = response.body.data
        this.admins.push({ name: 'All', id: 'all' })
      }
    })
    this.getActivities()
  }
}
</script>
