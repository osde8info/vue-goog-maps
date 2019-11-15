import firebase from '@/utils/firebase'

const db = firebase.firestore()

export default {
  /**
   * Get the lasts users created in DB
   * @returns Users[]
   */
  async fetchLastsCreatedUsers() {
    const users = []
    await db
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          users.push({ ...doc.data(), id: doc.id })
        })
      })
      .catch(err => {
        throw err
      })

    return users
  }
}
