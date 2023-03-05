<template>
    <v-autocomplete
    v-model="select"
    :loading="loading"
    :items="getItems()"
    :prepend-inner-icon="fieldProps.icon"
    hide-no-data
    solo
    :menu-props="{ auto: true, maxWidth: 'auto', overflowY: true }"
    item-text="name"
    color="orange"
    class="mr-1"
    height="52"
    width="100"
    return-object
    :placeholder="fieldProps.title"
    >
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title>{{data.item.name}}</v-list-item-title>
          <v-list-item-subtitle v-if="type === 'citites'">,{{ data.item.CountryCode}}</v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <template v-slot:selection="data">
        {{data.item.name}}{{type === 'citites' ? ',' : ''}}{{type === 'citites' ? data.item.CountryCode : ''}}
      </template>
    </v-autocomplete>
</template>

<script>

export default {
  props: ['type', 'parent'],
  data () {
    return {
      loading: false,
      items: [],
      search: null,
      select: null
    }
  },
  computed: {
    fieldProps () {
      let prop
      switch (this.type) {
        case 'countries':
          prop = { icon: 'mdi-map-marker', title: 'Country' }
          break
        case 'cities':
          prop = { icon: 'mdi-map-marker', title: 'City' }
          break
      }
      return prop
    }
  },
  watch: {
    select (value) {
      switch (this.type) {
        case 'countries':
          if (this.parent === 'manageAirlines') this.$store.dispatch('setAirlineCountry', value)
          else this.$store.dispatch('setAirportCountry', value)
          break
        case 'cities':
          this.$store.dispatch('setAirportCity', value)
          break
      }
    }
  },
  methods: {
    getItems () {
      let items
      switch (this.type) {
        case 'countries':
          items = this.$store.state.countries
          break
        case 'cities':
          items = this.$store.state.cities
          break
      }
      return items
    }
  }
}
</script>

<style>
  .v-autocomplete__content {
    margin-left: 16px;
  }
</style>
