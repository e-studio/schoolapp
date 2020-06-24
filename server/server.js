require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar el acceso a la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));



// Configuracion Global de Rutas, todas las rutas se guardan en el archivo routes/index.js
app.use(require('./routes/index.js'));



mongoose.connect(process.env.URLDB, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');

    });



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});