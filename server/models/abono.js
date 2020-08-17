var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let today = new Date();
let date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

var abonoSchema = new Schema({
    fecha: { type: String, default: `${date}T${time}` },
    cantidad: { type: Number, required: [true, 'La cantidad es necesaria'] },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: [true, 'El id del cliente es necesario'] },
    vendedor: { type: Schema.Types.ObjectId, ref: 'Vendedor', required: [true, 'El id del vendedor es necesario'] }
});


module.exports = mongoose.model('Abono', abonoSchema);