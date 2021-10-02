import NuevaVentaCloset from '../models/VentaCloset.js';
import ReportesUnMesCloset from '../models/ReportesUnMesCloset.js';
import ReportesSeisMesCloset from '../models/ReportesSeisMesCloset.js';
import ReportesAnioCloset from '../models/ReportesAnioCloset.js';
import Schedule from 'node-schedule';

const ventaVencida = async (req, res) => {
	const dat = new Date();
	const dateToday = new Date(dat.setHours(0, 0, 0, 0));
	const pastMonth = dateToday.getMonth();
	try {
		ventas = await NuevaVentaCloset.updateMany(
			{ mes: pastMonth },
			{ editable: false }
		);
		return ventas;
	} catch (error) {
		return error;
	}
};

//Automatized tasks for reports:

const sumaVentas1Mes = async (req, res) => {
	const fechaHoy = new Date();
	const mes = fechaHoy.getMonth() - 1;
	console.log('mes ' + mes);
	const fechaReporte = new Date();
	fechaReporte.setDate(fechaHoy.getDate());
	try {
		const ventasCloset = await NuevaVentaCloset.find({
			anio: fechaHoy.getFullYear(),
			mes: mes,
		});
		console.log('ventasCloset ' + ventasCloset);
		let sumaVendidos = 0;
		for (const ventaCloset of ventasCloset) {
			sumaVendidos = sumaVendidos + Number(ventaCloset.valorVenta);
			console.log('sumaVendidos ' + sumaVendidos);
		}
		const crearReporte = await ReportesUnMesCloset.create({
			monthReported: mes,
			yearReport: fechaReporte.getFullYear(),
			monthReport: fechaReporte.getMonth(),
			dayReport: fechaReporte.getDate(),
			valorVenta: sumaVendidos,
		});
		console.log('Closets: Reporte de un mes creado ' + crearReporte);
		return sumaVendidos;
	} catch (error) {
		return error;
	}
};

const sumaVentas6Mes = async (req, res) => {
	const fechaHoy = new Date();
	const fechaReporte = new Date();
	fechaReporte.setDate(fechaHoy.getDate());
	let mes = fechaHoy.getMonth();
	let n = 1;
	let ventasCloset1 = [];
	try {
		while (n < 6) {
			if (mes > 6) {
				const mesCount = fechaHoy.getMonth() - n;
				let ventasCloset = await NuevaVentaCloset.find({
					anio: fechaHoy.getFullYear(),
					mes: mesCount,
				});
				ventasCloset1.push.apply(ventasCloset1, ventasCloset);
				ventasCloset = [];
				n = n + 1;
			} else if (mes <= 6) {
				const mesCount = 11 - n;
				let ventasCloset = await NuevaVentaCloset.find({
					anio: fechaHoy.getFullYear() - 1,
					mes: mesCount,
				});
				ventasCloset1.push.apply(ventasCloset1, ventasCloset);
				ventasCloset = [];
				n = n + 1;
			}
		}
		let sumaVendidos = 0;
		for (const ventaCloset1 of ventasCloset1) {
			sumaVendidos =
				Number(sumaVendidos) + Number(ventaCloset1.valorVenta);
		}
		const crearReporte = await ReportesSeisMesCloset.create({
			yearReport: fechaReporte.getFullYear(),
			monthReport: fechaReporte.getMonth(),
			dayReport: fechaReporte.getDate(),
			valorVenta: sumaVendidos,
		});
		console.log('Closets: Reporte de seis meses creado ' + crearReporte);
		return crearReporte;
	} catch (error) {
		return error;
	}
};

const sumaVentas12Mes = async (req, res) => {
	const fechaHoy = new Date();
	const fechaReporte = new Date();
	fechaReporte.setHours(0, 0, 0, 0);
	let sumaVendidos = 0;
	try {
		const anioAnterior = fechaHoy.getFullYear() - 1;
		let ventasCloset = await NuevaVentaCloset.find({ anio: anioAnterior });
		for (const ventaCloset of ventasCloset) {
			sumaVendidos = sumaVendidos + Number(ventaCloset.valorVenta);
		}
		const crearReporte = await ReportesAnioCloset.create({
			yearReported: anioAnterior,
			yearReport: fechaReporte.getFullYear(),
			monthReport: fechaReporte.getMonth(),
			dayReport: fechaReporte.getDate(),
			valorVenta: sumaVendidos,
		});
		console.log('Closets: Reporte del año ' + anioAnterior + ' creado');
		return crearReporte;
	} catch (error) {
		return error;
	}
};

const objectOfMonths = {
	reportOneMonth: {
		async query(today) {
			const verify = await ReportesUnMesCloset.find({
				monthReported: today.getMonth() - 1,
				yearReport: today.getFullYear(),
			});
			return verify;
		},
		sum() {
			sumaVentas1Mes();
		},
	},
	reportSixMonths: {
		async query(today) {
			const verify = await ReportesSeisMesCloset.find({
				yearReport: today.getFullYear(),
				monthReport: today.getMonth(),
			});
			return verify;
		},
		sum() {
			sumaVentas6Mes();
		},
	},
	reportYear: {
		async query(today) {
			const verify = await ReportesAnioCloset.find({
				yearReported: today.getFullYear() - 1,
			});
			return verify;
		},
		sum() {
			sumaVentas12Mes();
		},
	},
};

const verificationReport = async (key, req, res) => {
	try {
		const today = new Date();
		const verify = await objectOfMonths[key].query(today);
		if (!verify.length) {
			objectOfMonths[key].sum();
		} else {
			console.log('El reporte ya existe');
		}
		return verify;
	} catch (error) {
		return error;
	}
};

//cada 3 horas <0 */3 * * *>: At minute 0 past every 3rd hour.
const jobEditableVerification = Schedule.scheduleJob(
	'0 */3 * * *',
	function () {
		try {
			ventaVencida();
		} catch (error) {
			return error;
		}
	}
);

//1mes =  2pm y a las 5  <0 14,17 1-15 * TUE>:
//At every minute past hour 14 and 17 on every day-of-month from 1 through 15 and on Tuesday.
const jobOneMonthReportClosets = Schedule.scheduleJob(
	'0 14,17 1-15 * TUE',
	function () {
		try {
			verificationReport('reportOneMonth');
		} catch (error) {
			return error;
		}
	}
);

//6meses = 2pm <0 14 1-15 1,7 TUE>:
//At 14:00 on every day-of-month from 1 through 15 and on Tuesday in January and July.
const jobSixMonthReportClosets = Schedule.scheduleJob(
	'0 14 1-15 1,7 TUE',
	function () {
		try {
			verificationReport('reportSixMonths');
		} catch (error) {
			return error;
		}
	}
);

//1año = ponerlo x veces los primeros 15 dias de enero <0 14,19 1-15 1 TUE>:
//At minute 0 past hour 14 and 19 on every day-of-month from 1 through 15 and on Tuesday in January.
const jobYearReportClosets = Schedule.scheduleJob(
	'0 14,19 1-15 1 TUE',
	function () {
		try {
			verificationReport('reportYear');
		} catch (error) {
			return error;
		}
	}
);
