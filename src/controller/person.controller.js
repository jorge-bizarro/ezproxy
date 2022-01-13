const httpStatus = require('http-status');
const express = require('express');
const joi = require('joi');
const mssql = require('mssql');
const { domain_company } = require('../../config/config.json')
const { writeLogCatchException } = require('../../lib/logger');

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

        let pool = null;

        try {
            const { error } = joi.object({
                email: joi.string().email().required(),
            }).validate(req.query)

            if (error) {
                responseValue.error = error;
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { email } = req.query;
            const [usernameEmail, domainEmail] = String(email).split('@');

            if (domainEmail !== domain_company) {
                responseValue.error = 'Please enter a valid email, domain is invalid';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const userCategory = getCategoryOfUserByUsernameEmail(usernameEmail);

            if (!userCategory) {
                responseValue.error = 'Please enter a valid email, user not recognize';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            pool = await new mssql.ConnectionPool(req.app.get('dbConfig')).connect();
            const requestDB = new mssql.Request(pool);
            let personInformation = {};

            if (userCategory === USER_CATEGORY.EMPLOYEE) {
                requestDB.input('p_usernameEmail', mssql.VarChar, usernameEmail);
                const responseDB = await requestDB.execute('EZPROXY.sp_obtenerInformacionEmpleado');
                const dataResponseDB = responseDB.recordset;

                if (!dataResponseDB.length)
                    throw new Error('Information of employee not found');

                personInformation = dataResponseDB[0]
            }

            if (userCategory === USER_CATEGORY.STUDENT) {
                const usernameStudent = usernameEmail.includes('i')
                    ? usernameEmail.split('i')[1]
                    : usernameEmail;

                requestDB.input('p_usernameEmail', mssql.VarChar, usernameStudent);
                requestDB.output('p_resultOn', mssql.TinyInt)
                const responseDB = await requestDB.execute('EZPROXY.sp_obtenerInformacionEstudiante');
                const { p_resultOn } = responseDB.output;
                const dataResponseDB = responseDB.recordsets[+p_resultOn];

                if (!dataResponseDB.length)
                    throw new Error('Information of student not found');

                personInformation = dataResponseDB[0];
            }

            Object.keys(personInformation).forEach(key => {
                if (typeof personInformation[key] === 'string')
                    personInformation[key] = String(personInformation[key]).trim();
            })

            responseValue.data = personInformation;
            responseValue.ok = true;
            res.status(httpStatus.OK);
        } catch (error) {
            responseValue.error = '' + error;
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
        }

        if (pool && pool.connected) await pool.close().catch(writeLogCatchException);

        res.send(responseValue);
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
