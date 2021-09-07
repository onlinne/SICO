import mongoose from 'mongoose';

const SchemaClienteCloset = new mongoose.Schema({
    cedula: { type: String, required: true, maxLength: 10, unique: true },
    nombre: { type: String, required: true },
    telefono: { type: String, required: true, maxLength: 10 },
    direccion: { type: String, required: true },
    correo: { type: String, require: false },
    compras: { type: [String], default: null }
});
const NuevoClienteCloset = mongoose.model('NuevoClienteCloset', SchemaClienteCloset);
export default NuevoClienteCloset;