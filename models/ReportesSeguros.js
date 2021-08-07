import mongoose from 'mongoose';

const reportessegurosSchema = mongoose.Schema({
    monthReported:{type: String},
    yearReport:{type: String},
    monthReport:{type: String},
    dayReport:{type: String},
    valorVenta: {type: Number, required: true}
});

const ReportesSeguros = mongoose.model('ReportesSeguros',reportessegurosSchema);
export default ReportesSeguros;