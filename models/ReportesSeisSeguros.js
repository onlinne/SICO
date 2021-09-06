import mongoose from 'mongoose';

const reportesseissegurosSchema = mongoose.Schema({
    yearReport:{type: String},
    monthReport:{type: String},
    dayReport:{type: String},
    valorVenta: {type: Number, required: true}
});

const ReportesSeisSeguros = mongoose.model('ReportesSeisSeguros',reportesseissegurosSchema);
export default ReportesSeisSeguros;