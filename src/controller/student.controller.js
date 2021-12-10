const httpStatus = require('http-status');
const express = require('express');
const joi = require('joi');
const mssql = require('mssql');

const USER_CATEGORY = {
    INSTITUTE: 'INSTITUTO',
    UNIVERSITY: 'UNIVERSIDAD',
    EMPLOYEE: 'EMPLEADO'
}

/**
 * Obtener la información del estudiante
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 * 
 */
const getInformation = async (req, res) => {
    const responseValue = {
        ok: false,
        errorMessage: null,
        data: null,
    }

    let pool = null;

    try {
        const { error } = joi.object({
            email: joi.string().email().required()
        }).validate(req.query)

        if (error) {
            responseValue.errorMessage = error.details[0];
            return res.status(httpStatus.BAD_REQUEST).send(responseValue);
        }

        const { email } = req.query;
        const [codeEmail, domainEmail] = String(email).split('@');

        if (domainEmail !== 'continental.edu.pe') {
            responseValue.errorMessage = 'Please enter a valid email, domain is invalid';
            return res.status(httpStatus.BAD_REQUEST).send(responseValue);
        }

        const userType = verifyTypeUserCodeEmail(codeEmail);

        console.log('---------------->', userType);

        if (!userType) {
            responseValue.errorMessage = 'Please enter a valid email, user not recognize';
            return res.status(httpStatus.BAD_REQUEST).send(responseValue);
        }

        pool = await new mssql.ConnectionPool(req.app.get('BDUCCIConfig')).connect();
        const requestDB = pool.request();
        let resultInformation = [];

        if (userType === USER_CATEGORY.INSTITUTE) {
            requestDB.input('p_IDAlumno', mssql.VarChar, codeEmail.substring(1));
            const responseDB = await requestDB.execute('ELOGIM.sp_obtenerInformacionInstituto');
            resultInformation = responseDB.recordset;

            if (!resultInformation.length) throw new Error('Information of institute not found');
        }

        if (userType === USER_CATEGORY.UNIVERSITY) {
            requestDB.input('p_dni', mssql.VarChar, codeEmail)
            const responseDB = await requestDB.execute('ELOGIM.sp_obtenerInformacionUniversitario');
            resultInformation = responseDB.recordset;

            if (!resultInformation.length) throw new Error('Information of university not found');

            resultInformation = resultInformation.filter(item => getActualPeriodFor(item.UNIDAD_NEGOCIO) == item.PERIODO);
        }

        if (userType === USER_CATEGORY.EMPLOYEE) {

        }

        responseValue.data = getDataRespose(resultInformation);
        responseValue.ok = true;
        res.status(200);
    } catch (error) {
        responseValue.errorMessage = '' + error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }

    if (pool && pool.connected) await pool.close().catch(console.log);

    res.send(responseValue);
}

/**
 * Verificar el tipo de usuario en base a su código de correo
 * 
 * @param {String} code Código del correo
 * @returns {String | undefined} Tipo de usuario
 */
const verifyTypeUserCodeEmail = (code) => {
    code = code.trim().toLowerCase();

    if (code.startsWith('i'))
        return USER_CATEGORY.INSTITUTE;

    if (new RegExp('^[0-9]+$').test(code))
        return USER_CATEGORY.UNIVERSITY;

    if (new RegExp('^[a-zA-Z]+$').test(code))
        return USER_CATEGORY.EMPLOYEE;

    return undefined;
}


/**
 * 
 * @param {String} unityBusiness Unidad de negocio
 * @returns {String} Periodo actual
 */
const getActualPeriodFor = (unityBusiness) => {
    unityBusiness = unityBusiness.toUpperCase().trim();

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    if (unityBusiness === 'PREGRADO') {
        if ((month + 1) / 6 >= 1)
            return year + '20';

        return year + '10';
    }

    if (unityBusiness === 'POSGRADO') {
        if ((month + 1) / 6 >= 1)
            return year + '02';

        return year + '01';
    }

    if (unityBusiness === 'CONTINUA') {
        return year + '05';
    }

    return null;
}


/**
 * 
 * @param {Array} arrayResultInformation
 * @param {String} email
 */
const getDataRespose = function (arrayResultInformation, email) {
    const { DNI, NOMBRES, APELLIDOS, ESTADO } = arrayResultInformation[0];

    return {
        IDAlumno: email,
        Nombres: NOMBRES,
        Apellidos: APELLIDOS,
        DNI: DNI,
        CorreoCorporativo: email,
        Estado: ESTADO,
        Detalles: arrayResultInformation
            .map(item => ({
                TipoUsuario: item.USER_TYPE,
                Facultad: item.FACULTAD,
                carrera: item.CARRERA,
                Modalidad: item.MODALIDAD,
                UnidadNegocio: item.UNIDAD_NEGOCIO,
                Campus: item.CAMPUS,
            }))
    }
}

module.exports = {
    getInformation
}
