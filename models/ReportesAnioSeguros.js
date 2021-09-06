import mongoose from 'mongoose';

const reportesunsegurosSchema = mongoose.Schema({
    yearReported:{type: String},
    yearReport:{type: String},
    monthReport:{type: String},
    dayReport:{type: String},
    valorVenta: {type: Number, required: true}
});

const ReportesUnSeguros = mongoose.model('ReportesUnSeguros',reportesunsegurosSchema);
export default ReportesUnSeguros;