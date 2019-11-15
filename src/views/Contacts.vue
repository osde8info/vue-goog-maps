<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 md12>
        <v-card>
          <v-card-title primary-title>
            <v-layout justify-space-between>
              <h3 class="headline mb-0">Trusted Contacts</h3>
              <v-chip outline color="secondary">
                <v-avatar>
                  <v-icon>account_circle</v-icon>
                </v-avatar>
                {{ contactsLength }} / {{ maxContactsLenght }}
              </v-chip>
            </v-layout>
          </v-card-title>

          <v-card-text>
            <v-list two-line>
              <!-- Display the list of contacts -->
              <div v-if="contacts.length > 0">
                <v-list-tile
                  v-for="contact in contacts"
                  :key="contact.id"
                  @click.stop="openEdit(contact.id)"
                >
                  <v-list-tile-avatar>
                    <v-icon class="secondary lighten-1 white--text"
                      >face</v-icon
                    >
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title class="subheading">{{
                      contact.name
                    }}</v-list-tile-title>
                    <span class="body-1">{{ contact.phone }}</span>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn icon ripple @click.stop="deleteContact(contact.id)">
                      <v-icon color="grey lighten-1">delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </div>
              <!-- Show this message if no contacts found -->
              <v-alert color="info" :value="true" icon="info" outline v-else
                >No contact found. Please create a contact.</v-alert
              >
            </v-list>
          </v-card-text>

          <v-card-text style="height: 100%; position: relative;">
            <v-btn
              :to="{ name: 'contact-create' }"
              :disabled="maxContactsLenght <= contactsLength"
              class="white--text"
              color="#220886"
              block
              large
              round
              >Add New Contact</v-btn
            >
          </v-card-text>
        </v-card>

        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      maxContactsLenght: 5
    }
  },
  computed: {
    contactsLength() {
      return this.contacts.length
    },
    ...mapState({
      contacts: state => state.user.contacts
    })
  },
  methods: {
    openEdit(id) {
      // redirect to edit modal
      this.$router.push({ name: 'contact-edit', params: { id } })
    },
    ...mapActions('user', ['deleteContact'])
  }
}
</script>

<style></style>
