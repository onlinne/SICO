import mongoose from 'mongoose';
import NuevoGerente from '../models/Gerente.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'express-validator';
const {body, validationResult} = pkg;

export const getGerentes = async (req, res) =>{
    try{
        const gerentes = await NuevoGerente.find();
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

export const signin = async (req, res) => {
	const { cedula, contrasenia } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
	try {
		const existingUser = await NuevoGerente.findOne({ cedula });
		console.log(existingUser);
        if (!existingUser)
			return res.status(404).json({ message: 'El usuario no existe' });

		const isPasswordCorrect = await bcrypt.compare(
			contrasenia,
			existingUser.contrasenia
		);

		if (!isPasswordCorrect)
			return res.status(400).json({ message: 'Credenciales inválidas' });

		const token = jwt.sign(
			{ cedula: existingUser.cedula, id: existingUser._id },
			'test',
			{ expiresIn: '1h' }
		);

		res.status(200).json({ result: existingUser, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Something went wrong' });
	}
};


export const createGerentes = async (req,res) =>{
    const {cedula,nombre,contrasenia} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const existingUser = await NuevoGerente.findOne({ cedula });
		if (existingUser)
			return res.status(400).json({ message: 'El usuario ya existe' });
		console.log(cedula);
        const hashedPassword = await bcrypt.hash(contrasenia, 12);
        const creo = await NuevoGerente.create({
            cedula,nombre,contrasenia: hashedPassword
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