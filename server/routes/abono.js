const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Abono = require('../models/abono.js');


// ========================================
// Mostrar todos los Abonos
// ========================================
app.get('/abono', verificaToken, (req, res) => {

    Abono.find({})
        .exec((err, abonos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                abonos
            });

        });
});

// ========================================
// Mostrar Abonos por ID
// ========================================
app.get('/abono/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Abono.findById(id, (err, abonoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!abonoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            abonos: abonoDB
        });


    });


});

// ========================================
// Crear nuevo Abono
// ========================================
app.post('/abono', verificaToken, (req, res) => {
    // Regresar la nueva categoria
    // req.usuario._id
    let body = req.body;
    let abono = new Abono({
        cliente: body.cliente,
        vendedor: body.vendedor,
        cantidad: body.cantidad
    });


    abono.save((err, abonoDB) => {
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
            ok: true,
            abono: abonoDB
        });


    });


});


// ========================================
// Actualizar Abono por ID
// ========================================
app.put('/abono/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    Abono.findById(id, (err, abonoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!abonoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Abono no existe'
                }
            });
        }

        abonoDB.cliente = body.cliente;
        abonoDB.vendedor = body.vendedor;
        abonoDB.cantidad = body.cantidad;
        abonoDB.fecha = body.fecha;

        abonoDB.save(err, abonoGuardado => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                abono: abonoGuardado
            });

        });

    });

});

// ========================================
// Borra Abono por ID
// ========================================
app.delete('/abono/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Abono.findByIdAndRemove(id, (err, abonoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!abonoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Abono Borrado'
        });

    });

});




module.exports = app;