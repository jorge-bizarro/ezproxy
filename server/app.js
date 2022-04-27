const express = require('express');
const helmet = require('helmet');
const routes = require('./app.routes');
const app = express();

// Configuraciones
app.set('trust proxy', true);

// Middlewares
app.use(helmet());
app.use(express.json());

// Rutas
app.use(routes);

app.use('*', (req, res) => {
    res.send('Welcome to my API Server')
});

module.exports = app;
