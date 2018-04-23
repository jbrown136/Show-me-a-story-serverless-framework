"use strict";
const fetch = require("node-fetch");
const firebase = require("firebase");
require("firebase/firestore");
const {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  imageKey,
  customSearchURL
} = process.env;

module.exports.endIntent = (event, context, callback) => {
  const response = {
    dialogAction: {
      type: "Close",
      fulfillmentState: "Fulfilled",
      message: {
        contentType: "PlainText",
        content: "BYE"
      }
    }
  };
  callback(null, response);
};

module.exports.evaluateInput = (event, context, callback) => {
  const { slots } = event.currentIntent;
  const response = {
    sessionAttributes: event.sessionAttributes,
    dialogAction: {
      type: "Delegate",
      slots
    }
  };

  const currentSlot = Object.entries(slots).reduce((acc, curr) => {
    if (curr[1] === event.inputTranscript) return curr[0];
    return acc;
  }, "");

  fetchLocationAndSendImage(event.inputTranscript);
  callback(null, response);
};

function fetchLocationAndSendImage(text) {
  console.log(text);

  const config = {
    apiKey,
    authDomain,
    projectId
  };
  const defaultApp = firebase.initializeApp(config);

  const db = firebase.firestore();

  const docRef = db.collection("session").doc("test");

  return fetch(
    `https://www.googleapis.com/customsearch/v1?key=${imageKey}&cx=${customSearchURL}&q=${text}&num=1&imgSize=xlarge&searchType=image&safe=high&rights=cc_publicdomain`
  )
    .then(res => res.json())
    .then(imgObj => {
      const dbPayload = {
        location: { url: imgObj.items[0].link, value: text }
      };
      const setTest = docRef.update(dbPayload);
    })
    .catch(console.log);
}
// {
//   "currentIntent": {
//     "name": "intent-name",
//     "slots": {
//       "slot name": "value",
//       "slot name": "value"
//     },
//     "slotDetails": {
//       "slot name": {
//         "resolutions" : [
//           { "value": "resolved value" },
//           { "value": "resolved value" }
//         ],
//         "originalValue": "original text"
//       },
//       "slot name": {
//         "resolutions" : [
//           { "value": "resolved value" },
//           { "value": "resolved value" }
//         ],
//         "originalValue": "original text"
//       }
//     },
//     "confirmationStatus": "None, Confirmed, or Denied (intent confirmation, if configured)"
//   },
//   "bot": {
//     "name": "bot name",
//     "alias": "bot alias",
//     "version": "bot version"
//   },
//   "userId": "User ID specified in the POST request to Amazon Lex.",
//   "inputTranscript": "Text used to process the request",
//   "invocationSource": "FulfillmentCodeHook or DialogCodeHook",
//   "outputDialogMode": "Text or Voice, based on ContentType request header in runtime API request",
//   "messageVersion": "1.0",
//   "sessionAttributes": {
//      "key": "value",
//      "key": "value"
//   },
//   "requestAttributes": {
//      "key": "value",
//      "key": "value"
//   }
// }
