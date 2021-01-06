const _ = require('underscore');
const express = require('express');


let {verificaToken} = require('../midllewares/autentication');
const categoria = require('../models/categoria');

let app = express();

let Producto = require('../models/producto');


//  ==============================  //
//          servicios:              //
//  ==============================  //

/*************************************************/
//              Obtener productos
/*************************************************/
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find( { disponible: true }, )
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({
                    ok:true,
                    productos: productos,
                    conteo: conteo,
                });
            })
        });
    // trae todos los productos
    // populate: usuario categoria
    // paginado
});

/*************************************************/
//              Obtener producto por id
/*************************************************/
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, prodDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: prodDB
        });
    });
    // populate: usuario categoria
    
});

/*************************************************/
//              Buscar producto
/*************************************************/
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find( {nombre: regex} )
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

/*************************************************/
//              Crear un producto
/*************************************************/
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    
    let body = req.body;
    let usuario = req.usuario;

    let nuevoProducto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria_id,
        usuario: usuario._id,
        disponible: body.disponible,
    });

    nuevoProducto.save( (err, prodDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });

        }

        res.status(201).json({
            ok: true,
            producto: prodDB
        });

    } );
    
});

/*************************************************/
//              Actualizar un producto
/*************************************************/
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;

    //let usuario = req.usuario;

    let prod = _.pick( req.body,  ['nombre','precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, prod, {new: true, runValidators: true, context: 'query'}, (err, prodDB) => {

        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: prodDB,
        });

    })

    
});

/*************************************************/
//              Borrar un producto
/*************************************************/
app.delete('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no encontrado',
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save( (e, borrado) => {
            if (e) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: borrado,
                mensaje: 'Producto borrado'
            });
        })

    })
    
});

module.exports = app;