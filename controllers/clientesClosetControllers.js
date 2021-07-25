import mongoose from 'mongoose';
import NuevoClienteCloset from '../models/ClienteCloset.js';

export const getClientesCloset = async (req, res) =>{
    try{
        const clientesCloset = await NuevoClienteCloset.find();
        res.status(200).json(clientesCloset);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

/*export const findById = async (req, res) =>{
    const {cedula,nombre,contrasenia} = req.body;
    try{
        const gerente = await ClienteCloset.findOne({cedula});
        return req.params._id;
    }catch(error){
        console.log(error)
        return res.status(404).json({ message: 'El usuario no existe' });
    }
    
};*/

export const createClienteCloset = async (req,res) =>{
    const {cedula,nombre,telefono,direccion,correo} = req.body;
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const existingUser = await NuevoClienteCloset.findOne({ cedula });
		if (existingUser)
			return res.status(400).json({ message: 'El cliente ya existe' });
		console.log(cedula);
        const creo = await NuevoClienteCloset.create({
            cedula,nombre,telefono,direccion,correo
        });
        res.status(201).json({creo})
    } catch (error) {
        console.log(error.message)
        res.status(409).json({message: error.message});
    }
}

export const updateClienteCloset = async (req,res) =>{
    const {id: _id} = req.params;
    const {telefono,direccion,correo} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('El cliente no existe');
    const updatedClienteCloset = await NuevoClienteCloset.findByIdAndUpdate(_id, {telefono,direccion,correo}, {new: true});
    res.json(updatedClienteCloset)
}