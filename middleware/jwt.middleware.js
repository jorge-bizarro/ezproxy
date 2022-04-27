// @ts-check

const jwt = require('jsonwebtoken');
const express = require('express');
const httpStatus = require('http-status');
const Logger = require('../utils/logger');
const { readFileSync } = require('fs');
const path = require('path');
const publicKey = readFileSync(path.join(process.cwd(), 'certs', 'public.pem'));

class JwtMiddleware {

    /**
     * Validar el token
     *
     * @param {express.Request} req Petición
     * @param {express.Response} res Respuesta
     * @param {express.NextFunction} next Función siguiente
     *
     */
    static verifyAuthorization(req, res, next) {
        const { authorization } = req.headers;
        const responseValue = {
            ok: false,
            error: null,
            data: null,
        }

        try {
            if (!authorization || !authorization.startsWith('Bearer ')) {
                responseValue.error = 'Missing authorization header';
                return res.status(httpStatus.UNAUTHORIZED).send(responseValue);
            }

            const token = authorization.split(' ')[1];

            const payload = jwt.verify(token, publicKey, {
                algorithms: ['RS256']
            });

            req['tokenPayload'] = payload;
        } catch (error) {
            Logger.writeLog('JwtMiddleware.verifyAuthorization', error, Logger.Severity.Error);

            responseValue.error = '' + error;
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseValue);
        }

        next();
    }

}

module.exports = JwtMiddleware;

