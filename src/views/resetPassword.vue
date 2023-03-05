<template>
    <v-container>
        <v-snackbar
        :color="color"
        :timeout="3000"
        top
        multi-line
        v-model="alert"
        >
            {{text}}
        </v-snackbar>
        <v-row justify="center" style="height: 95vh" align="center">
            <v-col cols="12" sm="9" md="6">
              <v-card class="pa-5" elevation="4">
                <p class="body-1 font-weight-regular orange--text">Reset your password</p>
                <v-subheader class="font-weight-bold">An email with the reset code has been sent to you</v-subheader>
                <v-form
                ref="form"
                v-model="valid"
                v-on:submit.prevent
                >
                    <v-text-field
                    v-model="code"
                    label="Enter the reset code"
                    color="orange"
                    type="text"
                    prepend-icon="mdi-shield-check"
                    :rules="[v => !!v || 'You must enter the reset code', v => v.length >= 4 || 'Code must be more than 4 digits']"
                    class="remove-controls"
                    ></v-text-field>

                    <v-text-field
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    label="New Password"
                    v-model="password"
                    :type="show ? 'text' : 'password'"
                    @click:append="show = !show"
                    prepend-icon="mdi-lock"
                    :rules="[v => !!v || 'Password is required', v => v.length >= 8 || 'Password must be at least 8 characters']"
                    color="orange"
                    >
                    </v-text-field>

                    <v-btn type="submit" color="orange white--text" tile block @click="reset" :loading="loading">Reset Password</v-btn>
                </v-form>
              </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { resetPassword, headersNoAuth } from '../links'
export default {
  title: '-Reset Password',
  data () {
    return {
      valid: true,
      show: false,
      code: '',
      password: '',
      alert: false,
      color: '',
      text: '',
      loading: false
    }
  },
  methods: {
    reset () {
      this.loading = true
      const body = {
        token: this.code,
        password: this.password,
        email: this.$route.params.email
      }
      this.$http.post(resetPassword, body, { headers: headersNoAuth() }).then(response => {
        if (response.body.status === false) {
          this.alert = true
          this.color = 'error'
          this.text = response.body.message
          this.loading = false
        } else {
          this.alert = true
          this.color = 'success'
          this.text = 'Your password has been updated, you will be redirected to login'
          this.loading = false
          setTimeout(() => {
            this.$router.push({ name: 'login' })
          }, 3000)
        }
      })
    }
  },
  created () {
    if (!this.$route.params.email) this.$router.push({ name: 'Home' })
  }
}
</script>
