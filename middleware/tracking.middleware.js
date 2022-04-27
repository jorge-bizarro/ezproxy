// @ts-check

const express = require('express');
const Logger = require('../utils/logger');

class TrackingMiddleware {

    /**
     * Tracear las peticiones entrantes y el resultado saliente
     *
     * @param {express.Request} req Petición
     * @param {express.Response} res Respuesta
     * @param {express.NextFunction} next Función siguiente
     *
     */
    static track(req, res, next) {
        const [responseWritter, responseOnEnd] = [res.write, res.end];
        const { headers, body, params, query } = req;
        const ipOrigin = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            const requestContentJson = {
                ip: ipOrigin,
                headers: JSON.stringify(headers),
                body: JSON.stringify(body),
                params: JSON.stringify(params),
                query: JSON.stringify(query),
            }

            Logger.writeLog('TrackingMiddleware.track', `Nueva petición ${JSON.stringify(requestContentJson)}`, Logger.Severity.Debug);

            const chunks = [];

            res.write = function (chunk) {
                chunks.push(chunk);
                return responseWritter.apply(this, arguments);
            }

            res.end = function (chunk) {
                if (chunk) {
                    chunks.push(chunk);
                }

                const responseBody = Buffer.concat(chunks).toString('utf8');
                const responseContentJson = {
                    statusCode: this.statusCode,
                    statusMessage: this.statusMessage,
                    body: responseBody,
                };

                Logger.writeLog('TrackingMiddleware.track', `Resultado ${JSON.stringify(responseContentJson)}`, Logger.Severity.Debug);

                return responseOnEnd.apply(this, arguments);
            }
        } catch (error) {
            Logger.writeLog('TrackingMiddleware.track', error, Logger.Severity.Error);
        }

        next();
    }
}

module.exports = TrackingMiddleware;

