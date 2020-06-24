const express = require('express');
const bcrypt = require('bcrypt');
let {verificaToken} = require('../middlewares/autenticacion.js');
let app = express();
let Cliente = require('../models/cliente.js');


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
app.post('/cliente', verificaToken, (req, res)=>{
// Regresar la nueva categoria
// req.usuario._id
	let body = req.body;

	let cliente = new Cliente({
		nombre: body.nombre,
        apellidos: body.apellidos,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		usuario: req.usuario._id
	});

	cliente.save((err, clienteDB) =>{
		if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

        if (!clienteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
        	ok:true,
        	cliente: clienteDB
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
