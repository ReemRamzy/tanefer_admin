<template>
    <v-container>
        <v-snackbar v-model="snackbar" :timeout="5000" top :color="color">
          {{text}}
          <v-spacer></v-spacer>
          <v-btn
          icon
          @click="snackbar = false"
          >
            <v-icon right>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
        <v-row justify="space-between" class="px-5 mb-5">
            <h2 class="orange--text">Loyalty program properities</h2>
            <!-- <v-switch inset color="blue" v-model="editable">
                <template v-slot:label>
                  <span class="blue--text">Edit Props</span>
                </template>
            </v-switch> -->
        </v-row>
        <v-card class="pa-5 mb-5" v-for="(item, i) in pointsProps" :key="item.id">
          <v-row justify="space-between" class="pr-5">
            <h3 class="orange--text mb-5">{{item.name}}</h3>
            <v-switch inset color="blue" v-model="item.editable">
                <template v-slot:label>
                  <span class="blue--text">Edit Prop</span>
                </template>
            </v-switch>
          </v-row>
          <v-row class="px-3">
            <v-col cols="12" sm="6">
              <v-text-field
              v-model="pointsProps[i].name"
              label="Property Name"
              color="orange"
              :readonly="!item.editable"
              outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
              v-model="pointsProps[i].number"
              label="Points Number"
              color="orange"
              :readonly="!item.editable"
              outlined
              class="mx-2"
              type="number"
              min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
              v-model="pointsProps[i].price"
              label="Price per point"
              :readonly="!item.editable"
              outlined
              color="orange"
              append-icon="mdi-currency-usd"
              type="number"
              min="1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
              v-model="pointsProps[i].remarks"
              label="Property Description"
              color="orange"
              :readonly="!item.editable"
              outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions v-if="item.editable">
              <v-spacer></v-spacer>
              <v-btn :loading="btnLoads[i]" tile color="success" @click="updateProp(i)">
                  Update Property
              </v-btn>
          </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { headers, listPointsProps, updatePointsProps } from '../links'

export default {
  data () {
    return {
      pointsProps: [],
      btnLoads: [],
      snackbar: false,
      color: '',
      text: '',
      editable: false
    }
  },
  methods: {
    updateProp (i) {
      this.btnLoads[i] = true
      this.$http.put(updatePointsProps(this.pointsProps[i].id), this.pointsProps[i], { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.btnLoads[i] = false
        if (response.body.status === true) {
          this.snackbar = true
          this.color = 'success'
          this.text = `${this.pointsProps[i].name} Property was updated successfully`
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
    }
  },
  created () {
    this.$http.get(listPointsProps, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
      if (response.body.status === true) {
        this.pointsProps = response.body.data
        for (let i = 0; i < this.pointsProps.length; i++) {
          this.pointsProps.editable = false
          this.btnLoads.push(false)
        }
      }
    })
  }
}
</script>
