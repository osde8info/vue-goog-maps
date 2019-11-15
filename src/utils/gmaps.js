const API_KEY = 'AIzaSyC-gKA70rg7KvOAIN5GVT5xykNbKfeLo-k'
const CALLBACK_NAME = 'initMap'

let initialized = !!window.google
let resolveInitPromise
let rejectInitPromise

// This promise handles the initialization
// status of the google maps script
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve
  rejectInitPromise = reject
})

export default function init() {
  // if google maps is already init
  // the `initPromise` should be resolved
  if (initialized) return initPromise

  initialized = true
  // the callback function is called
  // by the Google maps script if it is
  // successfully loaded
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google)

  // we inject a new tag into the Head
  // of the HTML to load the Google Maps script
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}`
  script.onerror = rejectInitPromise
  document.querySelector('head').appendChild(script)

  return initPromise
}
