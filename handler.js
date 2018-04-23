"use strict";
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const {
  privateKey,
  authDomain,
  projectId,
  imageKey,
  customSearchURL,
  clientEmail
} = process.env;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey: `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`.replace(
      /\\n/g,
      "\n"
    )
  }),
  databaseURL: authDomain
});

const db = admin.firestore();

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

  switch (currentSlot) {
    case "location":
      fetchLocationAndSendImage(event.inputTranscript);
      break;
    case "weather":
      sendWeatherToDatabase(event.inputTranscript);
      break;
    case "mainCharacter":
      fetchCharacterAndSendImage(event, event.inputTranscript);
      break;
  }

  callback(null, response);
};

function fetchLocationAndSendImage(text) {
  const docRef = db.collection("session").doc("test");
  return fetch(
    `https://www.googleapis.com/customsearch/v1?key=${imageKey}&cx=${customSearchURL}&q=${text}&num=1&imgSize=xlarge&searchType=image&safe=high&rights=cc_publicdomain`
  )
    .then(res => res.json())
    .then(imgObj => {
      const dbPayload = {
        location: { url: imgObj.items[0].link, value: text }
      };
      const setTest = docRef.set(dbPayload, { merge: true });
    })
    .catch(console.log);
}

function fetchCharacterAndSendImage(event, text) {
  const docRef = db.collection("session").doc("test");
  return fetch(
    `https://www.googleapis.com/customsearch/v1?key=${imageKey}&cx=${customSearchURL}&q=${text} transparent&num=1&imgSize=xlarge&searchType=image&safe=high&rights=cc_publicdomain`
  )
    .then(res => res.json())
    .then(imgObj => {
      console.log(event.sessionAttributes);
      const nameKey = event.currentIntent.slots.mainCharacterName;
      const characters = {};
      characters[nameKey] = imgObj.items[0].link;
      const dbPayload = { characters };

      const setTest = docRef.set(dbPayload, { merge: true });
    })
    .catch(console.log);
}

function sendWeatherToDatabase(text) {
  const lookup = {
    storm: "storm",
    lightning: "storm",
    thunder: "storm",
    thunderstorm: "storm",
    fog: "fog",
    mist: "fog",
    misty: "fog",
    foggy: "fog",
    dew: "fog",
    smog: "fog",
    steam: "fog",
    tornado: "tornado",
    whirlwind: "tornado",
    cyclone: "tornado",
    twister: "tornado",
    typhoon: "tornado",
    blizzard: "blizzard",
    snowstorm: "blizzard",
    snowstorms: "blizzard",
    snowstorming: "blizzard",
    whiteout: "blizzard",
    ice: "ice",
    icey: "ice",
    freezing: "ice",
    frozen: "ice",
    chilly: "ice",
    cold: "ice",
    sun: "sun",
    sunny: "sun",
    summery: "sun",
    hot: "sun",
    warm: "sun",
    hail: "hail",
    hailstone: "hail",
    hailstones: "hail",
    wind: "wind",
    windy: "wind",
    blustery: "wind",
    windswept: "wind",
    gusty: "wind",
    brisk: "wind",
    blowing: "wind",
    rain: "rain",
    rainy: "rain",
    drizzle: "rain",
    drizzly: "rain",
    showers: "rain",
    wet: "rain",
    cloud: "cloud",
    cloudy: "cloud",
    overcast: "cloud",
    gloomy: "cloud",
    murky: "cloud",
    dull: "cloud",
    grey: "cloud",
    rainbow: "rainbow",
    sleet: "sleet",
    sandstorm: "sandstorm",
    sandstorms: "sandstorm",
    sandstormy: "sandstorm",
    snow: "snow",
    snowy: "snow",
    winter: "snow",
    wintery: "snow"
  };
  const weather = lookup[text] ? lookup[text] : "";
  const docRef = db.collection("session").doc("test");
  const setWeather = docRef.set({ weather }, { merge: true });
  return "";
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
