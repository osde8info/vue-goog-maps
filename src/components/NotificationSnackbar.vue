<template>
  <v-snackbar v-model="open" :color="color" :timeout="0">
    {{ notification.message }}
    <v-btn dark flat @click="open = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions } from 'vuex'
import { setTimeout, clearTimeout } from 'timers'

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timeout: null,
      destroyTime: 8000,
      open: true
    }
  },
  mounted() {
    this.timeout = setTimeout(() => {
      this.remove(this.notification.id)
    }, this.destroyTime)
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  },
  computed: {
    color() {
      return this.notification.type || 'info'
    }
  },
  methods: mapActions('notification', ['remove'])
}
</script>

<style></style>
