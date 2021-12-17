const httpStatus = require('http-status');
const express = require('express');
const joi = require('joi');
const mssql = require('mssql');

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
            errorMessage: null,
            data: null,
        }

        let pool = null;

        try {
            const { error } = joi.object({
                email: joi.string().email().required(),
            }).validate(req.query)

            if (error) {
                responseValue.errorMessage = error.details[0];
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { email } = req.query;
            const [usernameEmail, domainEmail] = String(email).split('@');

            if (domainEmail !== 'continental.edu.pe') {
                responseValue.errorMessage = 'Please enter a valid email, domain is invalid';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const userCategory = getCategoryOfUserByUsernameEmail(usernameEmail);

            if (!userCategory) {
                responseValue.errorMessage = 'Please enter a valid email, user not recognize';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            pool = await new mssql.ConnectionPool(req.app.get('BDUCCIConfig')).connect();
            const requestDB = new mssql.Request(pool);

            if (userCategory === USER_CATEGORY.EMPLOYEE) {
                requestDB.input('p_usernameEmail', mssql.VarChar, usernameEmail);
                const responseDB = await requestDB.execute('ELOGIM.sp_obtenerInformacionEmpleado');
                const dataResponseDB = responseDB.recordset;

                if (!dataResponseDB.length)
                    throw new Error('Information of employee not found');

                responseValue.data = dataResponseDB[0];
            }

            if (userCategory === USER_CATEGORY.STUDENT) {
                const usernameStudent = usernameEmail.includes('i')
                    ? usernameEmail.split('i')[1]
                    : usernameEmail;

                requestDB.input('p_usernameEmail', mssql.VarChar, usernameStudent);
                requestDB.output('p_resultOn', mssql.TinyInt)
                const responseDB = await requestDB.execute('ELOGIM.sp_obtenerInformacionEstudiante');
                const recordsets = responseDB.recordsets;
                const { p_resultOn } = responseDB.output;
                const dataStudent = recordsets[+p_resultOn][0];

                if (!dataStudent)
                    throw new Error('Information of student not found');

                responseValue.data = dataStudent;
            }

            responseValue.ok = true;
            res.status(httpStatus.OK);
        } catch (error) {
            responseValue.errorMessage = '' + error;
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
        }

        if (pool && pool.connected) await pool.close().catch(console.log);

        res.send(responseValue);
    }

}

/**
 * Obtener el tipo de usuario en base al nombre de usuario de su correo corporativo
 * 
 * @param {String} usernameEmail nombre de ususario del correo corporativo
 * @returns {String} Tipo de usuario
 */

const getCategoryOfUserByUsernameEmail = (usernameEmail) => {

    // Solo letras
    if (/'^[a-zA-Z]+$'/.test(usernameEmail))
        return USER_CATEGORY.EMPLOYEE;

    return USER_CATEGORY.STUDENT;

}

module.exports = PersonController;
