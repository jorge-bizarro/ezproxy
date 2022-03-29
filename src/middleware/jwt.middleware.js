const jwt = require('jsonwebtoken');
const express = require('express');
const httpStatus = require('http-status');
const { readFileSync } = require('fs');
const path = require('path');
const { NODE_ENV } = require('../../config/config');
const Logger = require('../../lib/logger');
const publicKey = readFileSync(path.join(process.cwd(), 'certs', 'public.pem'));

class JwtMiddleware {

    /**
     * Validar el token
     * * Importante: Solo funciona en el entorno de producción
     *
     * @param {express.Request} req Petición
     * @param {express.Response} res Respuesta
     * @param {express.NextFunction} next Función siguiente
     *
     */
    static verifyAuthorization(req, res, next) {

        if (NODE_ENV !== 'production') {
            next()
            return
        }

        try {
            const { authorization } = req.headers

            if (!authorization || !authorization.startsWith('Bearer ')) {
                return res.status(httpStatus.UNAUTHORIZED).send({ ok: false, error: 'Missing Authorization Header' });
            }

            const token = authorization.split(' ')[1];

            const payload = jwt.verify(token, publicKey, {
                algorithms: ['RS256']
            });

            req.headers.tokenPayload = payload;

            next()

        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
                res.status(httpStatus.UNAUTHORIZED)
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR)
            }

            res.send({ ok: false, error: '' + error });
            Logger.writeLog('JwtMiddleware.verifyAuthorization', error, Logger.Severity.Error);
        }
    }

}

module.exports = JwtMiddleware;

