// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase'
// importing configuration
import firebaseSecrets from './firebaseSecrets'

// Initialize firebase
firebase.initializeApp(firebaseSecrets)

export default firebase
