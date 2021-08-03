import mongoose from 'mongoose';

const SchemaVentaSeguro = new mongoose.Schema({
    anio:String,
    mes:String,
    dia:String,
    fechaExpiracion:{type:String, required:true},
    tipoVehiculo: {type: String, required: true},
    placaVehiculo: {type: String, required: true, unique:true},
    cedulaCliente: {type: String, required: true},
    valorVenta: {type: Number, required: true},
    expiro: {type: Boolean, default: false}
})

const NuevaVentaSeguro = mongoose.model('NuevaVentaSeguro', SchemaVentaSeguro);
export default NuevaVentaSeguro;