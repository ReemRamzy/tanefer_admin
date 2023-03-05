<template>
  <div class="login-bg">
    <v-container fluid class="pa-0">
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
        <v-row style="height: 100vh;" justify="center" align="center">
            <v-card :width="$vuetify.breakpoint.smAndDown ? '90%' : '40%'">
                <v-card-title class="pt-2 pb-2">
                    <v-img class="mx-auto" contain width="150px" height="150px" src="../assets/tanfer.png"></v-img>
                </v-card-title>
                <v-card-text>
                    <v-form
                    ref="form"
                    v-model="valid"
                    v-on:submit.prevent
                    >
                        <v-text-field
                        label="Email"
                        v-model="email"
                        type="email"
                        prepend-icon="mdi-email"
                        :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                        color="orange"
                        >
                        </v-text-field>
                        <v-text-field
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        label="Password"
                        v-model="password"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                        prepend-icon="mdi-lock"
                        :rules="[v => !!v || 'Password is required', v => v.length >= 8 || 'Password must be at least 8 characters']"
                        color="orange"
                        >
                        </v-text-field>
                    </v-form>
                    <v-row justify="space-between">
                      <v-btn text color="blue" small @click="dialog = true" class="mt-5">Forgot your password ?</v-btn>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" id="submit-btn" tile color="orange white--text" @click="login" :disabled="!valid" :loading="loading">Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
    <v-dialog
    v-model="dialog"
    width="500"
    >

      <v-card>
          <v-card-title
          class="orange white--text"
          primary-title
          >
              Forgot your password ?
              <v-spacer></v-spacer>
              <v-btn icon color="white" @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-card-title>
          <v-form
          ref="form1"
          v-model="valid1"
          v-on:submit.prevent
          >
              <v-card-text>
                  Enter your email and we will send you a code that you can reset your password with
                  <v-text-field
                  label="Email"
                  v-model="email1"
                  type="email"
                  prepend-icon="mdi-email"
                  :rules="[v => !!v || 'Email is required', v => /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(v) || 'E-mail must be valid']"
                  color="orange"
                  autocomplete="off"
                  >
                  </v-text-field>
              </v-card-text>

              <v-card-actions>
              <v-btn
                  color="orange"
                  tile
                  block
                  class="white--text"
                  type="submit"
                  :disabled="!valid1"
                  :loading="loading1"
                  @click="send"
              >
                  Send
              </v-btn>
              </v-card-actions>
          </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { login, resetPasswordCode, headersNoAuth } from '../links'

export default {
  data () {
    return {
      valid: true,
      valid1: true,
      loading: false,
      loading1: false,
      snackbar: false,
      color: '',
      text: '',
      show: false,
      email: '',
      email1: '',
      password: '',
      dialog: false
    }
  },
  methods: {
    send () {
      this.loading1 = true
      this.$refs.form1.validate()
      if (this.valid1) {
        this.$http.post(resetPasswordCode, { email: this.email1 }, { headers: headersNoAuth() }).then(response => {
          if (response.body.status === false) {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
            this.loading1 = false
          } else {
            this.$router.push({ name: 'resetPassword', params: { email: this.email1 } })
          }
        })
      }
    },
    login () {
      this.loading = true
      this.$refs.form.validate()
      if (this.valid) {
        const body = {
          email: this.email,
          password: this.password,
          role: 'admin'
        }
        this.$http.post(login, body, { headers: headersNoAuth() }).then(response => {
          this.loading = false
          if (response.body.status === true) {
            this.$store.dispatch('setUser', response.body.data.user)
            this.$cookies.set('userToken', response.body.data.token.access_token, response.body.data.token.expires_in)
            localStorage.setItem('userRoles', response.body.data.user.role.split(','))
            setTimeout(() => {
              this.$cookies.remove('userToken')
              this.$store.dispatch('removeUser')
              this.$router.push({ name: 'login' })
            }, response.body.data.token.expires_in * 1000)
            // this.$http.get(countries, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
            //   if (response.body.status !== false) {
            //     this.$store.dispatch('setCountries', response.body.data)
            //   }
            // })
            // this.$http.get(cities, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
            //   if (response.body.status !== false) {
            //     this.$store.dispatch('setCities', response.body.data)
            //   }
            // })
            if (this.prevRoute) this.$router.go(-1)
            else this.$router.push({ name: 'Home' })
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
      } else {
        this.loading = false
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please fill all fields'
      }
    }
  },
  created () {
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.login()
      }
    })
  },
  beforeDestroy () {
    document.removeEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.login()
      }
    })
  }
}
</script>

<style>
  .login-bg {
    background: #ECE9E6;
    background: -webkit-linear-gradient(to right, #FFFFFF, #ECE9E6);
    background: linear-gradient(to right, #FFFFFF, #ECE9E6);
  }
</style>
