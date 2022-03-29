const mssql = require('mssql');
const server = require('./src/server');
const { serverPort, mssqlDatabaseName, mssqlDatabaseUser, mssqlDatabasePassword, mssqlDatabaseHost, mssqlDatabasePort, mssqlDatabaseRequestTimeout, mssqlDatabaseEncrypt, mssqlDatabaseEnableArithAbort } = require('./config/config');

const getConnectionToDatabase = () => new mssql.ConnectionPool({
    database: mssqlDatabaseName,
    user: mssqlDatabaseUser,
    password: mssqlDatabasePassword,
    server: mssqlDatabaseHost,
    port: mssqlDatabasePort,
    requestTimeout: mssqlDatabaseRequestTimeout,
    options: {
        encrypt: mssqlDatabaseEncrypt,
        enableArithAbort: mssqlDatabaseEnableArithAbort,
        requestTimeout: mssqlDatabaseRequestTimeout,
    }
}).connect();

getConnectionToDatabase()
    .then(pool => {

        server.locals.dbPool = pool;

        server.listen(serverPort, error => {

            if (error) throw error;

            console.log(`Server run on port ${serverPort}`);

        });

    })



