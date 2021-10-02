import mongoose from 'mongoose';
import NuevaVentaCloset from '../models/VentaCloset.js';
import NuevoClienteCloset from '../models/ClienteCloset.js';
import ReportesUnMesCloset from '../models/ReportesUnMesCloset.js';
import ReportesSeisMesCloset from '../models/ReportesSeisMesCloset.js';
import ReportesAnioCloset from '../models/ReportesAnioCloset.js';

import pkg from 'express-validator';
const { body, validationResult } = pkg;

export const getVentasCloset = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	try {
		const pagination = req.header('range-limit');
		let splitPagination = pagination.split('-');
		const options = {
			page: splitPagination[0],
			limit: splitPagination[1],
			collation: {
				locale: 'es',
			},
		};
		const { page, limit } = req.body;
		const ventasCloset = await NuevaVentaCloset.paginate({}, options);
		res.status(200).json(ventasCloset);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

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

export const createVentaCloset = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const { fechaVenta, numeroContrato, cliente, contrato, valorVenta } =
		req.body;
	const fechaHoy = new Date(fechaVenta);
	fechaHoy.setHours(0, 0, 0, 0);
	const anio = fechaHoy.getFullYear();
	const mes = fechaHoy.getMonth() + 1;
	const dia = fechaHoy.getDate();
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let existingContract = await NuevaVentaCloset.findOne({
			numeroContrato,
		});
		if (existingContract) {
			return res.status(400).json({
				message:
					'Una venta con este numero de contrato ya fue registrado',
			});
		}

		let customerFound = {};
		if (req.params.flag === String(0)) {
			customerFound = await NuevoClienteCloset.find({ cedula: cliente });
		}
		if (req.params.flag === String(1)) {
			customerFound = await NuevoClienteCloset.find({ nombre: cliente });
		}
		if (!customerFound) {
			res.status(409).json({
				message:
					'El cliente ingresador no esta registrado, por favor creelo antes de intentar registrar una venta a este cliente',
			});
		}
		if (customerFound) {
			let sellCreate = await NuevaVentaCloset.create({
				numeroContrato: numeroContrato,
				contrato: contrato,
				valorVenta: valorVenta,
				anio: anio,
				mes: mes,
				dia: dia,
				cedulaCliente: customerFound[0].cedula,
			});
			const clienteEncontrado = await NuevoClienteCloset.findOne({
				cedula: cliente,
			});
			await clienteEncontrado.compras.push(sellCreate._id);
			await clienteEncontrado.save();
			res.status(200).json({ message: 'Venta de closet registrada' });
		}
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const updateVentaCloset = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const { id: _id } = req.params;
	const { numeroContrato, cedulaCliente, contrato, valorVenta, registrada } =
		req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('La venta no existe');
	const updatedVenta = await NuevaVentaCloset.findByIdAndUpdate(
		_id,
		{ cedula, nombre, contrasenia },
		{ new: true }
	);
	res.json(updatedVenta);
};

export const sumaVentas1Mostrar = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const fechaHoy = new Date();
	const anio = fechaHoy.getFullYear();
	const mes = fechaHoy.getMonth();
	const mesAnterior = fechaHoy.getMonth() - 1;
	try {
		const ventasCloset = await NuevaVentaCloset.find({
			anio: anio,
			mes: mesAnterior,
		});
		const reporteUnMes = await ReportesUnMesCloset.find({
			yearReport: anio,
			monthReport: mes,
		});
		res.status(200).json({ ventasCloset, reporteUnMes });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const sumaVentas6Mostrar = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const fechaHoy = new Date();
	const mes = fechaHoy.getMonth();
	const anio = fechaHoy.getFullYear();
	const anioAnterior = fechaHoy.getFullYear() - 1;
	let ventasClosetMostrar = [];
	let reporteSeisMes = [];
	let n = 1;
	try {
		if (mes > 6) {
			while (n <= 6) {
				let ventasCloset = await NuevaVentaCloset.find({
					anio: anio,
					mes: n,
				});
				ventasClosetMostrar.push.apply(
					ventasClosetMostrar,
					ventasCloset
				);
				ventasCloset = [];
				n = n + 1;
			}
			reporteSeisMes = await ReportesSeisMesCloset.find({
				yearReport: anio,
				monthReport: 7,
			});
		} else if (mes <= 6) {
			while (n <= 6) {
				const mesCount = 12 - n;
				let ventasCloset = await NuevaVentaCloset.find({
					anio: anioAnterior,
					mes: mesCount,
				});
				ventasClosetMostrar.push.apply(
					ventasClosetMostrar,
					ventasCloset
				);
				ventasCloset = [];
				n = n + 1;
			}
			reporteSeisMes = await ReportesSeisMesCloset.find({
				yearReport: anio,
				monthReport: 0,
			});
		}
		res.status(200).json({ ventasClosetMostrar, reporteSeisMes });
	} catch (error) {
		res.status(200).json({ message: error.message });
	}
};

export const sumaVentas12Mostrar = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const fechaHoy = new Date();
	try {
		const ventasCloset = await NuevaVentaCloset.find({
			anio: fechaHoy.getFullYear() - 1,
		});
		const reporteAnio = await ReportesAnioCloset.find({
			yearReported: fechaHoy.getFullYear() - 1,
		});
		res.status(200).json({ ventasCloset, reporteAnio });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
