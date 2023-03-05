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
                {{type === 'add' ? 'Add Application' : 'Update Application'}}
            </v-card-title>
            <v-card-text>
                <v-form
                ref="form"
                v-model="valid"
                v-on:submit.prevent
                >
                    <v-text-field
                    label="Name"
                    v-model="app.name"
                    type="text"
                    prepend-icon="mdi-web"
                    :rules="[v => !!v || 'Name is required']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="URL or Secret"
                    v-model="app.urlOrSecret"
                    type="text"
                    prepend-icon="mdi-link-variant"
                    :rules="[v => !!v || 'URL or Secret is required']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Terms URL"
                    v-model="app.termsUrl"
                    type="text"
                    prepend-icon="mdi-link-variant"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Email"
                    v-model="app.email"
                    type="email"
                    prepend-icon="mdi-email"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Email To"
                    v-model="app.emailTo"
                    type="email"
                    prepend-icon="mdi-email"
                    :rules="[v => !!v || 'Email To is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Email CC"
                    v-model="app.emailCc"
                    type="email"
                    prepend-icon="mdi-email"
                    :rules="[v => !v || /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                    color="orange"
                    >
                    </v-text-field>
                    <p class="body-2" v-if="app.parentClient && type === 'edit'">Current main app is {{app.parentClient}}</p>
                    <v-select
                    :items="apps"
                    v-model="app.clientId"
                    :label="app.parentClient ? 'Change Main APP' : 'Main APP'"
                    item-text="name"
                    item-value="id"
                    outlined
                    :menu-props="{nudgeTop: -50}"
                    >
                    </v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="warning" text @click="closeDialog">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="orange" :loading="addLoading" @click="type === 'add' ? addApp() : editApp()" text>{{type === 'add' ? 'Add App' : 'Update'}}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { headers, listClients, addClient, updateClient } from '../links'

export default {
  props: ['currentApp', 'emails', 'type'],
  data () {
    return {
      apps: [],
      app: {
        name: '',
        urlOrSecret: '',
        email: '',
        termsUrl: '',
        clientId: '',
        emailTo: '',
        emailCc: ''
      },
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
    addApp () {
      this.$refs.form.validate()
      if (this.valid) {
        this.addLoading = true
        this.$http.post(addClient, this.app, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.addLoading = false
          this.$refs.form.reset()
          this.$refs.form.resetValidation()
          if (response.body.status) {
            this.$emit('newApp', response.body.data)
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
    },
    editApp () {
      this.$refs.form.validate()
      if (this.valid) {
        this.addLoading = true
        this.$http.put(updateClient(this.app.id), this.app, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.addLoading = false
          if (response.body.status) {
            this.$emit('newApp', response.body.data)
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
      this.loading = false
      if (response.body.status) this.apps = response.body.data
      if (this.type === 'edit') {
        this.apps.forEach(app => {
          if (app.id === this.currentApp) {
            this.app = app
            this.app.emailTo = this.emails.to
            this.app.emailCc = this.emails.cc
          }
        })
      }
    })
  }
}
</script>
