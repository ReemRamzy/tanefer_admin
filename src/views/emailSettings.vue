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
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-data-table
                    :headers="headers"
                    :items="mails"
                    item-key="id"
                    :items-per-page="15"
                    :loading="loading"
                    loading-text="Loading... Please wait"
                    >
                        <template v-slot:item.edit="{ item }">
                            <v-btn text color="blue" @click="openForm(item)"><v-icon left>mdi-pencil</v-icon>Update</v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="500">
            <v-card class="pa-5">
                <v-form
                ref="form"
                v-model="valid"
                v-on:submit.prevent
                >
                    <v-text-field
                    label="Email To"
                    v-model="emailTo"
                    type="email"
                    prepend-icon="mdi-email"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-text-field
                    label="Email CC"
                    v-model="emailCC"
                    type="email"
                    prepend-icon="mdi-email"
                    :rules="[v => (v.length === 0 || /.+@.+\..+/.test(v)) || 'E-mail must be valid']"
                    color="orange"
                    >
                    </v-text-field>
                    <v-card-actions>
                        <v-btn block type="submit" tile color="orange white--text" @click="update" :disabled="!valid" :loading="updateLoad">Update</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { listMais, headers, updateMail } from '../links'
export default {
  data () {
    return {
      mails: [],
      loading: true,
      updateLoad: false,
      valid: true,
      dialog: false,
      snackbar: false,
      color: '',
      text: '',
      emailTo: '',
      emailCC: '',
      headers: [
        { text: 'Website', value: 'client.name' },
        { text: 'URL', value: 'client.url' },
        { text: 'Email To', value: 'to' },
        { text: 'Email CC', value: 'cc' },
        { text: 'Actions', value: 'edit', sortable: false }
      ]
    }
  },
  methods: {
    openForm (item) {
      this.emailTo = item.to
      this.emailCC = item.cc
      this.mailId = item.id
      this.clientId = item.client_id
      this.dialog = true
    },
    update () {
      this.$refs.form.validate()
      if (this.valid) {
        this.updateLoad = true
        const body = {
          to: this.emailTo,
          cc: this.emailCC,
          client_id: this.clientId
        }
        this.$http.put(updateMail(this.mailId), body, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          if (response.body.status) {
            this.mails.forEach(mail => {
              if (mail.id === this.mailId) {
                mail.to = response.body.data.to
                mail.cc = response.body.data.cc
              }
            })
            this.snackbar = true
            this.color = 'success'
            this.text = response.body.message
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
          this.updateLoad = false
          this.dialog = false
        }, () => {
          this.updateLoad = false
          this.snackbar = true
          this.color = 'error'
          this.text = 'Something Went wrong please try again in few seconds'
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill required fields'
      }
    }
  },
  created () {
    this.$http.get(listMais, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      this.loading = false
      if (response.body.status) {
        this.mails = response.body.data
      }
    }, () => {
      this.loading = false
    })
  }
}
</script>
