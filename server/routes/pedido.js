const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Pedido = require('../models/pedido');
const pedido = require('../models/pedido');

app.post('/pedidos', verificaToken, (req, res) => {

    let body = req.body;
    let pedido = new Pedido({
        idClientePedido: body.idClientePedido,
        idVendedorPedido: body.idVendedorPedido,
        idCatalogoPedido: body.idCatalogoPedido,
        productosPedido: body.productosPedido,
        totalPedido: body.totalPedido
    });

    pedido.save((err, pedidoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!pedidoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            pedidoDB
        });
    });

});

app.get('/pedidos', verificaToken, (req, res) => {
    Pedido.find({}, '').exec(
        (err, pedidos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pedidos
            });
        }
    );
});

app.get('/pedidos/:idVendedor', verificaToken, (req, res) => {

    let idVendedor = req.params.idVendedor;
    Pedido.find({ idVendedorPedido: idVendedor }, '').exec(
        (err, pedidos) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pedidos
            });
        }
    );

});

app.post('/pedidos/portipo/:tipo', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let idVendedor = req.body.idVendedor;

    Pedido.find({ idVendedorPedido: idVendedor, status: tipo }).exec(
        (err, pedidos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!pedidos) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'No se encontraron pedidos'
                    }
                });
            }

            res.json({
                ok: true,
                pedidos
            });
        }
    );

});

app.put('/pedidos/completar', verificaToken, (req, res) => {

    const idPedido = req.body.idPedido;
    const statusPedido = req.body.statusPedido;

    Pedido.findById(idPedido, (err, pedidoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!pedidoDB) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No se encontró un pedido con ese id'
                }
            });
        }

        pedidoDB.status = statusPedido;

        pedidoDB.save((err, pedidoGuardado) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                pedidoGuardado
            });
        });

    });

});

app.put('/pedidos/producto', verificaToken, (req, res) => {
    const idProducto = req.body.idProducto;
    const idPedido = req.body.idPedido;
    const status = req.body.statusProducto;

    Pedido.findById(idPedido, (err, pedidoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        console.log(pedidoDB.productosPedido.id(idProducto));

        if (pedidoDB.productosPedido.id(idProducto)) {
            let producto = pedidoDB.productosPedido.id(idProducto);
            producto.statusProducto = status;

            pedidoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productoGuardado
                });
            });

        }

    });

});

module.exports = app;