<template>
  <div class="notification-container">
    <NotificationSnackbar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import NotificationSnackbar from '@/components/NotificationSnackbar.vue'
import { mapState } from 'vuex'

export default {
  components: {
    NotificationSnackbar
  },
  computed: mapState('notification', ['notifications'])
}
</script>

<style></style>
