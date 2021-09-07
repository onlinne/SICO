import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const SchemaVentaCloset = new mongoose.Schema({
    numeroContrato: { type: String, required: true, unique: true },
    contrato: { type: String, required: true },
    valorVenta: { type: Number, required: true },
    anio: { type: String },
    mes: { type: String },
    dia: { type: String },
    editable: { type: Boolean, default: true },
    cedulaCliente: { type: String, required: true }
});

SchemaVentaCloset.plugin(mongoosePaginate);


const NuevaVentaCloset = mongoose.model('NuevaVentaCloset', SchemaVentaCloset);

export default NuevaVentaCloset;
