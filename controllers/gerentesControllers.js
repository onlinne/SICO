import mongoose from 'mongoose';
import NuevoGerente from '../models/Gerente.js';

export const getGerentes = async (req, res) =>{
    try{
        const gerentes = await NuevoGerente.find();
        console.log(gerentes)
        res.status(200).json(gerentes);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

/*export const findById = async (req, res) =>{
    const {cedula,nombre,contrasenia} = req.body;
    try{
        const gerente = await NuevoGerente.findOne({cedula});
        return req.params._id;
    }catch(error){
        console.log(error)
        return res.status(404).json({ message: 'El usuario no existe' });
    }
    
};*/

export const createGerentes = async (req,res) =>{
    const {cedula,nombre,contrasenia} = req.body;
    try {
        const existingUser = await NuevoGerente.findOne({ cedula });
		if (existingUser)
			return res.status(400).json({ message: 'El usuario ya existe' });
		console.log(cedula);
        const creo = await NuevoGerente.create({
            cedula,nombre,contrasenia
        });
        res.status(201).json({creo})
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateGerente = async (req,res) =>{
    const {id: _id} = req.params;
    const {contrasenia} = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('El gerente no existe');
    const updatedGerente = await NuevoGerente.findByIdAndUpdate(_id, {contrasenia}, {new: true});
    res.json(updatedGerente)
}

export const deleteGerente = async (req,res) =>{
    const {id:_id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('El gerente no existe');
    await NuevoGerente.findByIdAndRemove(_id);
    console.log('DELETE');
    res.json({message: 'Gerente eliminado'});
}