<template>
    <div>
        <v-container fluid class="my-5">
            <v-row>
                <v-col cols="11" md="6" v-for="n in 2" :key="n">
                    <v-card>
                        <v-card-title class="blue white--text">{{n === 1 ? 'First' : 'Second'}} Child Price Policies</v-card-title>
                        <v-card-text>
                            <v-simple-table v-if="n === 1">
                                <template v-slot:default>
                                <tbody>
                                    <tr
                                    v-for="(value, name) in firstChildPolicies"
                                    :key="name"
                                    >
                                        <td class="body-1 text-capitalize">{{name.split('_')[1]}}.year(s)</td>
                                        <td>
                                            <v-text-field height="20" :rules="[v => v >= 0 || 'Value should be between 0 and 100', v => v <= 100 || 'Value should be between 0 and 100']" type="number" min="0" max="100" suffix="%" v-model="firstChildPolicies[name]"></v-text-field>
                                        </td>
                                    </tr>
                                </tbody>
                                </template>
                            </v-simple-table>
                            <v-simple-table v-if="n === 2">
                                <template v-slot:default>
                                <tbody>
                                    <tr
                                    v-for="(value, name) in secondChildPolicies"
                                    :key="name"
                                    >
                                        <td class="body-1 text-capitalize">{{name.split('_')[1]}}.year(s)</td>
                                        <td>
                                            <v-text-field height="20" :rules="[v => v >= 0 || 'Value should be between 0 and 100', v => v <= 100 || 'Value should be between 0 and 100']" type="number" min="0" max="100" suffix="%" v-model="secondChildPolicies[name]"></v-text-field>
                                        </td>
                                    </tr>
                                </tbody>
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-btn class="mt-5 mx-auto px-15 py-7 white--text" tile color="blue" @click="submitPolicies">Submit</v-btn>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { headers, childPolicy, cruiseChildPolicy } from '../../links'
export default {
  data () {
    return {
      firstChildPolicies: {
        child_1: 0,
        child_2: 0,
        child_3: 0,
        child_4: 0,
        child_5: 0,
        child_6: 0,
        child_7: 0,
        child_8: 0,
        child_9: 0,
        child_10: 0,
        child_11: 0
      },
      secondChildPolicies: {
        child_1: 0,
        child_2: 0,
        child_3: 0,
        child_4: 0,
        child_5: 0,
        child_6: 0,
        child_7: 0,
        child_8: 0,
        child_9: 0,
        child_10: 0,
        child_11: 0
      }
    }
  },
  methods: {
    submitPolicies () {
      let endpoint
      const payload = { occupancy: this.$route.params.occupancy, first_child: this.firstChildPolicies, second_child: this.secondChildPolicies }
      if (this.$route.params.type === 'cruise') {
        endpoint = cruiseChildPolicy
        payload.cruise_id = this.$route.params.id
      } else {
        endpoint = childPolicy
        payload.hotel_id = this.$route.params.id
      }
      this.$http.post(endpoint, payload, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.body.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'Children Policies was added successfully'
          if (this.$route.params.type === 'cruise') this.$router.push({ name: 'cruise', id: this.$route.params.id, occupancy: this.$route.params.occupancy })
          else this.$router.push({ name: 'hotel', id: this.$route.params.id, occupancy: this.$route.params.occupancy })
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.addHotelLoading = false
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.errors
      })
    }
  },
  created () {
    console.log(this.$store.state.childPolicies)
    if (this.$store.state.childPolicies != null) {
      for (let i = 0; i < this.$store.state.childPolicies.first_child.length; i++) {
        this.firstChildPolicies['child_' + (i + 1)] = this.$store.state.childPolicies.first_child[i]
      }
      for (let i = 0; i < this.$store.state.childPolicies.second_child.length; i++) {
        this.secondChildPolicies['child_' + (i + 1)] = this.$store.state.childPolicies.second_child[i]
      }
    }
  }
}
</script>
