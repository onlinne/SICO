import mongoose from 'mongoose';
import NuevoClienteCloset from './ClienteCloset.js';

const SchemaVentaCloset=new mongoose.Schema({
    numeroContrato:{ type: String, required: true, unique: true},
    Cliente:{ type: mongoose.Schema.Types.ObjectId, ref: NuevoClienteCloset, required: true},
    contrato:{ type:String, required: true},
    valorVenta:{ type: Number,required: true},
    anio:{ type: String},
    mes:{ type: String},
    dia:{ type: String},
    editable: {type: Boolean, default: true}
});
const NuevaVentaCloset = mongoose.model('NuevaVentaCloset',SchemaVentaCloset);
export default NuevaVentaCloset;
