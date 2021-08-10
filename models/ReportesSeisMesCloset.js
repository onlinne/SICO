import mongoose from 'mongoose';

const reportesSeisMesClosetSchema = mongoose.Schema({
    yearReport:{type: String},
    monthReport:{type: String},
    dayReport:{type: String},
    valorVenta: {type: Number, required: true}
});

const reportesSeisMesCloset = mongoose.model('reportesSeisMesCloset',reportesSeisMesClosetSchema);
export default reportesSeisMesCloset;