require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');

// console.log(bcrypt.hashSync('1234', 10));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
//habilitar el acceso a la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', 'http://u3digital.com.mx/ventas/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Configuracion Global de Rutas, todas las rutas se guardan en el archivo routes/index.js
app.use(require('./routes/index.js'));



mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});