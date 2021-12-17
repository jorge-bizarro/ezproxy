const express = require('express');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const path = require('path');
const { readFileSync } = require('fs');
const joi = require('joi');
const { providerELOGIM } = require('../../config/config.json');

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
            errorMessage: null,
            data: null,
        }

        try {
            const { error } = joi.object({
                providerId: joi.string().required(),
            }).validate(req.query);

            if (error) {
                responseValue.errorMessage = error.details[0];
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { providerId } = req.query;

            if (providerId !== providerELOGIM.providerId) {
                responseValue.errorMessage = 'Provider not found';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const payload = { pid: providerId };
            const privateKey = readFileSync(path.join(process.cwd(), 'config', 'private.pem'));
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '10min'
            });

            responseValue.data = { token };
            responseValue.ok = true;
            res.status(httpStatus.OK)
        } catch (error) {
            responseValue.errorMessage = '' + error;
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
        }

        res.send(responseValue);
    }
}

module.exports = AuthController;
