const FCM = require("fcm-node");
const mailer = require("nodemailer");
const serverKey = "AAAAzQlMq5g:APA91bHjG2Q0pVvBZ3CvexMHe7AvBid7usHDMz4-T-aJGak43hgLoyWTwiXCzngRYyIW6hkxpEgsREUcHn9ZH_BYZ9MDSRwWiixPQuSv3uj6b-M9WbxFQKuQCgR25sjH7kMZvi6hGLQ_";
const fcm = new FCM(serverKey);

const firebase = require("firebase-admin");

const serviceAccount = require('./serviceAccount.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://villagetocities.firebaseio.com"
});

// The Firebase token of the device which will get the notification
// It can be a string or an array of strings

exports.SendOrderPlacedNotification = function send(fcmToken, orderID) {
    const firebaseToken = fcmToken;

    const payload = {
        notification: {
            title: 'Order placed!!',
            body: 'We have successfully received your order. The order ID is ' + orderID + '. Please keep this for future reference.',
        }
    };

    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
    };

    firebase.messaging().sendToDevice(firebaseToken, payload, options).then(r => {
        console.log(r);
    });
}

exports.SendOrderStatusUpdateNotification = function send(fcmToken, orderID, status) {
    const firebaseToken = fcmToken;


    const payload = {
        notification: {
            title: 'Order ' + status + "!!",
            body: 'Your order with order ID # ' + orderID + ' has been ' + status + '!!',
        }
    };

    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
    };

    firebase.messaging().sendToDevice(firebaseToken, payload, options).then(r => {
        console.log(r);
    });
}

exports.SendNotification = function send(fcmToken, msgTitle, msgBody) {
    const firebaseToken = fcmToken;


    const payload = {
        notification: {
            title: msgTitle,
            body: msgBody,
        }
    };

    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
    };

    firebase.messaging().sendToDevice(firebaseToken, payload, options).then(r => {
        console.log(r);
    });
}

exports.OrderRecivedEmail = function send(userEmail, username, orderID) {
    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: "chirag.jangid1702@gmail.com",
            pass: "thenewmailforcleanuse"
        }
    });

    let mailoptions = {
        from: "chirag.jangid1702@gmail.com",
        to: userEmail,
        subject: "Order Recived!!",
        html: "Hello Dear, " + username + " we have successfully recived your order with <strong> Order ID : #</strong>" + orderID
    };

    transporter.sendMail(mailoptions, (error, response) => {
       if (error) {
           console.log(error);
       } else {
           console.log(response);
       }
    });
}

exports.OrderStatusUpdateEmail = function send(userEmail, username, orderID, status) {
    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: "chirag.jangid1702@gmail.com",
            pass: "thenewmailforcleanuse"
        }
    });

    let mailoptions = {
        from: "chirag.jangid1702@gmail.com",
        to: userEmail,
        subject: "Order " + status + "!!",
        html: "Hello Dear, " + username + " your order with <strong> Order ID : #</strong>" + orderID + " has been <strong> " + status + " </strong>. For further details, please refer to tracking details in the app.<br> Thank You."
    };

    transporter.sendMail(mailoptions, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
        }
    });
}