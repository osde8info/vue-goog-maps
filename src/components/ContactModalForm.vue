<template>
  <v-dialog
    v-model="isOpen"
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card tile>
      <!-- Heading and close button for the modal -->
      <v-toolbar card color="#757575">
        <v-toolbar-title class="white--text">Create Contact</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="closeModal">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Content of the modal -->
      <v-card-text>
        <v-layout row justify-center>
          <v-flex xs12>
            <v-form>
              <v-text-field
                hint="Name (required)"
                persistent-hint
                required
                color="#220886"
                v-model="name"
                :error-messages="nameErrors"
                @blur="$v.name.$touch()"
              ></v-text-field>
              <v-text-field
                hint="Phone Number (required). Must start with + and include country and area code."
                persistent-hint
                required
                color="#220886"
                v-model="phone"
                :error-messages="phoneErrors"
                @blur="$v.phone.$touch()"
              ></v-text-field>
            </v-form>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click.prevent="save"
          :disabled="$v.$anyError"
          class="white--text"
          color="#220886"
          medium
          round
          >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators'

/**
 * validator or E164 Number
 */
const e164Number = value => {
  // regex pattern for E164 Number format
  const pattern = /^\+?\d{10,14}$/
  // testing if the value matches the expression
  return pattern.test(value)
}

export default {
  props: {
    id: {
      type: Number
    }
  },
  created() {
    if (this.id) {
      // searching the contact using the ID
      const contact = this.contacts.find(el => el.id === this.id)

      // setting the state variables to display in the form
      if (contact) {
        this.name = contact.name
        this.phone = contact.phone
        this.contactEdited = contact
      }
    }
  },
  data() {
    return {
      isOpen: true,
      name: '',
      phone: '',
      contactEdited: null
    }
  },
  validations: {
    name: { required },
    phone: { required, e164Number }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required')
      return errors
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.required && errors.push('Phone is required')
      !this.$v.phone.e164Number && errors.push('Phone number is not valid.')
      return errors
    },
    ...mapState({
      contacts: state => state.user.contacts
    })
  },
  methods: {
    closeModal() {
      this.isOpen = false
      setTimeout(() => {
        this.$router.push({ name: 'contacts' })
      })
    },
    save() {
      // makes every field $dirty
      this.$v.$touch()

      // creating object with all the values to be stored
      let toStore = {
        id: this.id || this.contacts.length + 1,
        name: this.name,
        phone: this.phone
      }

      // checks if the form is valid
      if (!this.$v.$invalid) {
        // editing an existent contact
        if (this.id) {
          // merging values
          toStore = { ...this.contactEdited, ...toStore }
          // dispatch the update
          this.$store
            .dispatch('user/updateContact', toStore)
            .then(() => {
              console.log('Contact updated')
              this.closeModal()
            })
            .catch(err => {
              console.log('ERROR:', err)
            })
        } else {
          // creating a new contact
          this.$store
            .dispatch('user/addContact', toStore)
            .then(() => {
              console.log('Contact created')
              this.closeModal()
            })
            .catch(err => {
              console.log('ERROR:', err)
            })
        }
      }
    }
  }
}
</script>

<style></style>
