<template>
    <v-card>
      <v-card-title primary-title class="orange--text">
        <v-icon color="orange" class="mr-5">mdi-account-group</v-icon>
        Users
        <v-spacer></v-spacer>
        <v-btn
          color="blue white--text"
          class="mr-5"
          elevation="0"
          @click="$emit('addUser')"
        >
          <v-icon left>mdi-plus</v-icon>
          Add User
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="users"
          item-key="id"
          :items-per-page="15"
          :loading="loading"
          loading-text="Loading... Please wait"
          :search="search"
          :single-select="false"
          :show-select="true"
          :dense="true"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
            ></v-text-field>
          </template>

          <!-- Mapping user data to table -->
          <template v-slot:item.username="{ item }">
            <div>{{ item.username }}</div>
          </template>
          <template v-slot:item.email="{ item }">
            <div>{{ item.email }}</div>
          </template>
          <template v-slot:item.phone="{ item }">
            <div>{{ item.phone }}</div>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn text color="blue" @click="$emit('viewUser', item)">
              <v-icon left>mdi-eye</v-icon> View
            </v-btn>
            <v-btn text color="error" @click="$emit('removeUser', item.id)">
              <v-icon left>mdi-trash-can-outline</v-icon> Remove
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-subheader>Page {{ currentPage }}</v-subheader>
        <v-spacer></v-spacer>
        <v-pagination
          v-model="currentPage"
          circle
          :length="pagesNum()"
          :page="currentPage"
          total-visible="15"
          @input="pageNumber"
        ></v-pagination>
      </v-card-actions>
    </v-card>
  </template>

<script>
import { registeredUsers, headers } from '../links'

export default {
  data () {
    return {
      search: '',
      selected: [],
      currentPage: 1,
      users: [],
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      snackbar: false,
      color: '',
      text: '',
      loading: false
    }
  },
  methods: {
    getUsers () {
      this.loading = true
      this.$http.get(registeredUsers, { headers: headers(this.$cookies.get('userToken')) })
        .then(response => {
          // Assuming response.data is the correct place to get the users
          this.users = response.body.data || []
        })
        .catch(err => {
          this.snackbar = true
          this.color = 'error'
          this.text = err.body.message || 'Error fetching users'
        })
        .finally(() => {
          this.loading = false
        })
    },
    pagesNum () {
      // Assuming 'total' is the total number of items
      const num = this.users.length / 15
      return Math.ceil(num)
    },
    pageNumber (num) {
      this.currentPage = num
      this.$emit('pageNum', num)
    }
  },
  created () {
    this.getUsers()
  }
}
</script>
