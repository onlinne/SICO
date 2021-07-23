import mongoose from 'mongoose';

const SchemaClienteSeguro = new mongoose.Schema({
    cedula: {type: String, required: true, unique: true},
    nombre: {type: String, required: true},
    telefono: {type: String, required: true},
    direccion: {type: String,required: true},
    correo:{type: String, required: false}
});

const NuevoClienteSeguro = mongoose.model('NuevoClienteSeguro', SchemaClienteSeguro);
 export default NuevoClienteSeguro;