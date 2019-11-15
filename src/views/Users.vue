<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 md12>
        <v-card>
          <v-card-title primary-title>
            <span class="title">Manage Users</span>
          </v-card-title>

          <v-card-text>
            <v-text-field
              solo-inverted
              flat
              label="Search by email"
              prepend-inner-icon="search"
            ></v-text-field>

            <v-list two-line>
              <v-list-tile v-for="user in users" :key="user.id" @click.stop>
                <v-list-tile-avatar>
                  <v-icon
                    v-if="!user.isAdmin"
                    class="grey lighten-1 white--text"
                    >face</v-icon
                  >
                  <v-icon v-else class="grey lighten-1 white--text">adb</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="subheading">
                    {{ user.displayName }}
                  </v-list-tile-title>
                  <span class="body-1">{{ user.email }}</span>
                </v-list-tile-content>

                <!--<v-list-tile-action>
                  <v-switch v-model="switch1" hint="Admin"></v-switch>
                   <v-btn icon ripple @click.stop>
                    <v-icon color="grey lighten-1">delete</v-icon>
                  </v-btn>
                </v-list-tile-action>-->
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  created() {
    // fetch the users
    this.fetchUsers()
  },
  computed: {
    ...mapState({
      users: state => state.adminUsers.users
    })
  },
  methods: {
    ...mapActions('adminUsers', ['fetchUsers'])
  }
}
</script>
