require('dotenv').config();

const {
    NODE_ENV,
    PORT,
    DOMAIN_COMPANY,
    ELOGIM_PROVIDER_ID,
    ELOGIM_PROVIDER_URL,
    MSSQL_DB_NAME,
    MSSQL_DB_USER,
    MSSQL_DB_PASSWORD,
    MSSQL_DB_HOST,
    MSSQL_DB_PORT,
    MSSQL_DB_ENCRYPT,
    MSSQL_DB_ENABLE_ARITH_ABORT,
    MSSQL_DB_REQUEST_TIMEOUT,
    TRACE_REQUEST,
} = process.env;

module.exports = {
    NODE_ENV,
    TRACE_REQUEST: JSON.parse(TRACE_REQUEST || false),
    serverPort: +(PORT || 3000),
    domainCompany: DOMAIN_COMPANY,
    elogimProviderId: ELOGIM_PROVIDER_ID,
    elogimProviderUrl: ELOGIM_PROVIDER_URL,
    mssqlDatabaseName: MSSQL_DB_NAME,
    mssqlDatabaseUser: MSSQL_DB_USER,
    mssqlDatabasePassword: MSSQL_DB_PASSWORD,
    mssqlDatabaseHost: MSSQL_DB_HOST,
    mssqlDatabasePort: +MSSQL_DB_PORT,
    mssqlDatabaseEncrypt: JSON.parse(MSSQL_DB_ENCRYPT || false),
    mssqlDatabaseEnableArithAbort: JSON.parse(MSSQL_DB_ENABLE_ARITH_ABORT || false),
    mssqlDatabaseRequestTimeout: +(MSSQL_DB_REQUEST_TIMEOUT || 15000),
}
