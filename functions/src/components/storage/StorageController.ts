import * as functions from 'firebase-functions';

exports.writeStorage = async (file: any) => {
  functions.logger.info(file.name)
  functions.logger.info(file.metadata)
  return "Ok"
}
