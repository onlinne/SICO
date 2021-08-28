import mongoose from 'mongoose';

const SchemaVentaCloset=new mongoose.Schema({
    numeroContrato:{ type: String, required: true, unique: true},
    contrato:{ type:String, required: true},
    valorVenta:{ type: Number,required: true},
    anio:{ type: String},
    mes:{ type: String},
    dia:{ type: String},
    editable: {type: Boolean, default: true},
    cliente:{type: mongoose.Schema.Types.ObjectId, ref:'ClienteCloset'}
});

const SchemaClienteCloset=new mongoose.Schema({
    _id:String,
    cedula:{type: String,required: true,maxLength:10,unique: true},
    nombre:{type: String,required: true},
    telefono:{type: String,required: true,maxLength:10},
    direccion:{type:String,required: true},
    correo:{type: String,require: false},
    venta:[{type: mongoose.Schema.Types.ObjectId, ref:'NuevaVentaCloset'}]
});

export const ClienteCloset = mongoose.model('ClienteCloset',SchemaClienteCloset);


const NuevaVentaCloset = mongoose.model('NuevaVentaCloset',SchemaVentaCloset);
export default NuevaVentaCloset;
