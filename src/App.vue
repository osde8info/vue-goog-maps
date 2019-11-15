<template>
  <v-app>
    <BaseNavbar />
    <NotificationContainer />

    <v-content>
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>

<style>
.layout.row.wrap {
  max-width: 500px !important;
  margin: auto;
}
.container.grid-list-md .layout:only-child {
  margin: auto;
}

@media screen and (min-width: 750px) {
  .layout.row.wrap {
    max-width: 900px !important;
  }
}
</style>

<script>
import firebase from '@/utils/firebase'
import store from '@/store/store'
import { mapState } from 'vuex'
import NotificationContainer from '@/components/NotificationContainer.vue'

/**
 * Observer waiting for the user get obtained from Firebase SDK
 * if the user is logged in and the token is not expired
 */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // if the user is obtained, then converting it to JSON
    const jsonUser = user.toJSON()
    // dispatching the log in
    store.dispatch('user/signInWithUserAndToken', {
      user: jsonUser,
      token: jsonUser.stsTokenManager.accessToken
    })
    // getting the user information from DB
    store.dispatch('user/fetchOrCreateUser')
  }
})

export default {
  name: 'App',
  components: {
    NotificationContainer
  },
  data() {
    return {
      updateLocation: null
    }
  },
  computed: {
    ...mapState({
      isLogged: state => state.user.isLogged
    })
  },
  watch: {
    isLogged: function(newVal) {
      // observing the changes in isLogged in order to
      // change of view, to home or sig in
      console.log(`isLogged: ${newVal}`)
      if (newVal) {
        this.$router.push({ name: 'home' })
      } else {
        this.$router.push({ name: 'sigin' })
      }
    }
  }
}
</script>
