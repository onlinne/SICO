import mongoose from 'mongoose';

const SchemaSeguroVencido = new mongoose.Schema({
    fechaVenta: Date,
    fechaExpiracion: String,
    tipoVehiculo:String,
    placaVehiculo:String,
    cedulaCliente:String,
    valorVenta: Number,
    expiro: Boolean
});
const SeguroVencido = mongoose.model("SeguroVencido",SchemaSeguroVencido);
export default SeguroVencido;