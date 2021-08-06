import mongoose from 'mongoose';

const reportesunsegurosSchema = mongoose.Schema({
    anio:String,
    mes:String,
    dia:String,
    valorVenta: {type: Number, required: true}
});

const ReportesUnSeguros = mongoose.model('ReportesUnSeguros',reportesunsegurosSchema);
export default ReportesUnSeguros;