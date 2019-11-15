const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Init Twilio
const twilio = require('twilio')
const accountSid = functions.config().twilio.sid
const authToken = functions.config().twilio.token
const twilioNumber = functions.config().twilio.number

const client = new twilio(accountSid, authToken)

/**
 * Send SMS using Twilio
 */
exports.sendSMS = functions.https.onCall((data, context) => {
  // getting the message and phone number
  const message = data.message
  const phoneTo = data.phoneTo

  if (!message || !phoneTo) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with message and phoneTo.'
    )
  }

  const currDate = new Date()
  console.log(`${currDate.toISOString()} - Sending SMS to: ${phoneTo}`)
  console.log(`${currDate.toISOString()} - Sending Message: ${message}`)

  // sending back the promise of send the SMS through Twilio
  return client.messages
    .create({ from: twilioNumber, body: message, to: phoneTo })
    .then(message => {
      if (!message.error_code) {
        return { message: 'Message sent.', success: true }
      }
      return { message: message.error_message, sucess: false }
    })
    .catch(err => {
      return { message: err.message, success: false }
    })
})
