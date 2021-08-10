import mongoose from 'mongoose';

const reportesAnioClosetSchema = mongoose.Schema({
    yearReported:{type: String},
    yearReport:{type: String},
    monthReport:{type: String},
    dayReport:{type: String},
    valorVenta: {type: Number, required: true}
});

const reportesAnioCloset = mongoose.model('reportesAnioCloset',reportesAnioClosetSchema);
export default reportesAnioCloset;