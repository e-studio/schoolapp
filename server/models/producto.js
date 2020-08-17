var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    codigoProducto: { type: String, required: [true, 'El codigo es necesario'] },
    nombreProducto: { type: String, required: [true, 'El nombre es necesario'] },
    idCatalogoProducto: { type: String, required: [true, 'El catalogo es necesario'] },
    precioProducto: { type: Number, required: [true, 'El precio es necesario'] },
    cantidadProducto: { type: Number, required: [true, 'La cantidad es necesaria'] },
    statusProducto: { type: String, default: 'Pendiente' }
});

module.exports = mongoose.model('Producto', productoSchema);