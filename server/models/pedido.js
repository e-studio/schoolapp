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

let today = new Date();
let date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

var pedidoSchema = new Schema({
    fechaPedido: { type: Date, default: Date.now() },
    idClientePedido: { type: Schema.Types.ObjectId, ref: 'Cliente', required: [true, 'El id del cliente es necesario'] },
    idVendedorPedido: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El id del vendedor es necesario'] },
    idCatalogoPedido: { type: Schema.Types.ObjectId, ref: 'Catalogo', required: [true, 'El id del catalogo es necesario'] },
    productosPedido: [productoSchema],
    totalPedido: { type: Number, required: [true, 'El total es necesario'] },
    status: { type: String, default: 'Pendiente' }
});

module.exports = mongoose.model('Pedido', pedidoSchema);