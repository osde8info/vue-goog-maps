import firebase from '@/utils/firebase'

const Auth = firebase.auth()
const db = firebase.firestore()

export default {
  /**
   * Calls the signInWithRedirect() Firebase Auth method to start the OAuth Flow
   * @return "{ user, token }" An object with the user and access token
   */
  async signInWithGoogle() {
    // creating the provider
    const provider = new firebase.auth.GoogleAuthProvider()
    let token = null
    let user = null

    // calling the sign in
    await Auth.signInWithRedirect(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API
        token = result.credential.accessToken
        //The signed-in user info
        user = result.user
      })
      .catch(err => {
        throw err
      })

    return { user, token }
  },
  /**
   * Calls the Sign Out method of Firebase Authh
   * @return Promise<any> Returns the Promise of signOut Firebase method
   */
  signOut() {
    return Auth.signOut()
  },
  /**
   * If the session exists, returns the current user from Firebase
   * @returns Object  The User object from Firebase
   */
  async getCurrentUser() {
    let user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      return user
    }

    return await Auth.currentUser
  },
  async fetchOrCreateUser(fireUser) {
    // getting the user document by the ID
    const userRef = db.collection('users').doc(fireUser.uid)
    let user = null

    await userRef
      .get()
      .then(readDoc => {
        // if the user is found in the DB
        if (readDoc.exists) {
          user = readDoc.data()
        }
      })
      .catch(err => {
        throw err
      })

    if (!user) {
      // if the user doesn't exists then create it
      user = {
        displayName: fireUser.displayName,
        email: fireUser.email,
        phoneNumber: fireUser.phoneNumber,
        isAdmin: false,
        contacts: [],
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        customMessage:
          'URGENT! This is an emergency, my last location is <LOCATION>'
      }

      await userRef.set(user).then(() => {
        console.log(`Document sucessfully witten.`)
      })
    }

    return user
  },
  /**
   * Store in DB the custom message to be used in SMS
   * @param {*} uid ID of the User in DB
   * @param {*} newMessage Message that we want to be used in SMS
   */
  updateCustomMessage(uid, newMessage) {
    // getting the user document by the ID
    const userRef = db.collection('users').doc(uid)

    return userRef.update({ customMessage: newMessage })
  },
  /**
   * This method takes an array of Contacts and replace the array of the object in DB
   * @param {*} uid ID of the user in DB
   * @param {*} contacts Array of contacts to replace the array in DB
   */
  updateContacts(uid, contacts) {
    // getting the user document by ID
    const userRef = db.collection('users').doc(uid)

    return userRef.update({ contacts })
  }
}
