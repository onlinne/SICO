import mongoose from 'mongoose';

const SchemaClienteSeguro = new mongoose.Schema({
    cedula: {type: String, required: true,maxLength: 10, unique: true},
    nombre: {type: String, required: true},
    telefono: {type: String, required: true, maxLength: 10},
    direccion: {type: String,required: false},
    correo:{type: String, required: false}
});

const NuevoClienteSeguro = mongoose.model('NuevoClienteSeguro', SchemaClienteSeguro);
 export default NuevoClienteSeguro;