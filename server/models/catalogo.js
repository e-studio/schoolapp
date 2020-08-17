var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var catalogoSchema = new Schema({
    idVendedor: { type: Schema.Types.ObjectId, required: [true, 'El id del vendedor es necesario'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    ganancia: { type: Number, required: [true, 'El porcentaje de ganancia es necesario'] }
});


module.exports = mongoose.model('Catalogo', catalogoSchema);