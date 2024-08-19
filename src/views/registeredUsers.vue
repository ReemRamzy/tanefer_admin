<template>
    <v-card>
      <v-card-title primary-title class="orange--text">
        <v-icon color="orange" class="mr-5">mdi-account-group</v-icon>
        Users
        <!-- <v-spacer></v-spacer>
        <v-btn
          color="blue white--text"
          class="mr-5"
          elevation="0"
          @click="$emit('addUser')"
        >
          <v-icon left>mdi-plus</v-icon>
          Add User
        </v-btn> -->
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
            <v-btn text color="blue" @click="showUser(item)">
              <v-icon left>mdi-eye</v-icon> View
            </v-btn>
            <v-btn text color="error" @click="showDeletionDialog(item.id)">
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
      <v-dialog max-width="700" v-model="removeUserDialog">
        <v-card>
          <v-card-title>Are you sure you want to delete this item?</v-card-title>
          <v-divider class="my-2"></v-divider>
          <v-card-actions>
            <v-btn color="warning" text @click="removeUserDialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" tile @click="removeUser">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog max-width="700" v-model="showUserDialog">
        <v-card v-if="user">
          <v-card-title class="orange--text">
            <v-row justify="space-between">
              <div>Profile Information</div>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row class="mt-4">
              <v-col cols="12" v-if="user.username">
                <p class="body-1"><strong>Username: </strong>{{ user.username }}</p>
              </v-col>
              <v-col cols="12" v-if="user.email">
                <p class="body-1"><strong>Email: </strong>{{ user.email }}</p>
              </v-col>
              <v-col cols="12" v-if="user.phone">
                <p class="body-1"><strong>Phone: </strong>{{ user.phone }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.passenger_gender">
                <p class="body-1"><strong>Gender: </strong>{{ user.passenger_gender }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.passenger_title">
                <p class="body-1"><strong>Title: </strong>{{ user.passenger_title }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.passenger_first_name">
                <p class="body-1"><strong>First Name: </strong>{{ user.passenger_first_name }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.passenger_last_name">
                <p class="body-1"><strong>Last Name: </strong>{{ user.passenger_last_name }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.date_of_birth">
                <p class="body-1"><strong>Birthday: </strong>{{ user.date_of_birth }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.pass_num">
                <p class="body-1"><strong>Passport Number: </strong>{{ user.pass_num }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.pass_expire_date">
                <p class="body-1"><strong>Passport Expire Date: </strong>{{ user.pass_expire_date }}</p>
              </v-col>
              <v-col cols="12" md="6" v-if="user.issue_country">
                <p class="body-1"><strong>Issuing Country: </strong>{{ user.issue_country }}</p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="warning" @click="showUserDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </template>

<script>
import { registeredUsers, deleteUser, headers } from '../links'

export default {
  data () {
    return {
      search: '',
      selected: [],
      currentPage: 1,
      users: [],
      user: null,
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      snackbar: false,
      color: '',
      text: '',
      loading: false,
      showUserDialog: false,
      removeUserDialog: false
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
    },
    showUser (item) {
      this.user = item
      this.showUserDialog = true
    },
    showDeletionDialog (id) {
      this.deletedItemId = id
      this.removeUserDialog = true
    },
    removeUser () {
      this.$http.delete(deleteUser(this.deletedItemId), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.removeUserDialog = false
        if (response.body.status === 200) {
          this.getUsers()
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
    this.getUsers()
  }
}
</script>
