var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var vendedorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    email: { type: String, required: [true, 'El email es necesario'] },
    password: {type: String, required: [true, 'La contraseña es obligatoria']},
    status: { type: String, required: false },
    vigencia: { type: Date, default: Date.now },
    foto: {type: String,required: false},
});


module.exports = mongoose.model('Vendedor', vendedorSchema);