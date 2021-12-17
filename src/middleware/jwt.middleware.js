const jwt = require('jsonwebtoken');
const express = require('express');
const httpStatus = require('http-status');
const { readFileSync } = require('fs');
const path = require('path');

class JwtMiddleware {

    /**
     * Validar el token
     *
     * @param {express.Request} req Petición
     * @param {express.Response} res Respuesta
     * @param {express.NextFunction} next Función siguiente
     *
     */
    static verifyToken(req, res, next) {
        const responseValue = {
            ok: false,
            errorMessage: null,
            data: null,
        }

        try {
            if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
                responseValue.errorMessage = 'Missing Authorization Header';
                return res.status(httpStatus.UNAUTHORIZED).send(responseValue);
            }

            const token = req.headers.authorization.split(' ')[1];
            const publicKey = readFileSync(path.join(process.cwd(), 'config', 'public.pem'));

            const payload = jwt.verify(token, publicKey, {
                algorithms: ['RS256']
            });

        } catch (error) {
            responseValue.errorMessage = '' + error;
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseValue);
        }

        next();

    }

}

module.exports = JwtMiddleware;

