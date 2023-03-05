<template>
    <v-container>
        <!-- <v-snackbar v-model="snackbar" :timeout="5000" top :color="color">
          {{text}}
          <v-spacer></v-spacer>
          <v-btn
          icon
          @click="snackbar = false"
          >
            <v-icon right>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
        <v-row justify="space-between" class="px-5">
            <h2 class="orange--text">Third parties accounts settings</h2>
            <v-switch inset color="blue" v-model="editable">
                <template v-slot:label>
                    <v-icon color="blue">mdi-pencil</v-icon> <span class="blue--text">Edit Props</span>
                </template>
            </v-switch>
        </v-row>
        <v-card class="pa-5 mb-5" v-for="(item, i) in thirdParties" :key="item.id">
            <h3 class="orange--text mb-5">{{item.third_party_type.toUpperCase()}}</h3>
            <v-row class="px-5">
                <v-text-field
                v-model="thirdParties[i].username"
                label="User Name"
                color="orange"
                :readonly="!editable"
                outlined
                class="mr-2"
                ></v-text-field>
                <v-text-field
                v-model="thirdParties[i].password"
                label="Password"
                color="orange"
                :readonly="!editable"
                outlined
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                 @click:append="showPassword = !showPassword"
                class="mr-2"
                ></v-text-field>
                <v-text-field
                v-model="thirdParties[i].additional_attr"
                label="Additional Attribute"
                color="orange"
                :readonly="!editable"
                outlined
                ></v-text-field>
            </v-row>
            <v-card-actions v-if="editable">
                <v-spacer></v-spacer>
                <v-btn :loading="btnLoads[i]" tile color="success" @click="updateProp(i)">
                    Update Property
                </v-btn>
            </v-card-actions>
        </v-card> -->
    </v-container>
</template>

<script>
// import { headers, listThirdParties, updateThirdParties } from '../links'

// export default {
//   data () {
//     return {
//       thirdParties: [],
//       btnLoads: [],
//       snackbar: false,
//       color: '',
//       text: '',
//       editable: false,
//       showPassword: false
//     }
//   },
//   methods: {
//     updateProp (i) {
//       this.btnLoads[i] = true
//       this.$http.put(updateThirdParties(this.thirdParties[i].id), this.thirdParties[i], { headers: headers(this.$cookies.get('userToken')) }).then(response => {
//         this.btnLoads[i] = false
//         if (response.body.status === true) {
//           this.snackbar = true
//           this.color = 'success'
//           this.text = `${this.thirdParties[i].third_party_type} Property was updated successfully`
//         } else {
//           this.snackbar = true
//           this.color = 'error'
//           this.text = response.body.message
//         }
//       }, () => {
//         this.snackbar = true
//         this.color = 'error'
//         this.text = 'Something went wrong please try again in few seconds'
//       })
//     }
//   },
//   created () {
//     this.$http.get(listThirdParties, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
//       if (response.body.status === true) {
//         this.thirdParties = response.body.data
//         for (let i = 0; i < this.thirdParties.length; i++) {
//           this.btnLoads.push(false)
//         }
//       }
//     })
//   }
// }
// </script>
