import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

//Iniciar admin firebase
admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    //Logs informacion
    functions.logger.info("Hello logs!", { structuredData: true });
    console.info('Hello logs!')
    //Logs de error
    functions.logger.error("Estos es un test de error");
    console.error('Estos es un test de error')
    //Respuesta al cliente 200
    response.send("Hello from Firebase!");
});

export const authCreate = functions.auth.user().onCreate(async (event)=>{
    try {
        functions.logger.log(`Function triggered by change to user: ${event.uid}`);
        functions.logger.log(`Created at: ${event.metadata.creationTime}`);
        if (event.email) {
            functions.logger.log(`Email: ${event.email}`);
        }
        await admin
            .firestore()
            .collection("user")
            .doc(event.uid)
            .set({ 
                "email": event.email,
                "delete": false
             })
            .then(()=>{
                functions.logger.info('La operación se completo')
            }).catch((error)=>{
                functions.logger.error('Error en la operaciòn',error)
            })
        return 'El usuario se creo con exito'
      } catch (err) {
        functions.logger.error('Auth Create',err);
        return 'Existio un error'
      }
    
})

export const authDelete = functions.auth.user().onDelete(async (event)=>{
    try {
        functions.logger.info("Delete")
        functions.logger.log(`Function triggered by change to user: ${event.uid}`);
        functions.logger.log(`Created at: ${event.metadata.creationTime}`);
        if (event.email) {
            functions.logger.log(`Email: ${event.email}`);
        }
        await admin
            .firestore()
            .collection("user")
            .doc(event.uid)
            .delete()
            .then(()=>{
                functions.logger.info('La operación se completo')
            }).catch((error)=>{
                functions.logger.error('Error en la operaciòn',error)
            })
        return 'El usuario se ha eliminado con exito'
      } catch (err) {
        functions.logger.error('Auth Delete',err);
        return 'Existio un error'
      }
})

export const userUpdate = functions.firestore
    .document("/user/{uid}")
    .onUpdate((dataSnapshot: any, context: any)=>{
        functions.logger.info("UID documento",context.params.uid)
        functions.logger.info("Antes ",dataSnapshot.before.data()["delete"])
        functions.logger.info("Ahora ",dataSnapshot.after.data()["delete"])
    })