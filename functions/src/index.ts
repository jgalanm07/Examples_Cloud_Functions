import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
//Iniciar admin firebase
admin.initializeApp()

const authController = require('./components/auth/AuthController')
const userController = require('./components/user/UserController')
const storageController = require('./components/storage/StorageController')

exports.authCreate = functions.auth
    .user()
    .onCreate(authController.createAccount);

exports.authDelete = functions.auth
    .user()
    .onDelete(authController.deleteAccount);

exports.updateUser = functions.firestore
    .document("/user/{uid}")
    .onUpdate(userController.userUpdate)


exports.writeStorage = functions.storage
    .object()
    .onFinalize(storageController.writeStorage)

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    /*
    //Logs informacion
    functions.logger.info("Hello logs!", { structuredData: true });
    console.info('Hello logs!')
    //Logs de error
    functions.logger.error("Estos es un test de error");
    console.error('Estos es un test de error')
    //Respuesta al cliente 200
    response.send("Hello from Firebase!");*/
    functions.logger.info("Variable de entorno",functions.config().email.key)
    response.send("Hello from Firebase ! "+functions.config().email.key);
});



/*export const userUpdate = functions.firestore
    .document("/user/{uid}")
    .onUpdate((dataSnapshot: any, context: any)=>{
        functions.logger.info("UID documento",context.params.uid)
        functions.logger.info("Antes ",dataSnapshot.before.data()["delete"])
        functions.logger.info("Ahora ",dataSnapshot.after.data()["delete"])
    })*/