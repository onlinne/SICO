import mongoose from 'mongoose';

const reportesseissegurosSchema = mongoose.Schema({
    anio:String,
    mes:String,
    dia:String,
    valorVenta: {type: Number, required: true}
});

const ReportesSeisSeguros = mongoose.model('ReportesSeisSeguros',reportesseissegurosSchema);
export default ReportesSeisSeguros;