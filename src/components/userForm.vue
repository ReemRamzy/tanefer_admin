<template>
    <div>
        <v-snackbar
        v-model="snackbar"
        :color="color"
        :timeout="5000"
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
        <v-card>
            <v-card-title class="orange--text">
                {{type === 'add' ? 'Add User' : 'Update User'}}
            </v-card-title>
            <v-card-text>
                <v-form
                ref="form"
                v-model="valid"
                v-on:submit.prevent
                >
                    <v-text-field
                    label="Name"
                    v-model="user.name"
                    type="text"
                    prepend-icon="mdi-web"
                    :rules="[v => !!v || 'Name is required']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Email"
                    v-model="user.email"
                    type="email"
                    prepend-icon="mdi-email"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Phone"
                    v-model="user.phone"
                    type="number"
                    prepend-icon="mdi-phone"
                    :rules="[v => !!v || 'Phone is required', v => /^[0-9]*$/.test(v) || 'Phone must be numbers']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    v-if="type === 'edit'"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    label="Password"
                    v-model="user.password"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    prepend-icon="mdi-lock"
                    :rules="[v => !v || v.length >= 8 || 'Password must be at least 8 characters']"
                    color="orange"
                    >
                    </v-text-field>
                    <p class="body-2" v-if="user.client_id && type === 'edit'">Current main app is {{User.originClient}}</p>
                    <v-select
                    :items="apps"
                    v-model="user.client_id"
                    :label="user.client_id ? 'Change Main APP' : 'Main APP'"
                    item-text="name"
                    item-value="id"
                    :rules="[v => !!v || 'App is required']"
                    outlined
                    :menu-props="{nudgeTop: -50}"
                    >
                    </v-select>
                    <v-select
                    v-if="type === 'add'"
                    :items="roles"
                    v-model="user.role"
                    :label="user.role ? 'Change User roles' : 'Roles'"
                    item-text="name"
                    item-value="id"
                    outlined
                    :rules="[v => !!v || 'Role is required']"
                    :menu-props="{nudgeTop: -50}"
                    >
                    </v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="warning" text @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="orange" :loading="addLoading" @click="type === 'add' ? addUser() : editUser()" text>{{type === 'add' ? 'Add User' : 'Update'}}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { headers, listClients, addUser, updateUser, userRoles } from '../links'

export default {
  props: ['User', 'type'],
  data () {
    return {
      apps: [],
      user: {
        name: '',
        email: '',
        phone: '',
        client_id: '',
        role: ''
      },
      show: false,
      roles: [],
      snackbar: false,
      color: '',
      text: '',
      valid: true,
      addLoading: false
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
      if (this.type === 'add') {
        this.$refs.form.resetValidation()
        this.$refs.form.reset()
      }
    },
    addUser () {
      this.$refs.form.validate()
      if (this.valid) {
        this.addLoading = true
        this.$http.post(addUser, this.user, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.addLoading = false
          this.$refs.form.reset()
          this.$refs.form.resetValidation()
          if (response.body.status) {
            this.$emit('newUser')
            this.$emit('closeDialog')
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
        }, () => {
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something went wrong !'
          this.addLoading = false
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill required fields'
      }
    },
    editUser () {
      this.$refs.form.validate()
      if (this.valid) {
        this.addLoading = true
        this.$http.put(updateUser(this.user.id), this.user, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.addLoading = false
          if (response.body.status) {
            this.$emit('newUser', response.body.data)
            this.$emit('closeDialog')
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill required fields'
      }
    }
  },
  created () {
    this.$http.get(listClients, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status) this.apps = response.body.data
    }).then(() => {
      if (this.User) {
        this.apps.forEach(app => {
          if (app.name === this.User.originClient) this.user.client_id = app.id
        })
      }
    })
    this.$http.get(userRoles, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status) this.roles = response.body.data
    })
    if (this.type === 'edit') {
      this.user.name = this.User.name
      this.user.role = this.User.role
      this.user.email = this.User.email
      this.user.phone = this.User.phone
      this.user.id = this.User.id
    }
  }
}
</script>
