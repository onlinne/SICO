import express from 'express';
import {
	getVentasSeguro,
	getAllByExpire,
	createVentasSeguro,
	updateVentasSeguro,
	sumaVentas1Mostrar,
	sumaVentas6Mostrar,
	sumaVentas12Mostrar,
} from '../controllers/ventasSeguroController.js';
import auth from '../middleware/auth.js';
import { getSeguroVencido } from '../controllers/segurosVencidosController.js';
import pkg from 'express-validator';

const router = express.Router();
const { body } = pkg;

router.get('/', auth, getVentasSeguro);
router.get('/vencido', auth, getSeguroVencido);
router.get('/fecha/:fecha/:dias', auth, getAllByExpire);
router.post('/:flag', auth, createVentasSeguro);
router.patch(
	'/:id',
	body('ceducedulaClientelaCliente').isNumeric({ no_symbols: true }),
	auth,
	updateVentasSeguro
);
router.get('/reporteunmes', auth, sumaVentas1Mostrar);
router.get('/reporteseismeses', auth, sumaVentas6Mostrar);
router.get('/reportesanio', auth, sumaVentas12Mostrar);

export default router;
