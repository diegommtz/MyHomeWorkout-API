var admin = require("firebase-admin");
var serviceAccount = require("../../myhomeworkout-e41f4-firebase-adminsdk-4goeg-9e5bbc1441.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myhomeworkout-e41f4.firebaseio.com",
  storageBucket: "urisiento-app.appspot.com"
});

const dbFirestore = admin.firestore();
const dbStorage = admin.storage();
const fieldValue = admin.firestore.FieldValue;

module.exports = {
  dbFirestore, dbStorage, fieldValue
};