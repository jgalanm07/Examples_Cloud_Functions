
export class StorageAdmin {
    getURLImg(image:any){
        console.log(image)
        let url="https://firebasestorage.googleapis.com/v0/b/"
        url+=image["bucket"]+"/o/"
        url+=(image["id"].replace('proyectoinv-4bf54'+".appspot.com/","").replace("/"+image["generation"],"").split("/").join("%2F")+"?alt=media&token=")
        url+=image["metadata"]["firebaseStorageDownloadTokens"]
        return url
    }
}