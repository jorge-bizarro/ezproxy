// @ts-check

const httpStatus = require('http-status');
const express = require('express');
const joi = require('joi');
const mssql = require('mssql');
const Logger = require('../utils/logger');

const MAIL_DOMAIN = 'continental.edu.pe';
const USER_CATEGORY = {
    EMPLOYEE: 'EMPLEADO',
    STUDENT: 'ESTUDIANTE'
}

class PersonController {

    /**
     * Obtener la información de la persona
     * 
     * @param {express.Request} req 
     * @param {express.Response} res  
     * 
     */
    static async getInformation(req, res) {
        const responseValue = {
            ok: false,
            error: null,
            data: null,
        }

        try {
            const { error: joiError } = joi.object({
                email: joi.string().email().required(),
            }).validate(req.query)

            if (joiError) {
                responseValue.error = joiError
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { email } = req.query;
            const { dbPool } = req.app.locals;
            const requestDB = dbPool.request();
            const [usernameEmail, domainEmail] = String(email).split('@');

            if (domainEmail !== MAIL_DOMAIN) {
                responseValue.error = 'Please enter a valid email, domain is invalid';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const userCategory = getCategoryOfUserByUsernameEmail(usernameEmail);

            let personInformation = {};

            if (userCategory === USER_CATEGORY.EMPLOYEE) {
                requestDB.input('p_usernameEmail', mssql.VarChar, usernameEmail);
                const responseDB = await requestDB.execute('EZP.sp_obtenerInformacionEmpleado');
                const dataResponseDB = responseDB.recordset;

                if (!dataResponseDB.length) {
                    throw new Error('Information of employee not found');
                }

                personInformation = dataResponseDB[0]
            }

            if (userCategory === USER_CATEGORY.STUDENT) {
                const usernameStudent = usernameEmail.includes('i')
                    ? usernameEmail.split('i')[1]
                    : usernameEmail;

                requestDB.input('p_usernameEmail', mssql.VarChar, usernameStudent);
                requestDB.output('p_resultOn', mssql.TinyInt)
                const responseDB = await requestDB.execute('EZP.sp_obtenerInformacionEstudiante');
                const { p_resultOn } = responseDB.output;
                const dataResponseDB = responseDB.recordsets[+p_resultOn];

                if (!dataResponseDB.length) {
                    throw new Error('Information of student not found');
                }

                personInformation = dataResponseDB[0];
            }

            Object.keys(personInformation).forEach(key => {
                if (typeof personInformation[key] === 'string') {
                    personInformation[key] = String(personInformation[key]).trim()
                }
            })

            responseValue.data = personInformation;
            responseValue.ok = true;
            res.status(httpStatus.OK).send(responseValue)
        } catch (error) {
            responseValue.error = '' + error;
            Logger.writeLog('PersonController.getInformation', error, Logger.Severity.Error);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseValue)
        }
    }

}

/**
 * Obtener el tipo de usuario en base al nombre de usuario de su correo corporativo
 * 
 * @param {String} usernameEmail nombre de usuario del correo corporativo
 * @returns {String} Tipo de usuario
 */

const getCategoryOfUserByUsernameEmail = (usernameEmail) => /^[a-zA-Z]+$/.test(usernameEmail) ? USER_CATEGORY.EMPLOYEE : USER_CATEGORY.STUDENT;

module.exports = PersonController;
