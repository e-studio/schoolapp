var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    nombres: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    email: { type: String, required: [true, 'El email es necesario'] },
    adeuda: { type: Number, required: [true, 'El adeudo es necesario'] },
    compras: { type: Number, required: [true, 'Las compras son necesarias'] },
    status: { type: String, required: false, default: 'status' },
    vendedor: { type: Schema.Types.ObjectId, required: [true, 'El vendedor es necesario'], ref: 'Vendedor' }

});

//esta funcion sirve para eliminar el objeto password cuando mandamos
//imprimir el resultado del PUT, para que no devuelva el pass

module.exports = mongoose.model('Cliente', clienteSchema);