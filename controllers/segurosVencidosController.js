import mongoose from 'mongoose';
import SeguroVencido from '../models/SegurosVencidos.js';

export const getSeguroVencido = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	try {
		const clientesSeguro = await SeguroVencido.find();
		res.status(200).json(clientesSeguro);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createSeguroVencido = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const { seguroVendido } = req.body;
	try {
		const creo = await SeguroVencido.create({
			seguroVendido,
		});
		res.status(201).json({ creo });
	} catch (error) {
		console.log(error.message);
		res.status(409).json({ message: error.message });
	}
};
