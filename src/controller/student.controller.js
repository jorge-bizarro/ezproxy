import httpStatus from "http-status";
import express from "express";
import joi from "joi";

/**
 * Obtener la información del estudiante
 * 
 * @param {express.Request} req 
 * @param {express.Response} res  
 */
export const getInformation = (req, res) => {
    const responseValue = {
        ok: false,
        errorMessage: null,
        data: null,
    }

    try {
        const { error } = joi.object({
            email: joi.string().email().required()
        }).validate(req.query)

        if (error) {
            responseValue.errorMessage = error.details[0];
            return res.status(httpStatus.BAD_REQUEST).send(responseValue);
        }

        const { email } = req.query;
        const studentID = String(email).split("@")[0].trim();

        const dataResponse = {
            name: 'Jon Doe',
            studentID,
        }

        responseValue.data = dataResponse;
        responseValue.ok = true;
        res.status(200);
    } catch (error) {
        responseValue.errorMessage = '' + error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }

    res.send(responseValue)
}
