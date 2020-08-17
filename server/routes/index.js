const express = require('express');
// const bcrypt = require('bcrypt');
// const Usuario = require('../models/usuario');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));

app.use(require('./abono'));
app.use(require('./catalogo'));
app.use(require('./cliente'));
app.use(require('./vendedor'));
app.use(require('./producto'));
app.use(require('./pedido'));
//app.use(require('./venta'));





module.exports = app;