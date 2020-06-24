var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ventaSchema = new Schema({
    fecha: { type: Date, default: Date.now },
    total: { type: Number, required: [true, 'El total es necesario'] },
    catalogo: { type: Schema.Types.ObjectId, ref: 'Catalogo' },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    vendedor: { type: Schema.Types.ObjectId, ref: 'Vendedor' },
    productos:{
    	nombre: { type: String, required: [true, 'El nombre es necesario'] },
    	precio: { type: Number, required: [true, 'El precio es necesario'] },
    	cantidad: { type: Number, required: [true, 'La cantidad es necesaria'] },
    	status: { type: String, required: [true, 'El status es necesario'] }
    }
});


module.exports = mongoose.model('Venta', ventaSchema);