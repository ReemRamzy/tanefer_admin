<template>
    <div>
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
        <v-container>
            <grid
            :items="cities"
            :headers="cityHeaders"
            type="cities"
            :loading="loading"
            @addCity="dialog = true; actionType = 'add'; city.name = '';"
            @updateCity="updateCityForm"
            @removeCity="removeCity"
            />
        </v-container>
        <v-dialog max-width="500" v-model="dialog">
            <v-card class="pa-5">
                <v-card-title class="orange--text text-capitalize">{{actionType}} City</v-card-title>
                <v-card-text>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                        label="Name"
                        v-model="city.name"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Name is required']"
                        color="orange"
                        >
                        </v-text-field>
                        <v-textarea
                        outlined
                        label="Description"
                        hint="Include city name in the  description!"
                        v-model="city.description"
                        ></v-textarea>

                        <span v-if="actionType === 'edit'">Airport Cod: {{select}}</span>
                        <v-autocomplete
                        v-model="select"
                        :loading="airportLoading"
                        :items="items"
                        :search-input.sync="search"
                        prepend-inner-icon="mdi-airport"
                        hide-no-data
                        clearable
                        no-filter
                        outlined
                        :menu-props="{ auto: true, maxWidth: 'auto', overflowY: false }"
                        :allow-overflow="false"
                        item-text="Name"
                        item-value="Code"
                        color="blue"
                        placeholder="Search by airport name"
                        :auto-select-first="items.length === 1"
                        >
                          <template v-slot:item="data">
                            <v-list-item-content>
                              <v-list-item-title>{{data.item.Name}}</v-list-item-title>
                              <v-list-item-subtitle>{{data.item.Code}}</v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                          <template v-slot:selection="data">
                            <span>{{data.item.Name}},{{data.item.Code}}</span>
                          </template>
                        </v-autocomplete>

                        <v-file-input
                        outlined
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="City Image"
                        prepend-inner-icon="mdi-image"
                        label="City Image"
                        v-model="city.image"
                        ></v-file-input>

                        <v-text-field
                        label="Image Caption"
                        v-model="city.caption"
                        type="text"
                        outlined
                        color="orange"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Image Alt"
                        v-model="city.alt"
                        type="text"
                        outlined
                        color="orange"
                        >
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn text color="warning" @click="dialog = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn tile :disabled="!valid" :loading="btnLoad" color="blue white--text" @click="actionType === 'add' ? addCity() : updateCity()">{{actionType === 'add' ? 'Add' : 'Update'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { tripCities, tripCity, getAirports, headers } from '../../links'
import grid from '../../components/tables.vue'

export default {
  components: {
    grid
  },
  data () {
    return {
      cities: [],
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      cityHeaders: [
        { text: 'City', value: 'name' },
        { text: 'Edit', value: 'editCity' },
        { text: 'Remove', value: 'removeCityById', align: 'end' }
      ],
      actionType: 'add',
      city: {
        name: '',
        description: '',
        image: null,
        caption: '',
        alt: ''
      },
      id: null,
      dialog: false,
      valid: true,
      btnLoad: false,
      airportLoading: false,
      select: null,
      search: null,
      items: []
    }
  },
  watch: {
    search (val) {
      console.log(val)
      val && val !== this.select && this.querySelections(val)
    }
  },
  methods: {
    querySelections (v) {
      if (!v) return null
      this.airportLoading = true
      this.$http.get(getAirports(v), { headers: headers(this.$cookies.get('userToken')) }).then(response => response.json()).then(response => {
        this.items = response
      }).then(() => (this.airportLoading = false))
    },
    addCity () {
      this.$refs.form.validate()
      if (this.valid) {
        this.btnLoad = true
        const formData = new FormData()
        formData.append('name', this.city.name)
        formData.append('description', this.city.description)
        formData.append('airportCode', this.select)
        formData.append('image_alt', this.city.alt)
        formData.append('image_caption', this.city.caption)
        if (this.city.image) formData.append('image', this.city.image, this.city.image.name)
        this.$http.post(tripCities, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.btnLoad = false
          if (response.status === 201) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'City was added'
            this.getCities()
            this.$refs.form.reset()
            this.dialog = false
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
        }, err => {
          this.snackbar = true
          this.color = 'error'
          this.text = err.body.message
          this.btnLoad = false
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please provide a city name'
      }
    },
    updateCityForm (city) {
      this.city.name = city.name
      this.city.description = city.description
      this.city.alt = city.image_alt
      this.city.caption = city.image_caption
      this.select = city.airport_code
      this.id = city.id
      this.actionType = 'edit'
      this.dialog = true
    },
    updateCity () {
      this.$refs.form.validate()
      if (this.valid) {
        this.btnLoad = true
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('name', this.city.name)
        formData.append('description', this.city.description)
        formData.append('airportCode', this.select)
        formData.append('image_alt', this.city.alt)
        formData.append('image_caption', this.city.caption)
        if (this.city.image) formData.append('image', this.city.image, this.city.image.name)
        this.$http.post(tripCity(this.id), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.btnLoad = false
          if (response.status === 201) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'City was updated'
            this.getCities()
            this.$refs.form.reset()
            this.dialog = false
          } else {
            this.snackbar = true
            this.color = 'error'
            this.text = response.body.message
          }
        }, err => {
          this.snackbar = true
          this.color = 'error'
          this.text = err.body.message
          this.btnLoad = false
        })
      } else {
        this.snackbar = true
        this.color = 'warning'
        this.text = 'Please provide a city name'
      }
    },
    removeCity (id) {
      this.$http.delete(tripCity(id), { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        if (response.status === 200) {
          this.snackbar = true
          this.color = 'success'
          this.text = 'City was deleted'
          this.getCities()
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
    },
    getCities () {
      this.loading = true
      this.$http.get(tripCities, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.status === 200) {
          this.cities = response.body.cities
        } else {
          this.snackbar = true
          this.color = 'error'
          this.text = response.body.message
        }
      }, err => {
        this.snackbar = true
        this.color = 'error'
        this.text = err.body.message
        this.loading = false
      })
    }
  },
  created () {
    this.getCities()
  }
}
</script>
