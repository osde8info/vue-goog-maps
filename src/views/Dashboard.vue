<template>
  <v-container fluid grid-list-md>
    <v-layout row fill-height justify-center>
      <v-flex xs12 md6>
        <div class="text-xs-center">
          <p class="my-2 text-xs-center send-panic-text">Send panic Message</p>
          <button @click.prevent="sendPanicSMS" class="panic-button">
            <v-icon class="panic-button-icon">mdi-message-alert</v-icon>
          </button>
        </div>
      </v-flex>
    </v-layout>

    <v-layout row fill-height justify-center class="mt-3">
      <v-flex xs12 md6>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>Personalize Panic Message</div>
            </template>
            <v-flex xs12 md12>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Text Message Template</h3>
                    <p class="mb-0">Customize the text message for the SMS</p>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex md12 xs12>
                      <v-textarea
                        @blur="$v.newMessage.$touch()"
                        v-model="customMessage"
                        :hint="
                          `Use < LOCATION > to tell the app where to insert the coordinates. Max 160 characters.`
                        "
                        :error-messages="messageErrors"
                        color="#220886"
                        label="SMS Message"
                        outline
                        persistent-hint
                        required
                      ></v-textarea>
                    </v-flex>
                    <v-layout align-center>
                      <v-btn
                        @click.prevent="updateMessage"
                        :disabled="
                          !$v.newMessage.$dirty || $v.newMessage.$anyError
                        "
                        class="white--text btn-google"
                        color="#220886"
                        block
                        large
                        round
                        >Save</v-btn
                      >
                    </v-layout>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <v-layout row fill-height justify-center>
      <v-flex md6 xs12>
        <v-card>
          <v-card-text class="pa-1">
            <GoogleMaps :center="{ ...coordinates }" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GoogleMaps from '@/components/GoogleMaps.vue'
import { setInterval, clearInterval } from 'timers'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    GoogleMaps
  },
  data() {
    return {
      map: null,
      tileLayer: null,
      myMarker: null,
      layers: [],
      newMessage: '',
      updateLocation: null
    }
  },
  created() {
    // set an interval to update the location every 10 seconds
    this.updateLocation = setInterval(() => {
      this.$store.dispatch('getCurrentLocation')
    }, 20000)
  },
  beforeDestroy() {
    // cleaning up the memory if the component is destroyed
    clearInterval(this.updateLocation)
  },
  mounted() {
    this.$store.dispatch('getCurrentLocation')
  },

  validations: {
    newMessage: { required, maxLength: maxLength(160) }
  },
  computed: {
    customMessage: {
      get() {
        return this.message
      },
      set(value) {
        this.newMessage = value
      }
    },
    messageErrors() {
      const errors = []
      if (!this.$v.newMessage.$dirty) return errors
      !this.$v.newMessage.required && errors.push('Message is required')
      !this.$v.newMessage.maxLength &&
        errors.push('Message cannot have more than 160 chars')
      return errors
    },
    ...mapState({
      coordinates: state => state.coordinates,
      message: state => state.user.customMessage
    })
  },
  methods: {
    updateMessage() {
      this.updateCustomMessage(this.newMessage)
      // to close the bottom sheet
      this.sheet = false
    },
    ...mapActions('user', ['updateCustomMessage']),
    ...mapActions(['sendPanicSMS'])
  }
}
</script>

<style scoped>
.panic-button {
  background: linear-gradient(to right, #fe5f75 0%, #fc9842 100%);
  border-radius: 50%;
  box-shadow: 1px 18px 39px -19px rgba(235, 120, 26, 0.92);
  height: 170px;
  padding: 3px;
  position: relative;
  width: 170px;
}

.panic-button-icon {
  color: white;
  font-size: 3rem;
}

.send-panic-text {
  color: #fe5269;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 3px;
  text-transform: uppercase;
}
</style>
