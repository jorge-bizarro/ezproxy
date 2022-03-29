const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const app = express();

// Configuraciones
app.set('trust proxy', true);

app.use(helmet());
app.use(express.json());

app.use(routes);
app.use('/**', (_, response) => response.send('Welcome to my API Server'));

module.exports = app;
