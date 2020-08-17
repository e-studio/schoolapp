const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Catalogo = require('../models/catalogo.js');


// ========================================
// Mostrar todos los Catalogo
// ========================================
app.get('/catalogo', verificaToken, (req, res) => {

    Catalogo.find({})
        .sort('nombre')
        .populate('usuarios', 'nombre email')
        .populate('clientes', 'nombre')
        .exec((err, catalogos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                catalogos
            });

        });
});

app.get('/catalogos/usuario/:id', verificaToken, (req, res) => {
    const idUsuario = req.params.id;

    Catalogo.find({ idVendedor: idUsuario }).exec(
        (err, catalogos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!catalogos) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontraron catálogos con el id especificado'
                    }
                });
            }

            res.json({
                ok: true,
                catalogos
            });
        }
    );

});

// ========================================
// Mostrar Catalogo por ID
// ========================================
app.get('/catalogo/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Catalogo.findById(id, (err, catalogoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!catalogoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            catalogo: catalogoDB
        });


    });


});

app.post('/catalogos', verificaToken, (req, res) => {

    const idCatalogos = req.body.idCatalogos;
    Catalogo.find({
        '_id': { $in: idCatalogos }
    }, (err, catalogosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!catalogosDB) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            catalogosDB
        });
    });

});
// ========================================
// Crear nuevo Catalogo
// ========================================
app.post('/catalogo', verificaToken, (req, res) => {
    // Regresar la nueva categoria
    // req.usuario._id
    let catalogoBody = req.body.catalogo;
    let catalogo = new Catalogo({
        nombre: catalogoBody.nombre,
        ganancia: catalogoBody.ganancia,
        idVendedor: req.body.idVendedor
    });


    catalogo.save((err, catalogoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!catalogoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            catalogo: catalogoDB
        });


    });


});


// ========================================
// Actualizar Catalogo por ID
// ========================================
app.put('/catalogo/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let nomCatalogo = {
        nombre: body.nombre
    };

    Catalogo.findByIdAndUpdate(id, nomCatalogo, { new: true, runValidators: true }, (err, catalogoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!catalogoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            catalogo: catalogoDB
        });
    });

});

// ========================================
// Borra Catalogo por ID
// ========================================
app.delete('/catalogo/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Catalogo.findByIdAndRemove(id, (err, catalogoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!catalogoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Catalogo Borrado'
        });

    });

});




module.exports = app;