const express = require('express');
const helmet = require('helmet');
const studentRoutesV1 = require('./routes/student.routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.set('trust proxy', true);
app.set('BDUCCIConfig', {
    database: 'BDUCCI',
    user: 'SSAppLinux',
    password: 'killbducci4me',
    server: '172.16.3.53',
    port: 1433,
    options: {
        encrypt: false,
        enableArithAbort: false,
        requestTimeout: 300000,
    }
})

app.use(helmet());
app.use(express.json());

app.use('/api/v1/student', studentRoutesV1);

app.use('/*', (req, res) => {
    res.send('Welcome to my API Server')
});

app.listen(port, (err) => {
    if (err) throw err;

    console.log(`Server run on port: ${port}`);
});


const fs = require('fs');

const funCLog = console.log;

console.log = function () {
    funCLog.apply(this, arguments)
    fs.appendFileSync('./console.log', `${new Date().toLocaleString()} -> ${Array.prototype.join.call(arguments, ' ')}\n`)
}

