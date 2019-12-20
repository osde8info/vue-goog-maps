const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// Init Nexmo
const Nexmo = require('nexmo');
const API_KEY = functions.config().nexmo.apikey
const API_SECRET = functions.config().nexmo.apikey
const FROM = functions.config().nexmo.phone

// init nexmo client
const nexmo = new Nexmo({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});

/**
 * Send SMS using Nexmo
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

  //sending back the promise of send the SMS through Nexmo
  //Note: Because Nexmo doesn't support promises (Just callbacks). We create our Custom promise to handle nexmo response
  var NexmoPromise = function(FROM, phoneTo, message){
    var pro = new Promise((resolve, reject)=> {

      nexmo.message.sendSms(FROM, phoneTo, message, { type: "unicode" }, (err, responseData) => {

        if (err) {
          console.log(err);
          resolve({ message: err, sucess: false })
        } else {
          if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
            resolve({ message: 'Message sent.', success: true })
          } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            resolve({ message: responseData.messages[0]['error-text'], success: false })
          }
        }

      })

  })

  return pro

 }

 //Execute the nexmo function and return the promise
 return NexmoPromise(FROM, phoneTo, message)
  
})
