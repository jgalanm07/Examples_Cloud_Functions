import * as functions from 'firebase-functions';
import { StorageAdmin } from "./../storage/StorageAdmin";
import { UserAdmin } from "../user/UserAdmin";
const storageAdmin= new StorageAdmin();
const userAdmin = new UserAdmin();

exports.writeStorage = async (file: any) => {
  functions.logger.info(file.name)
  functions.logger.info(file.metadata)
  return "Ok"
}

exports.resizeImage = async (imagen: any) => {
  if (!!imagen.metadata) {
    if (!!imagen.metadata.resizedImage) {
      //Usuarios
      if (imagen.name.match(/users/) && imagen.name.match(/resize/)) {
        if (imagen.contentType.startsWith('image/')) {
          functions.logger.info("Este documento si es una imagen ",imagen.name)
          const uuidUser:string=imagen.name.match(/users\/([^\/]*)/g)[0].replace("users/","")
          const url:string= storageAdmin.getURLImg(imagen)
          let key=''
          if(imagen.name.match(/\.webp/)){
            key='url-img-800x800-webp'
          }
          if(imagen.name.match(/\.png/)){
            key='url-img-800x800-png'
          }
          if(!!key){
            let mp:any={}
            mp[key]=url
            userAdmin.updateUser(mp,uuidUser)
            .then(()=>{
                functions.logger.info('La operación se completo')
            }).catch((error)=>{
                functions.logger.error('Error en la operaciòn',error)
            })
          }else{
            functions.logger.info("Este documento no tiene la extensiòn correcta ",imagen.name)
          }
          
          //functions.logger.info('uuid=>'+uuidUser.replace("users/",""))
          //functions.logger.info('url=>'+storageAdmin.getURLImg(imagen))
        }else{
          functions.logger.info("Este documento no es una imagen ",imagen.name)
        }
      }
    }
  }
  return "Ok"
}
