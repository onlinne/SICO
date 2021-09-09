import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const SchemaVentaSeguro = new mongoose.Schema({
    anio: { type: String },
    mes: { type: String },
    dia: { type: String },
    fechaExpiracion: { type: String, required: true },
    tipoVehiculo: { type: String, required: true },
    placaVehiculo: { type: String, required: true, unique: true },
    valorVenta: { type: Number, required: true },
    expiro: { type: Boolean, default: false },
    editable: { type: Boolean, default: true },
    cedulaCliente: { type: String, required: true },
})

SchemaVentaSeguro.plugin(mongoosePaginate);

const NuevaVentaSeguro = mongoose.model('NuevaVentaSeguro', SchemaVentaSeguro);
export default NuevaVentaSeguro;