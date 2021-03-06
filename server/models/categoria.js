const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {type: String, unique: true, required: [true, 'Es necesaria una descripción'],},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
});

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );


module.exports = mongoose.model('Categoria', categoriaSchema);