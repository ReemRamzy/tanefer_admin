<template>
    <span :class="`${color}--text`">{{formatDate(date)}}</span>
</template>

<script>
export default {
  props: ['date', 'color', 'small'],
  methods: {
    formatDate (date) {
      const [year, month, day] = date.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return this.small ? `${day} ${months[month - 1]}` : `${day} ${months[month - 1]} ${year}`
    }
  }
}
</script>
