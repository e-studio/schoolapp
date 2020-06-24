const express = require('express');
// const bcrypt = require('bcrypt');
// const Usuario = require('../models/usuario');
const app = express();


app.use(require('./usuario.js'));
app.use(require('./login.js'));




module.exports = app;