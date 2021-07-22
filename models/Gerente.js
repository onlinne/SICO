import mongoose from 'mongoose';

const gerenteSchema = mongoose.Schema({
    cedula: {type: String, unique:true,required:true},
    nombre: {type: String,required:true},
    contrasenia: {type: String,required:true}
});

const NuevoGerente = mongoose.model('NuevoGerente',gerenteSchema);
export default NuevoGerente;