<template>
    <v-container class="pb-5">
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
              :items="roles"
              label="User Role"
              clearable
              item-text="name"
              item-value="name"
              height="50"
              solo
              :menu-props="{nudgeTop: -50}"
              v-model="role"
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
        :items="users"
        :headers="usersHeaders"
        type="users"
        :loading="loading"
        :length="lastPage"
        :page="currentPage"
        :total="totalPages"
        @takeActions="takeAction"
        @openDialog="addDialog = true"
        @pageNum="changePage"
        />
        <v-dialog v-model="addDialog" max-width="500px" persistent>
            <userForm type="add" @closeDialog="addDialog = false" @newUser="getUsers('')" />
        </v-dialog>
    </v-container>
</template>

<script>
import { headers, userRoles, listusers, blockUser, unblockUser } from '../links'
import grid from '../components/tables.vue'
import userForm from '../components/userForm.vue'

export default {
  components: {
    grid,
    userForm
  },
  data () {
    return {
      users: [],
      roles: [],
      role: null,
      loading: true,
      snackbar: false,
      filterLoad: false,
      color: '',
      text: '',
      usersHeaders: [
        { text: 'Name', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Role', value: 'role' },
        { text: 'Points', value: 'points' },
        { text: 'Points In Dollars', value: 'pointsToAmount' },
        { text: 'Active', value: 'manage', sortable: false }
      ],
      addDialog: false,
      totalPages: 0,
      currentPage: 0,
      currentURL: null,
      lastPage: 0
    }
  },
  methods: {
    takeAction (type, id) {
      let url = ''
      if (type === 'blockUser') url = blockUser
      else url = unblockUser
      this.$http.post(url(id), null, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === true) {
          this.snackbar = true
          this.color = 'success'
          this.text = response.body.message
          this.users = response.body.data
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, () => {
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong please try again in few seconds'
      })
    },
    applyFilters () {
      this.filterLoad = true
      if (this.role) this.getUsers(`page=1&per_page=15&role=${this.role}`)
      else {
        this.filterLoad = false
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please select a role'
      }
    },
    getUsers (term) {
      this.loading = true
      this.$http.get(listusers(term), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        this.filterLoad = false
        if (response.body.status === true) {
          this.users = response.body.data.data
          this.currentPage = response.body.data.current_page
          this.currentURL = response.body.data.current_url
          this.lastPage = response.body.data.last_page
          this.totalPages = response.body.data.total
        }
      }, () => {
        this.loading = false
        this.filterLoad = false
        this.snackbar = true
        this.color = 'error'
        this.text = 'Something went wrong'
      })
    },
    changePage (page) {
      const term = this.currentURL.split('?')
      term[1] += `&page=${page}`
      this.getUsers(term[1])
    }
  },
  created () {
    this.getUsers('page=1&per_page=15')
    this.$http.get(userRoles, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status) this.roles = response.body.data
    })
  }
}
</script>
