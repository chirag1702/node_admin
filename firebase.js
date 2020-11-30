const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://villagetocities.firebaseio.com"
});

module.exports.admin = admin;
