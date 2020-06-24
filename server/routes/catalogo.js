const express = require('express');
let {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');
let app = express();
let Catalogo = require('../models/catalogo.js');


// ========================================
// Mostrar todos los Catalogo
// ========================================
app.get('/catalogo', verificaToken, (req, res)=>{
    Catalogo.find({})
        .exec((err, catalogos)=>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok:true,
                catalogos
            });

        })
});

// ========================================
// Mostrar Catalogo por ID
// ========================================
app.get('/catalogo/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Catalogo.findById( id, (err, catalogoDB)=>{

        if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!catalogoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok:true,
            catalogo: catalogoDB
        });


    });


});






// ========================================
// Crear nuevo Catalogo
// ========================================
app.post('/catalogo', verificaToken, (req, res)=>{
// Regresar la nueva categoria
// req.usuario._id
	let body = req.body;
	let catalogo = new Catalogo({
		nombre: body.nombre,
		ganancia: body.ganancia,
        usuario: req.usuario._id
	});


	catalogo.save((err, catalogoDB) =>{
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
        	ok:true,
        	catalogo: catalogoDB
        });


	});


});


// ========================================
// Actualizar Catalogo por ID
// ========================================
app.put('/catalogo/:id', verificaToken, (req, res)=>{
	let id= req.params.id;
    let body = req.body;

    let nomCatalogo = {
        nombre: body.nombre
    }

    Catalogo.findByIdAndUpdate(id, nomCatalogo, { new: true, runValidators: true },(err,catalogoDB)=>{
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
            ok:true,
            catalogo: catalogoDB
        });
    });

});

// ========================================
// Borra Catalogo por ID
// ========================================
app.delete('/catalogo/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{
	let id = req.params.id;
    Catalogo.findByIdAndRemove(id, (err, catalogoDB)=>{
        if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

        if (!catalogoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message:'El id no existe'
                }
            });
        }

        res.json({
            ok:true,
            message:'Catalogo Borrado'
        });

    });

});




module.exports = app;
