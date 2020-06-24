const express = require('express');
let {verificaToken} = require('../middlewares/autenticacion');
let app = express();
let Abono = require('../models/abono.js');


// // ========================================
// // Mostrar todos los Catalogo
// // ========================================
// app.get('/catalogo', (req, res)=>{

// });

// // ========================================
// // Mostrar Catalogo por ID
// // ========================================
// app.get('/catalogo/:id', (req, res)=>{
// 	//Catalogo.findById
// });

// ========================================
// Crear nuevo Catalogo
// ========================================
app.post('/abono', verificaToken, (req, res)=>{
// Regresar la nueva categoria
// req.usuario._id
	let body = req.body;
	let abono = new Abono({
		cliente: body.cliente,
        vendedor: body.vendedor,
        cantidad: body.cantidad,
        usuario: req.usuario._id
	});


	abono.save((err, abonoDB) =>{
		if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

        if (!abonoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
        	ok:true,
        	abono: abonoDB
        });


	});


});


// // ========================================
// // Actualizar Catalogo por ID
// // ========================================
// app.put('/catalogo/:id', (req, res)=>{
// 	//Catalogo.findById
// });

// // ========================================
// // Borra Catalogo por ID
// // ========================================
// app.delete('/catalogo/id', verificaToken, (req, res)=>{
// 	// Solo la puede borrar un administrador
// });




module.exports = app;
