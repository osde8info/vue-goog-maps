<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-space-between column fill-height>
      <img src="@/assets/logo.svg" alt="g-logo" class="panic-logo" />
      <p class="text-xs-center">
        Track your current position and send it to your trusted contacts through
        SMS
      </p>

      <v-btn
        @click.prevent="signInWithGoogle"
        class="white--text mb-5"
        color="#220886"
        large
        round
      >
        <v-icon class="mr-2">mdi-google</v-icon>Sign in with Google
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('user', ['signInWithGoogle'])
  }
}
</script>

<style scoped>
.panic-logo {
  height: 30%;
  margin: 15% auto 0;
  width: 74%;
}
</style>
