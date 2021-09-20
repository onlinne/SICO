import mongoose from 'mongoose';
import NuevoClienteSeguro from '../models/ClienteSeguro.js';
import pkg from 'express-validator';
const { body, validationResult } = pkg;

export const getClientesSeguro = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	try {
		const clientesSeguro = await NuevoClienteSeguro.find();
		res.status(200).json(clientesSeguro);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createClienteSeguro = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const { cedula, nombre, telefono, direccion, correo } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const existingUser = await NuevoClienteSeguro.findOne({ cedula });
		if (existingUser)
			return res.status(400).json({ message: 'El cliente ya existe' });
		const creo = await NuevoClienteSeguro.create({
			cedula,
			nombre,
			telefono,
			direccion,
			correo,
		});
		res.status(201).json({ creo });
	} catch (error) {
		console.log(error.message);
		res.status(409).json({ message: error.message });
	}
};

export const updateClienteSeguro = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const { id: _id } = req.params;
	const { telefono, direccion, correo } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('El cliente no existe');
	const updatedClienteSeguro = await NuevoClienteSeguro.findByIdAndUpdate(
		_id,
		{ telefono, direccion, correo },
		{ new: true }
	);
	res.json(updatedClienteSeguro);
};
