const jwt = require('jsonwebtoken');

// Verificamos el token de acceso
//-------------------------------------------------------------------
let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido crack'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};


//  Validamos el ADMIN ROLE de usuario
//-------------------------------------------------------------------

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }


};



module.exports = {
    verificaToken,
    verificaAdmin_Role
};