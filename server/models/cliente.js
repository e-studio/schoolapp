var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    telefono: { type: String, required: [true, 'El telefono es necesario'] },
    email: { type: String, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    adeuda: { type: Number, required: [true, 'El precio es necesario'] },
    pagos: { type: Number, required: [true, 'El pagos es necesario'] },
    status: { type: String, required: false },
    vendedor: { type: Schema.Types.ObjectId, ref: 'Vendedor' }

});

//esta funcion sirve para eliminar el objeto password cuando mandamos
//imprimir el resultado del PUT, para que no devuelva el pass
clienteSchema.methods.toJSON = function() {

    let cliente = this;
    let clienteObject = cliente.toObject();
    delete clienteObject.password;

    return clienteObject;
}


module.exports = mongoose.model('Cliente', clienteSchema);