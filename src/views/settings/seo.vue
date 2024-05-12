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
            :items="listSeo"
            :headers="seoHeaders"
            type="seo"
            :loading="loading"
            @addSEO="dialogAddSEO = true; actionType = 'add'; seo.name = '';"
            @updateSEO="updateSEOForm"
            />
        </v-container>
        <v-dialog max-width="500" v-model="dialogAddSEO">
            <v-card class="pa-5">
                <v-card-title class="orange--text text-capitalize">{{actionType}} SEO</v-card-title>
                <v-card-text>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                        label="Name"
                        v-model="seo.name"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Name is required']"
                        color="orange"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Title"
                        v-model="seo.title"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Title is required']"
                        color="orange"
                        >
                        </v-text-field>

                        <v-textarea
                        outlined
                        label="Description"
                        v-model="seo.description"
                        ></v-textarea>

                        <v-file-input
                        outlined
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="SEO Image"
                        prepend-inner-icon="mdi-image"
                        label="SEO Image"
                        v-model="seo.image"
                        ></v-file-input>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn text color="warning" @click="dialogAddSEO = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn tile :disabled="!valid" :loading="btnLoad" color="blue white--text" @click="actionType === 'add' ? addSEO() : updateSEO()">{{actionType === 'add' ? 'Add' : 'Update'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog max-width="500" v-model="dialogEditSEO">
            <v-card class="pa-5">
                <v-card-title class="orange--text text-capitalize">{{actionType}} SEO</v-card-title>
                <v-card-text>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                        label="Name"
                        v-model="seo.name"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Name is required']"
                        color="orange"
                        >
                        </v-text-field>

                        <v-text-field
                        label="Title"
                        v-model="seo.title"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Title is required']"
                        color="orange"
                        >
                        </v-text-field>

                        <v-textarea
                        outlined
                        label="Description"
                        v-model="seo.description"
                        ></v-textarea>

                        <v-file-input
                        outlined
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="SEO Image"
                        prepend-inner-icon="mdi-image"
                        label="SEO Image"
                        v-model="seo.image"
                        ></v-file-input>

                        <v-text-field
                        label="Slug"
                        v-model="seo.slug"
                        type="text"
                        outlined
                        :rules="[v => !!v || 'Slug is required']"
                        color="orange"
                        >
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn text color="warning" @click="dialogEditSEO = false">Cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn tile :disabled="!valid" :loading="btnLoad" color="blue white--text" @click="actionType === 'add' ? addSEO() : updateSEO()">{{actionType === 'add' ? 'Add' : 'Update'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { settingSEOs, settingAddSEO, settingUpdateSEO, headers } from '../../links'
import grid from '../../components/tables.vue'

export default {
  components: {
    grid
  },
  data () {
    return {
      listSeo: [],
      snackbar: false,
      color: '',
      text: '',
      loading: true,
      seoHeaders: [
        { text: 'Image', value: 'featured_image' },
        { text: 'Page Name', value: 'page_name' },
        { text: 'SEO Title', value: 'seo_title' },
        { text: 'Slug', value: 'slug' },
        { text: 'Edit', value: 'editSEO' }
      ],
      actionType: 'add',
      seo: {
        name: '',
        title: '',
        description: '',
        image: null,
        slug: ''
      },
      id: null,
      dialog: false,
      dialogAddSEO: false,
      dialogEditSEO: false,
      valid: true,
      btnLoad: false,
      airportLoading: false,
      select: null,
      items: []
    }
  },
  methods: {
    addSEO () {
      this.$refs.form.validate()
      if (this.valid) {
        this.btnLoad = true
        const formData = new FormData()
        formData.append('page_name', this.seo.name)
        formData.append('seo_title', this.seo.title)
        formData.append('seo_description', this.seo.description)
        if (this.seo.image) formData.append('featured_image', this.seo.image, this.seo.image.name)
        this.$http.post(settingAddSEO, formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.btnLoad = false
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'SEO was added'
            this.getListofSEO()
            this.$refs.form.reset()
            this.dialogAddSEO = false
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
        this.text = 'Please provide a SEO name'
      }
    },
    updateSEOForm (seo) {
      this.seo.name = seo.page_name
      this.seo.title = seo.seo_title
      this.seo.description = seo.seo_description
      this.seo.slug = seo.slug
      this.id = seo.id
      this.actionType = 'edit'
      this.dialogEditSEO = true
    },
    updateSEO () {
      this.$refs.form.validate()
      if (this.valid) {
        this.btnLoad = true
        const formData = new FormData()
        // formData.append('_method', 'PUT')
        formData.append('page_name', this.seo.name)
        formData.append('seo_title', this.seo.title)
        formData.append('seo_description', this.seo.description)
        formData.append('slug', this.seo.slug)
        if (this.seo.image) formData.append('featured_image', this.seo.image, this.seo.image.name)
        this.$http.post(settingUpdateSEO(this.id), formData, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
          this.btnLoad = false
          if (response.status === 200) {
            this.snackbar = true
            this.color = 'success'
            this.text = 'SEO was updated'
            this.getListofSEO()
            this.$refs.form.reset()
            this.dialogEditSEO = false
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
        this.text = 'Please provide a SEO name'
      }
    },
    getListofSEO () {
      this.loading = true
      this.$http.get(settingSEOs, { headers: headers(this.$cookies.get('userToken')) }).then(response => {
        this.loading = false
        if (response.status === 200) {
          this.listSeo = response.body.data
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
    this.getListofSEO()
  }
}
</script>
