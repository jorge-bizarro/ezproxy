const express = require('express');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const path = require('path');
const { readFileSync } = require('fs');
const joi = require('joi');
const { provider } = require('../../config/config.json');

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
            const { error } = joi.object({
                providerId: joi.string().required(),
            }).validate(req.query);

            if (error) {
                responseValue.error = error;
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const { providerId } = req.query;

            if (providerId !== provider.providerId) {
                responseValue.error = 'Provider not found';
                return res.status(httpStatus.BAD_REQUEST).send(responseValue);
            }

            const payload = { pid: providerId };
            const privateKey = readFileSync(path.join(process.cwd(), 'certs', 'private.pem'));
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '5min'
            });

            responseValue.data = { token };
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
