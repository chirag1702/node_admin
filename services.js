// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccount.json");
//
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://villagetocities.firebaseio.com"
// });
//
// exports.sendNotification = function send(fcmToken, notificationTitle, message) {
//
//     fcmToken = "dpeg2E0SQ1O7oAOgSEc0vD:APA91bF0MS-GikK59Z7SlBbQkmme2SaXbMsEWajnjGeTQ4CGrjuL1o5DGpbMlxT9bVVr67rhGY88VtiKu_ADm4xL2Ly4uEzHaxoKTMQcp_OTL0Xsg1QKF1CiIHqJDLeXhom8NGpN4Pbd";
//
//     var payload = {
//         notification: {
//             title: notificationTitle,
//             body: message
//         },
//         token: fcmToken
//     };
//
//     var options = {
//         priority: "high",
//         timeToLive: 60 * 60 * 24
//     };
//
//     admin.messaging().send(payload).then((response) => {
//         console.log(response);
//     }).catch((error) => {
//         console.log("error sending notification: " + error);
//     });
// }

const FCM = require("fcm-node");
const serverKey = "AAAAzQlMq5g:APA91bHjG2Q0pVvBZ3CvexMHe7AvBid7usHDMz4-T-aJGak43hgLoyWTwiXCzngRYyIW6hkxpEgsREUcHn9ZH_BYZ9MDSRwWiixPQuSv3uj6b-M9WbxFQKuQCgR25sjH7kMZvi6hGLQ_";
const fcm = new FCM(serverKey);

exports.sendNotification = function send(fcmToken, notificationTitle, notificationMessage) {
    let message = {
        to: fcmToken,

        notification: {
            title: notificationTitle,
            body: notificationMessage
        }
    };

    fcm.send(message, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
}