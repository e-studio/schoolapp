const express = require('express');
const bcrypt = require('bcrypt');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion.js');
let app = express();
let Vendedor = require('../models/vendedor.js');


// // ========================================
// // Mostrar todos los Clientes
// // ========================================
// app.get('/cliente', (req, res)=>{

// });

// // ========================================
// // Mostrar Clientes por ID
// // ========================================
// app.get('/cliente/:id', (req, res)=>{
// 	//Cliente.findById
// });

// ========================================
// Crear nuevo Cliente
// ========================================
app.post('/vendedor', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Regresar la nueva categoria
    // req.usuario._id
    let body = req.body;

    let vendedor = new Vendedor({
        nombre: body.nombre,
        apellidos: body.apellidos,
        telefono: body.telefono,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        usuario: req.usuario._id
    });

    vendedor.save((err, vendedorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!vendedorDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            vendedor: vendedorDB
        });


    });


});


// // ========================================
// // Actualizar Clientes por ID
// // ========================================
// app.put('/cliente/:id', (req, res)=>{
// 	//Cliente.findById
// });

// // ========================================
// // Borra Clientes por ID
// // ========================================
// app.delete('/cliente/id', verificaToken, (req, res)=>{
// 	// Solo la puede borrar un administrador
// });




module.exports = app;