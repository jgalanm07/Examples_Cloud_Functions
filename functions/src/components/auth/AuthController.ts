import * as functions from 'firebase-functions';
//import admin = require("firebase-admin");
import { UserAdmin } from "../user/UserAdmin";

const userAdmin = new UserAdmin();

exports.createAccount=(async (event:any)=>{
    try {
        functions.logger.log(`Function triggered by change to user: ${event.uid}`);
        functions.logger.log(`Created at: ${event.metadata.creationTime}`);
        if (event.email) {
            functions.logger.log(`Email: ${event.email}`);
        }
        await userAdmin.setUser({ 
            "email": event.email,
            "delete": false},event.uid)
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


exports.deleteAccount=(async (event:any)=>{
    functions.logger.info("Delete")
        functions.logger.log(`Function triggered by change to user: ${event.uid}`);
        functions.logger.log(`Created at: ${event.metadata.creationTime}`);
        if (event.email) {
            functions.logger.log(`Email: ${event.email}`);
        }
        await userAdmin.deleteUser(event.uid)
            .then(()=>{
                functions.logger.info('La operación se completo')
            }).catch((error)=>{
                functions.logger.error('Error en la operaciòn',error)
            })
        return 'El usuario se ha eliminado con exito'
})