const firestore = require('@google-cloud/firestore');
import * as functions from 'firebase-functions';
const client = new firestore.v1.FirestoreAdminClient();
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
// Creates a client
const storage = new Storage();

/**
 * URL: https://cloud.google.com/firestore/docs/solutions/schedule-export
 * Primero dar permisos de "Administrador de almacenamiento" en el bucket creado para respaldo a la cuenta de servicio del proyecto <ID del proyecto>@appspot.gserviceaccount.com
 * Despues dar permisos a traves del cloud shell de GCP:
 *      gcloud projects add-iam-policy-binding <ID del proyecto> --member serviceAccount:<ID del proyecto>@appspot.gserviceaccount.com --role roles/datastore.importExportAdmin
 */
exports.backupToStorage = async (context: any) => {
//exports.backupToStorage = async (request: any, response: any) => {
    //bucketName=<nombre del bucket> (backup-proyecto-inv)
    const bucketName = functions.config().project.bucket.backup;
    const prefix = "backup-schedule"
    //Delete all
    await storage.bucket(bucketName)
        .deleteFiles({ prefix: prefix + "/" })
        .then(() => {
            console.log("Se eliminaron los documentos");
        }).catch((error: any) => {
            console.error(error)
        });
    //Backup firestore
    const listCollection:string[] = [];
    //projectId=<ID del proyecto> (proyectoinv-4bsffs)
    const projectId = functions.config().project.name
    const databaseName =
        client.databasePath(projectId, '(default)');
    
    functions.logger.info(`gs://${bucketName}/${prefix}`)
    functions.logger.info(databaseName)
    functions.logger.info(listCollection)

    await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: `gs://${bucketName}/${prefix}`,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: listCollection
    })
        .then((responses: any[]) => {
            const response = responses[0];
            console.log(`Operation Name: ${response['name']}`);
        })
        .catch((err: any) => {
            console.error(err);
        });
    return "Operación completa"
}