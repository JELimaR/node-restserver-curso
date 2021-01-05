const jwt = require('jsonwebtoken');

// Verificar token

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'token no valido',
                }
            });
        }

        req.usuario = decoded.usuario;
        next();


    } );
};

// Verifica adminRole

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador',
            }
        });
    }

    next();

}; 

module.exports = {
    verificaToken: verificaToken,
    verificaAdmin_Role: verificaAdmin_Role,
}