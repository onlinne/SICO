import mongoose from 'mongoose';

const reportessegurosSchema = mongoose.Schema({
    anio:{type: String},
    mes:{type: String},
    dia:{type: String},
    valorVenta: {type: Number, required: true}
});

const ReportesSeguros = mongoose.model('ReportesSeguros',reportessegurosSchema);
export default ReportesSeguros;