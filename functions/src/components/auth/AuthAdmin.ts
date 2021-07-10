import * as admin from 'firebase-admin';
//import * as functions from "firebase-functions";
export class AuthAdmin {
    updateDisable(uid:string,op:boolean){
        return admin.auth()
            .updateUser(uid, { disabled: op }) 
    }
}