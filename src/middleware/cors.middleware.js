import cors from "cors";
import express from "express";
import httpStatus from "http-status";

/**
 * Restricción de origen en base a una lista blanca solo si es en producción
 *
 * @param {(string|string[])} whitelist
 */
export const verifyOriginMiddleware = (whitelist) => {

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
                // console.log(req.ip, req.headers['x-forwarded-for'], req.socket.remoteAddress, req.originalUrl, req.headers['user-agent']);
                console.log(`Attempted access from: ${origin} | ip: ${ipOrigin}`);

                if (process.env.NODE_ENV === 'production' && !whiteList.includes(origin)) {
                    console.log(`Access denied for: ${origin} | ip: ${ipOrigin}`);

                    res.status(httpStatus.FORBIDDEN).send('Recurso no disponible')
                } else {
                    cors()(req, res, next);
                }

            }
        })(req, res, next);

    }
}




