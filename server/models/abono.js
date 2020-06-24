var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var abonoSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    cantidad: { type: Number, required: [true, 'El porcentaje de ganancia es necesario'] },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    vendedor: { type: Schema.Types.ObjectId, ref: 'Vendedor' }
});


module.exports = mongoose.model('Abono', abonoSchema);