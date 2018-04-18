"use strict";

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
  console.log(event.currentIntent.slots);
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

  // let result = "";
  // for (let key in slots) {
  //   if (slots[key] === event.inputTranscript) {
  //     result = key;
  //   }
  // }

  const result = Object.entries(slots).reduce((acc, curr) => {
    if (curr[1] === event.inputTranscript) return curr[0];
    return acc;
  }, "");

  console.log(result);
  switch (result) {
    case "location":
      console.log(event.inputTranscript);
      break;
    case "weather":
      console.log(event.inputTranscript);
      break;
    case "mainCharacter":
      console.log(event.inputTranscript);
      break;
    case "event":
      console.log(event.inputTranscript);
      break;
  }
  callback(null, response);
};
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
