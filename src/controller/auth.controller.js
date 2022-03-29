const express = require('express');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const path = require('path');
const { readFileSync } = require('fs');
const joi = require('joi');
const { elogimProviderId } = require('../../config/config');
const privateKey = readFileSync(path.join(process.cwd(), 'certs', 'private.pem'))

class AuthController {

    /**
     * Obtener un token
     *
     * @param {express.Request} req Petición
     * @param {express.Response} res Respuesta
     *
     */
    static getTokenByProviderId(req, res) {
        const responseValue = {
            ok: false,
            data: null,
            error: null,
        }

        try {
            const { error } = joi.object({
                providerId: joi.string().required(),
            }).validate(req.query);

            if (error) {
                responseValue.error = error;
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { providerId } = req.query;

            if (providerId !== elogimProviderId) {
                responseValue.error = 'Provider not found';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const payload = { pid: providerId };
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '10min'
            });

            responseValue.data = token;
            responseValue.ok = true;
            res.status(httpStatus.OK)
        } catch (error) {
            responseValue.error = '' + error;
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
        }

        res.send(responseValue);
    }
}

module.exports = AuthController;
