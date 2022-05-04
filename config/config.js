// @ts-check

require('dotenv').config();

const {
    PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    ELOGIM_PROVIDER_ID,
    SECRET_KEY,
} = process.env;

module.exports = {
    PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    ELOGIM_PROVIDER_ID,
    SECRET_KEY,
}
