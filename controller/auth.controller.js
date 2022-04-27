// @ts-check

const express = require('express');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const path = require('path');
const joi = require('joi');
const { readFileSync } = require('fs');
const privateKey = readFileSync(path.join(process.cwd(), 'certs', 'private.pem'));
const { ELOGIM_PROVIDER_ID } = require('../config/config');

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
            error: null,
            data: null,
        }

        try {
            const { error: joiError } = joi.object({
                providerId: joi.string().required(),
            }).validate(req.query);

            if (joiError) {
                responseValue.error = joiError;
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { providerId } = req.query;

            if (providerId !== ELOGIM_PROVIDER_ID) {
                responseValue.error = 'Provider not found';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const payload = { pid: providerId };
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '5min'
            });

            responseValue.data = token;
            responseValue.ok = true;
            res.status(httpStatus.OK).send(responseValue)
        } catch (error) {
            responseValue.error = '' + error;
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(responseValue)
        }
    }
}

module.exports = AuthController;
