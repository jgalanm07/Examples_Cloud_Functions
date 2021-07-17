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
    updateUser(data:any,uid:string){
        return admin
        .firestore()
        .collection("user")
        .doc(uid)
        .update(data)
    }
    deleteUser(uid:string){
        return admin
            .firestore()
            .collection("user")
            .doc(uid)
            .delete()
    }
}