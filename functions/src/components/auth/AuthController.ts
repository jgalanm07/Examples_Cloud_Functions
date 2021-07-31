import * as functions from 'firebase-functions';
import admin = require("firebase-admin");
import { UserAdmin } from "../user/UserAdmin";

const userAdmin = new UserAdmin();
/**
 * Node mailer
 * https://www.npmjs.com/package/nodemailer
 * npm i nodemailer
 */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.password
    }
});

exports.createAccount = (async (event: any) => {
    try {
        functions.logger.log(`Function triggered by change to user: ${event.uid}`);
        functions.logger.log(`Created at: ${event.metadata.creationTime}`);
        if (event.email) {
            functions.logger.log(`Email: ${event.email}`);
        }
        let complete = false
        await userAdmin.setUser({
            "email": event.email,
            "delete": false
        }, event.uid)
            .then(() => {
                functions.logger.info('La operación se completo')
                complete = true
            }).catch((error) => {
                functions.logger.error('Error en la operaciòn', error)
            })
        if (!!complete) {
            //await admin.auth().generateEmailVerificationLink(event.email, { url: "https://www.ups.edu.ec/" }) //El dominio tiene que pertenecer al proyecto de firebase
            await admin.auth().generateEmailVerificationLink(event.email)
                .then((link) => {
                    //Correo de inicio
                    const mailOptions = {
                        from: '<noreply.creaminka@gmail.com>',
                        replyTo: 'noreply.creaminka@gmail.com',
                        to: event.email,
                        subject: "Ya eres parte de nuestro evento",
                        html: `<p>Hola por favor verifica tu cuenta <a href='${link}'>Verificar</a>.</p>
                         <p>Si no creaste la cuenta <b>no ingreses al link</b></p>
                        ` // email content in HTML
                    };
                    transporter.sendMail(mailOptions, function (error: any, response: any) {
                        if (error) {
                            functions.logger.error("Error sendMail", event.email, error);
                        } else {
                            functions.logger.info("Message sent: " + response);
                        }
                    })
                })
        }
        return 'El usuario se creo con exito'
    } catch (err) {
        functions.logger.error('Auth Create', err);
        return 'Existio un error'
    }
})


exports.deleteAccount = (async (event: any) => {
    functions.logger.info("Delete")
    functions.logger.log(`Function triggered by change to user: ${event.uid}`);
    functions.logger.log(`Created at: ${event.metadata.creationTime}`);
    if (event.email) {
        functions.logger.log(`Email: ${event.email}`);
    }
    await userAdmin.deleteUser(event.uid)
        .then(() => {
            functions.logger.info('La operación se completo')
        }).catch((error) => {
            functions.logger.error('Error en la operaciòn', error)
        })
    return 'El usuario se ha eliminado con exito'
})