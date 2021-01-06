
const express = require('express');

let {verificaToken, verificaAdmin_Role} = require('../midllewares/autentication');

let app = express();

let Categoria = require('../models/categoria');

//  ==============================  //
//          servicios:              //
//  ==============================  //

/*************************************************/
// Mostrar todas las categorias
/*************************************************/
app.get('/categoria', [verificaToken], (req, res) => {
    
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec( (err, cats) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments({  }, (err, conteo) => {

                res.json({
                    ok:true,
                    categorias: cats,
                    conteo: conteo,
                });
            })
        });

});

/*************************************************/
// Mostrar categoria por id
/*************************************************/
app.get('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, cat) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada',
                }
            });
        }

        // si no existe cat en DB
    
        res.json({
            ok: true,
            categoria: cat,
        });

    })
});

/*************************************************/
// Crear nueva categoria
/*************************************************/
app.post('/categoria', [verificaToken], (req, res) => {

    let body = req.body;

    let usuarioDB = req.usuario;
    let c = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioDB._id,
    });

    c.save( (err, catDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!catDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: catDB
        })
        

    });
});

/*************************************************/
// Actualizar categoria
/*************************************************/
app.put('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    let cat = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id,
    });

    Categoria.findByIdAndUpdate(id, { descripcion: cat.descripcion}, {new: true, runValidators: true, context: 'query'}, (err, catDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // si no existe cat en DB
    
        res.json({
            ok: true,
            categoria: catDB,
        });

    })
});

/*************************************************/
//eliminar
/*************************************************/
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, catBorrar) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!catBorrar) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no encontrada',
                }
            });
        }

        res.json({
            ok: true,
            categoria: catBorrar,
        });

    });
});







module.exports = app;
