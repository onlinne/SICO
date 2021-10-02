import mongoose from 'mongoose';
import NuevaVentaSeguro from '../models/VentaSeguro.js';
import NuevoClienteSeguro from '../models/ClienteSeguro.js';
import ReportesSeguros from '../models/ReportesSeguros.js';
import ReportesSegurosSeis from '../models/ReportesSeisSeguros.js';
import ReportesSegurosUn from '../models/ReportesAnioSeguros.js';

import pkg from 'express-validator';
const { body, validationResult } = pkg;

export const getVentasSeguro = async (req, res) => {
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
		const ventasSeguro = await NuevaVentaSeguro.paginate({}, options);
		res.status(200).json(ventasSeguro);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createVentasSeguro = async (req, res) => {
	const {
		fechaVenta,
		tipoVehiculo,
		placaVehiculo,
		cedulaCliente,
		valorVenta,
		cliente,
	} = req.body;
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const nuevaFechaVenta = new Date(fechaVenta);
	const fechaHoy = new Date();
	const fechaHoyCero = new Date(fechaHoy.setHours(0, 0, 0, 0));
	const anio = nuevaFechaVenta.getFullYear();
	const mes = nuevaFechaVenta.getMonth() + 1;
	const dia = nuevaFechaVenta.getDate();
	nuevaFechaVenta.setHours(0, 0, 0, 0);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	if (
		nuevaFechaVenta.getMonth() > fechaHoyCero.getMonth() &&
		nuevaFechaVenta.getFullYear() <= fechaHoyCero.getFullYear()
	) {
		return res.status(400).json({
			message:
				'El mes ingresado no es adecuado, por favor ingrese el mes en el que se esta registrando la venta',
		});
	}
	try {
		const vehicleExist = await NuevaVentaSeguro.findOne({ placaVehiculo });
		if (vehicleExist) {
			return res.status(400).json({
				message:
					'El vehiculo que intenta ingresar ya cuenta con un seguro activo',
			});
		}

		let customerFound = {};
		if (req.params.flag === String(0)) {
			customerFound = await NuevoClienteSeguro.find({ cedula: cliente });
		}
		if (req.params.flag === String(1)) {
			customerFound = await NuevoClienteSeguro.find({ nombre: cliente });
		}
		if (!customerFound) {
			res.status(409).json({
				message:
					'El cliente ingresado no esta registrado, por favor creelo antes de intentar registrar una venta a este cliente',
			});
		}
		if (customerFound) {
			let fechaExpiracion = new Date(fechaVenta);
			fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);
			fechaExpiracion.setHours(0, 0, 0, 0);
			fechaExpiracion = fechaExpiracion.valueOf();
			const saleCreated = await NuevaVentaSeguro.create({
				anio: anio,
				mes: mes,
				dia: dia,
				fechaExpiracion: fechaExpiracion,
				tipoVehiculo: tipoVehiculo,
				placeVehiculo: placaVehiculo,
				valorVenta: valorVenta,
				cedulaCliente: customerFound[0].cedula,
			});
			const clienteEncontrado = await NuevoClienteSeguro.findOne({
				cedula: cliente,
			});
			await clienteEncontrado.compras.push(saleCreated._id);
			await clienteEncontrado.save();
			res.status(201).json({ message: 'Venta de seguro registrada' });
		}
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const getAllByExpire = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	let dias = parseInt(req.params.dias);
	let fecha = req.params.fecha;
	let fechaRecibida = new Date(fecha);
	let fechaProxima = new Date();
	fechaProxima.setDate(fechaRecibida.getDate() + (dias + 1));
	fechaProxima.setHours(0, 0, 0, 0);
	fechaProxima = fechaProxima.valueOf();
	try {
		const seguroExpirado = await NuevaVentaSeguro.find({
			fechaExpiracion: fechaProxima,
		});
		res.status(200).json(seguroExpirado);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const updateVentasSeguro = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const { id: _id } = req.params;
	const { tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('El seguro no existe');
	const updateVenta = await NuevaVentaSeguro.findByIdAndUpdate(
		_id,
		{ tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta },
		{ new: true }
	);
	res.status(200).json(updateVenta);
};

export const sumaVentas1Mostrar = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const fechaHoy = new Date();
	const anio = fechaHoy.getFullYear();
	const mes = fechaHoy.getMonth();
	const mesAnterior = fechaHoy.getMonth() - 1;
	try {
		const ventasSeguros = await NuevaVentaSeguro.find({
			anio: anio,
			mes: mesAnterior,
		});
		const mesReporte = await ReportesSeguros.find({
			yearReport: anio,
			monthReport: mes,
		});
		res.status(200).json({ ventasSeguros, mesReporte });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const sumaVentas6Mostrar = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const fechaHoy = new Date();
	const mes = fechaHoy.getMonth() - 1;
	const anio = fechaHoy.getFullYear() - 1;
	let ventasSegurosMostrar = [];
	let mesReporte = [];
	let n = 1;
	try {
		if (mes === 6) {
			while (n <= 6) {
				let ventasSeguros = await NuevaVentaSeguro.find({
					anio: fechaHoy.getFullYear(),
					mes: n,
				});
				ventasSegurosMostrar.push.apply(
					ventasSegurosMostrar,
					ventasSeguros
				);
				ventasSeguros = [];
				n = n + 1;
			}
			mesReporte = await ReportesSegurosSeis.find({
				yearReport: fechaHoy.getFullYear(),
				monthReport: 6,
			});
		} else if (mes === 0) {
			while (n <= 6) {
				let mesCount = 12 - n;
				let ventasSeguros = await NuevaVentaSeguro.find({
					anio: fechaHoy.getFullYear(),
					mes: mesCount,
				});
				ventasSegurosMostrar.push.apply(
					ventasSegurosMostrar,
					ventasSeguros
				);
				ventasSeguros = [];
				n = n + 1;
			}
			mesReporte = await ReportesSegurosSeis.find({
				yearReport: anio,
				monthReport: 0,
			});
		}
		res.status(200).json({ ventasSegurosMostrar, mesReporte });
	} catch (error) {
		res.status(200).json({ message: error.message });
	}
};

export const sumaVentas12Mostrar = async (req, res) => {
	if (!req.userId) return res.json({ message: 'Unauthenticated' });
	const fechaHoy = new Date();
	try {
		const ventasSeguros = await NuevaVentaSeguro.find({
			anio: fechaHoy.getFullYear() - 1,
		});
		const anioReporte = await ReportesSegurosUn.find({
			yearReported: fechaHoy.getFullYear() - 1,
		});
		res.status(200).json({ ventasSeguros, anioReporte });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
