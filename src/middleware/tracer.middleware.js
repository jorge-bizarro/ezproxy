const express = require('express');
const { writeLog } = require('../../lib');
const uuid = require('uuid');

class TracerMiddleware {

    /**
     * Tracear las peticiones entrantes y el resultado saliente
     *
     * @param {express.Request} req Petición
     * @param {express.Response} res Respuesta
     * @param {express.NextFunction} next Función siguiente
     *
     */
    static trace(req, res, next) {
        const idTrace = uuid.v4();
        const [responseWritter, responseOnEnd] = [res.write, res.end];
        const { method, originalUrl, headers, body, params, query } = req;
        const ipOrigin = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        try {
            const requestContentJson = {
                idTrace,
                method,
                originalUrl,
                hostOrigin: headers['origin'],
                agent: headers['user-agent'],
                ip: ipOrigin,
                headers: JSON.stringify(headers),
                body: JSON.stringify(body),
                params: JSON.stringify(params),
                query: JSON.stringify(query),
            }

            writeLog(`TRACE : Petición ${JSON.stringify(requestContentJson, null, '\t')}`, null, 'info');

            let chunks = [];

            res.write = function (chunk) {
                chunks.push(chunk);
                return responseWritter.apply(this, arguments);
            }

            res.end = function (chunk) {
                if (chunk) {
                    chunks.push(chunk);

                    const responseBody = Buffer.concat(chunks).toString('utf8');
                    const responseContentJson = {
                        idTrace,
                        statusCode: this.statusCode,
                        statusMessage: this.statusMessage,
                        body: responseBody,
                    };

                    writeLog(`TRACE : Respuesta ${JSON.stringify(responseContentJson, null, '\t')}`, null, 'info');
                }

                responseOnEnd.apply(this, arguments);
            }
        } catch (error) {
            writeLog('' + error, null, 'error');
        }

        next();
    }
}

module.exports = TracerMiddleware;

