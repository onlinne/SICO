import mongoose from 'mongoose';

const reportesUnMesClosetSchema = mongoose.Schema({
    monthReported:{type: String},
    yearReport:{type: String},
    monthReport:{type: String},
    dayReport:{type: String},
    valorVenta: {type: Number, required: true}
});

const reportesUnMesCloset = mongoose.model('reportesUnMesCloset',reportesUnMesClosetSchema);
export default reportesUnMesCloset;