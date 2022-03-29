const cors = require('cors');
const express = require('express');
const httpStatus = require('http-status');
const Logger = require('../../lib/logger');
const { NODE_ENV } = require('../../config/config');

class CorsMiddleware {

    /**
     * Restricción de origen en base a una lista blanca
     * * Importante: Solo funciona en el entorno de producción
     *
     * @param {(string|string[])} whitelist
     */
    static verifyOrigin(whitelist) {

        /**
         * @param {express.Request} req
         * @param {express.Response} res
         * @param {express.NextFunction} next
         */
        return (req, res, next) => {
            const whiteList = (whitelist instanceof Array) ? whitelist : [whitelist];

            cors({
                origin: (origin) => {
                    const ipOrigin = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                    const urlOrigin = req.headers['origin'];

                    if (NODE_ENV === 'production' && !whiteList.includes(origin)) {
                        Logger.writeLog('CorsMiddleware.verifyOrigin', `Recurso denegado para el origen: ${urlOrigin} | IP: ${ipOrigin}`, Logger.Severity.Info);
                        res.status(httpStatus.FORBIDDEN).send({ ok: false, error: 'Resource denied' });
                    } else {
                        cors()(req, res, next);
                    }

                }
            })(req, res, next);

        }
    }

}

module.exports = CorsMiddleware;

