import UsersService from '@/services/UsersService'
import { publishNotification } from '@/utils/storeHelpers.js'

export const namespaced = true

export const state = {
  users: []
}

export const mutations = {
  SET_USERS(state, users) {
    state.users = users
  }
}

export const actions = {
  async fetchUsers({ commit, dispatch }) {
    const users = await UsersService.fetchLastsCreatedUsers().catch(err => {
      // show notification
      publishNotification(
        'error',
        'Error fetching users from database. ' + err.message,
        dispatch
      )
    })

    if (users) {
      commit('SET_USERS', users)
    }
  }
}
