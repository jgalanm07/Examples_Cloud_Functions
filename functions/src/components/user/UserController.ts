import * as functions from 'firebase-functions';
import { AuthAdmin } from "./../auth/AuthAdmin";
const authAdmin= new AuthAdmin();
exports.userUpdate=(dataSnapshot: any, context: any)=>{
    //functions.logger.info("UID documento",context.params.uid)
    //functions.logger.info("Antes ",dataSnapshot.before.data()["delete"])
    //functions.logger.info("Ahora ",dataSnapshot.after.data()["delete"])
    //Controlar suspención de cuenta
    if(dataSnapshot.before.data()["delete"]!==null && dataSnapshot.before.data()["delete"]!==undefined){ 
        if(dataSnapshot.after.data()["delete"]!==null && dataSnapshot.after.data()["delete"]!==undefined){
            if(dataSnapshot.before.data()["delete"]!==dataSnapshot.after.data()["delete"]){
                authAdmin.updateDisable(context.params.uid,dataSnapshot.after.data()["delete"])
                .then(()=>{
                    functions.logger.info("Se suspendio la cuenta ",context.params.uid)
                }).catch((error:any)=>{
                    functions.logger.error("Error Auth Update",error)
                })
            }
        }
    }else{
        if(dataSnapshot.after.data()["delete"]!==null && dataSnapshot.after.data()["delete"]!==undefined){
                authAdmin.updateDisable(context.params.uid,dataSnapshot.after.data()["delete"])
                .then(()=>{
                    functions.logger.info("Se suspendio la cuenta ",context.params.uid)
                }).catch((error:any)=>{
                    functions.logger.error("Error Auth Update",error)
                })
        }
    }
}