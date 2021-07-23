import mongoose from 'mongoose';

const SchemaVentaSeguro = new mongoose.Schema({
    fechaVenta: {type: Date, default: new Date()},
    tipoVehiculo: {type: String, required: true},
    placaVehiculo: {type: String, required: true},
    cedulaCliente: {type: String, unique: true, required: true},
    valorVenta: {type: Number, required: true}
})

const NuevaVentaSeguro = mongoose.model('NuevaVentaSeguro', SchemaVentaSeguro);
export default NuevaVentaSeguro;