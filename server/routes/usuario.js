const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const _ = require('underscore');
const Usuario = require('../models/usuario');

//importamos los middlewares para la verificacion de token y usuario administrador
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const multer = require('multer');
const usuario = require('../models/usuario');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}.${file.originalname.split('.').pop()}`);
    }
});


const upload = multer({ storage });


app.get('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 15;

    desde = Number(desde); //parametros para filtrar la cantidad de registros de respuesta
    limite = Number(limite); //  se usa  GET -> localhost:3000/usuario/desde=5&limite=10  devuelve desde el reg 5, 10 registros de respuesta

    Usuario.find({ estado: true }, 'nombre email role estado google img') // estado:true sirve para condicionar la busqueda como un WHERE de SQL
        .skip(desde) // y la cadena  'nombre, email, etc' con los campos que quiero mostrar como select
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });

});

app.get('/usuario/self/:id', verificaToken, function(req, res) {
    const idUsuario = req.params.id;

    Usuario.findById(idUsuario, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No se encontró al usuario especificado'
                }
            });
        }

        res.json({
            ok: true,
            usuarioDB
        });
    });

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});



app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/self/:id', verificaToken, function(req, res) {
    const id = req.params.id;
    const body = req.body;

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No se encontró al usuario en la base de datos'
                }
            });
        }

        const nuevoEmail = body.emailUsuario;
        const nuevoNombre = body.nombreUsuario;
        const nuevoTelefono = body.telefonoUsuario;

        usuarioDB.email = nuevoEmail;
        usuarioDB.nombre = nuevoNombre;
        usuarioDB.telefono = nuevoTelefono;

        if (body.passwordUsuario) {
            usuarioDB.password = bcrypt.hashSync(body.passwordUsuario, 10);
        }

        if (body.imgUsuario) {
            usuarioDB.imgUsuario = body.imUsuario;
        }

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarioGuardado
            });
        });
    });

});

app.put('/usuarios/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El usuario no fue encontrado'
                }
            });
        }

        let nuevoEmail = body.email;
        let nuevoNombre = body.nombre;
        let nuevoRole = body.role;

        if (body.password) {
            usuarioDB.nombre = nuevoNombre;
            usuarioDB.email = nuevoEmail;
            usuarioDB.role = nuevoRole;
            usuarioDB.password = bcrypt.hashSync(body.password, 10);

        } else {
            usuarioDB.nombre = nuevoNombre;
            usuarioDB.email = nuevoEmail;
            usuarioDB.role = nuevoRole;
        }

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarioGuardado
            });
        });

    });

});


app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});

app.post('/usuario/self/photo', verificaToken, upload.single('profilePicture'), function(req, res) {

    const idUsuario = req.body.id;

    Usuario.findById(idUsuario, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: 'No se encontró al usuario con la ruta especificada'
                }
            });
        }

        if (usuarioDB.img === 'uploads/default.jpg') {
            usuarioDB.img = req.file.path;
            usuarioDB.save((err, usuarioGuardado) => {

                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarioGuardado
                });

            });
        } else {
            borrarImg(usuarioDB.img);
            usuarioDB.img = req.file.path;
            usuarioDB.save((err, usuarioGuardado) => {

                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarioGuardado
                });

            });
        }


    });

});

function borrarImg(path) {
    fs.unlink(path, (error) => {
        if (error) {
            console.log(error);
        }
    });
}
//exportamos el archivo app
module.exports = app;