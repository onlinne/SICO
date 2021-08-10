import mongoose from 'mongoose';

const SchemaVentaCloset=new mongoose.Schema({
    numeroContrato:{
        type: String,
        required: true,
        unique: true
    },
    cedulaCliente:{
        type: String,
        required: true
    },
    contrato:{
        type:String,
        required: true
    },
    valorVenta:{
        type: Number,
        required: true
    },
    anio:String,
    mes:String,
    dia:String
});
const NuevaVentaCloset = mongoose.model('NuevaVentaCloset',SchemaVentaCloset);
export default NuevaVentaCloset;
