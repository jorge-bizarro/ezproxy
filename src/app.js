require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const personRoutesV1 = require('./routes/person.routes');
const authRoutesV1 = require('./routes/auth.routes');
const { bducciConfiguration } = require('../config/config.json');
const { TracerMiddleware } = require('./middleware')
const app = express();
const port = process.env.PORT || 3000;

// Configuraciones
app.set('trust proxy', true);
app.set('BDUCCIConfig', bducciConfiguration);

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(TracerMiddleware.trace);

// Rutas
app.use('/api/v1/o/auth', authRoutesV1);
app.use('/api/v1/person', personRoutesV1);

app.use('/*', (req, res) => {
    res.send('Welcome to my API Server')
});

app.listen(port, (err) => {
    if (err) throw err;

    console.log(`Server run on port: ${port}`);
});
