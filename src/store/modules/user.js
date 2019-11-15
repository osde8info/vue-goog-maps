import AuthService from '@/services/AuthService'
import { publishNotification } from '@/utils/storeHelpers.js'

export const namespaced = true

export const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  token: localStorage.getItem('token') || '',
  isLogged: false,
  isAdmin: false,
  contacts: [],
  customMessage: ''
}

export const mutations = {
  SET_LOG_IN(state, { user, token }) {
    state.isLogged = true
    state.user = user
    state.token = token
    // set in local storage
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', JSON.stringify(token))
  },
  SET_ADMIN_USER(state, isAdmin) {
    state.isAdmin = isAdmin
  },
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts
  },
  ADD_CONTACT(state, contact) {
    state.contacts.push(contact)
  },
  SET_CUSTOM_MESSAGE(state, message) {
    state.customMessage = message
  },
  LOGOUT(state) {
    state.isLogged = false
    state.user = {}
    state.token = ''
    // remove from local storage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

export const actions = {
  /**
   * Set the login using the user and token of an already opened session with Firebase
   * @param {*} Vuex objects
   * @param {*} User Object with the User Info and Access Token from Firebase
   */
  signInWithUserAndToken({ commit, dispatch }, { user, token }) {
    commit('SET_LOG_IN', { user, token })

    // show notification
    publishNotification('success', 'Signed In!', dispatch)
  },
  /**
   * Fetches the information of the User of sign in, if exists in DB, else creates it
   * @param {*} Vuex Objects
   */
  async fetchOrCreateUser({ state, commit }) {
    const user = await AuthService.fetchOrCreateUser(state.user)

    if (user) {
      // commit in the state the stored info in DB
      commit('SET_ADMIN_USER', user.isAdmin)
      commit('SET_CONTACTS', user.contacts)
      commit('SET_CUSTOM_MESSAGE', user.customMessage)
    }
  },
  /**
   * Stores in DB the custom message to be send through SMS
   * @param {*} Vuex Objects
   * @param {*} newMessage New Custom Message for SMS
   */
  updateCustomMessage({ state, commit, dispatch }, newMessage) {
    AuthService.updateCustomMessage(state.user.uid, newMessage)
      .then(() => {
        commit('SET_CUSTOM_MESSAGE', newMessage)
        // show notification
        publishNotification(
          'success',
          'The Message was successfuly saved!',
          dispatch
        )
      })
      .catch(err => {
        console.error('ERROR:', err)
        publishNotification(
          'error',
          'There was an error updating Message. ' + err.message,
          dispatch
        )
      })
  },
  /**
   * Adds a new contact to the contact array of the user
   * @param {*} Vuex objects
   * @param {*} contact New contact
   */
  addContact({ state, commit, dispatch }, contact) {
    // getting the new array of contacts
    const contacts = [...state.contacts, ...[contact]]

    AuthService.updateContacts(state.user.uid, contacts)
      .then(() => {
        commit('ADD_CONTACT', contact)
        publishNotification(
          'success',
          'The contact was successfuly added!',
          dispatch
        )
      })
      .catch(err => {
        console.error('ERROR:', err)
        publishNotification(
          'error',
          'There was an error adding the contact. ' + err.message,
          dispatch
        )
      })
  },
  updateContact({ state, commit, dispatch }, contact) {
    // getting the contacts without the contact to replace
    const contacts = state.contacts.filter(el => el.id !== contact.id)
    // adding the contact edited
    contacts.push(contact)
    // sorting
    contacts.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0))
    // Updating
    AuthService.updateContacts(state.user.uid, contacts)
      .then(() => {
        commit('SET_CONTACTS', contacts)
        publishNotification(
          'success',
          'The contact was sucessfuly updated!',
          dispatch
        )
      })
      .catch(err => {
        publishNotification(
          'error',
          'There was an error updating the contact. ' + err.message,
          dispatch
        )
      })
  },
  /**
   * Deletes a contact from the array of contacts, given the ID
   * @param {*} Vuex objects
   * @param {*} id Id of the contact to remove
   */
  deleteContact({ state, commit, dispatch }, id) {
    // update the array of contacts, removing the one with id
    const contacts = state.contacts.filter(el => el.id !== id)

    AuthService.updateContacts(state.user.uid, contacts)
      .then(() => {
        commit('SET_CONTACTS', contacts)
        publishNotification('success', 'The contact was removed!', dispatch)
      })
      .catch(err => {
        console.log('ERROR:', err)
        publishNotification(
          'error',
          'There was an error while removing the contact. ' + err.message,
          dispatch
        )
      })
  },
  /**
   * Starts the Sign In with Google Flow of Firebase
   * @param {*} Vuex Objects
   */
  async signInWithGoogle({ commit, dispatch }) {
    const result = await AuthService.signInWithGoogle().catch(err => {
      // make sure is sign out
      commit('LOGOUT')
      console.error('ERROR:', err)
      publishNotification(
        'error',
        'There was an error creating the user. ' + err.message,
        dispatch
      )
    })

    if (result && 'user' in result) {
      commit('SET_LOG_IN', { user: result.user, token: result.token })
      // show notification
      publishNotification('success', 'User successfuly signed in!', dispatch)
    }
  },
  /**
   * Perform the Sign Out with Firebase
   * @param {*} Vuex objects
   */
  singOut({ commit, dispatch }) {
    AuthService.signOut()
      .then(() => {
        commit('LOGOUT')
      })
      .catch(err => {
        console.error('ERROR:', err)
        publishNotification(
          'error',
          'There was an error when sign out. ' + err.message,
          dispatch
        )
      })
  }
}
