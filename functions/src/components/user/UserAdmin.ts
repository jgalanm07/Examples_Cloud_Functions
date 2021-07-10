import * as admin from 'firebase-admin';
//import * as functions from "firebase-functions";
export class UserAdmin {
    setUser(entity:any,uid:string){
        return admin
        .firestore()
        .collection("user")
        .doc(uid)
        .set(entity)
    }
    deleteUser(uid:string){
        return admin
            .firestore()
            .collection("user")
            .doc(uid)
            .delete()
    }
}