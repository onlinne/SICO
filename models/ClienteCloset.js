import mongoose from 'mongoose';

const SchemaClienteCloset=new mongoose.Schema({
    cedula:{type: String,required: true,unique: true},
    nombre:{type: String,required: true},
    telefono:{type: String,required: true},
    direccion:{type:String,required: true},
    correo:{type: String,require: true}
});
const NuevoClienteCloset = mongoose.model('NuevoClienteCloset',SchemaClienteCloset);
export default NuevoClienteCloset;