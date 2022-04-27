// @ts-check

const { getConnectionPool } = require('./utils/db');
const server = require('./server/app');
const { PORT } = require('./config/config');

getConnectionPool()
    .then((connectionPool) => {
        server.locals.dbPool = connectionPool;

        server.listen(PORT, () => {
            console.log(`Server run on port ${PORT}`);
        });
    })

