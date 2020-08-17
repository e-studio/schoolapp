const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

app.get('/productos/:idCatalogo', verificaToken, (req, res) => {

    let id = req.params.idCatalogo;

    Producto.find({ idCatalogoProducto: id }, '')
        .exec((err, productos) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

app.get('/productospendientes/:idCatalogo', verificaToken, (req, res) => {

    let id = req.params.idCatalogo;

    Producto.find({ idCatalogoProducto: id, statusProducto: 'Pendiente' }, '')
        .exec((err, productos) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        codigoProducto: body.codigo,
        nombreProducto: body.nombre,
        idCatalogoProducto: body.idCatalogo,
        precioProducto: body.precio,
        cantidadProducto: body.cantidad
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});



module.exports = app;