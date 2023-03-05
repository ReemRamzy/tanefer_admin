<template>
    <v-container class="pt-5">
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
        <grid
        :loading="loading"
        :items="apps"
        :headers="appHeaders"
        type="apps"
        @takeActions="takeAction"
        @openDialog="addDialog = true"
        class="mt-5"
        >
        </grid>
        <v-dialog v-model="addDialog" max-width="500px" persistent>
            <clientForm type="add" @closeDialog="addDialog = false" @newApp="updateApps" />
        </v-dialog>
    </v-container>
</template>

<script>
import { headers, updateClientActiveStatus, listClients } from '../links'
import grid from '../components/tables.vue'
import clientForm from '../components/clientForm.vue'

export default {
  components: {
    grid,
    clientForm
  },
  data () {
    return {
      apps: [],
      appHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'URL', value: 'urlOrSecret' },
        { text: 'Terms URL', value: 'termsUrl' },
        { text: 'Email', value: 'email' },
        { text: 'Main App', value: 'parentClient' },
        { text: 'Date', value: 'createdAt' },
        { text: 'Blocked', value: 'action' }
      ],
      app: {
        name: '',
        urlOrSecret: '',
        email: '',
        termsUrl: '',
        clientId: '',
        emailTo: '',
        emailCc: ''
      },
      loading: true,
      addDialog: false,
      snackbar: false,
      color: '',
      text: '',
      valid: true,
      addLoading: false
    }
  },
  methods: {
    takeAction (type, id) {
      const body = {
        status: true
      }
      type === 'blockApp' ? body.status = true : body.status = false
      this.$http.patch(updateClientActiveStatus(id), body, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.status === 200) {
          this.snackbar = true
          this.color = 'success'
          type === 'blockApp' ? this.text = 'App blocked successfully' : this.text = 'App unblocked successfully'
        }
      })
    },
    updateApps (apps) {
      this.apps = apps
      this.snackbar = true
      this.color = 'success'
      this.text = 'Application was added successfully'
    }
  },
  created () {
    this.$http.get(listClients, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      this.loading = false
      if (response.body.status) this.apps = response.body.data
    })
  }
}
</script>
