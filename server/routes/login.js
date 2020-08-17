const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

////    Login normal de un usuario con su nombre y password /////////////////////////////////////////
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuarioDB: usuarioDB,
            token
        });
    });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// configuraciones de google para el acceso  //////////////////////////////////////////////////////////////////
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        //los datos del lado izquierdo son los que definimos en nuestro schema de la BD de mongoDB
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}
//verify().catch(console.error);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///  esta es la ruta para cuando accesamos con la cuenta de google   ///////////////////////////////////////////////

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token) /// se verifica el usuario y pass de google
        .catch(e => {
            return res.status(403).json({ //// si hay un error en la validacion nos genera el error
                ok: false,
                err: e
            });
        });

    //Si pasa la validacion de Google, Tenemos un objeto con todos los datos del usuario "googleUser",  revisamos si ya esta en la base de datos  ////////////////////////
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) { //  el usuario si existe en la BD
            if (usuarioDB.google === false) { /// y se autentico con usuario y pass normal, no lo debo dejar entrar
                return res.status(400).json({
                    ok: false,
                    err: { message: 'Debe usar su autenticacion normal' }
                });
            } else { //  el usuario si se autentico mediente su cuenta de Google,
                let token = jwt.sign({ // renuevo el token, con el propio de mi aplicacion
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({ // y lo regreso como resultado
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Cuando el usuario es correctamente logeado por google pero no existe en nuestra BD
            let usuario = new Usuario(); // creo un nuevo objeto para registrarlo en la BD como nuevo usuario

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; //esto es para pasar la validacion de nuestra BD que indica que debe escribir un password, pero este no lo vamos a usar en el login
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });


    ////Con este codigo muestro los datos de la cuenta de google en caso de no haber error
    // res.json({
    // 	usuario: googleUser
    // });
});
/////////////////////////////////////////////////////////////////////////


//exportamos el archivo app
module.exports = app;