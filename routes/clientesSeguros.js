import express from 'express';
import {
	getClientesSeguro,
	createClienteSeguro,
	updateClienteSeguro,
} from '../controllers/clientesSeguroControllers.js';
import auth from '../middleware/auth.js';
import pkg from 'express-validator';
const router = express.Router();
const { body } = pkg;

router.get('/', auth, getClientesSeguro);
router.post(
	'/',
	body('cedula').isNumeric({ no_symbols: true }),
	body('telefono').isNumeric({ no_symbols: true }),
	body('correo').isEmail(),
	auth,
	createClienteSeguro
);
router.patch(
	'/:id',
	body('telefono').isNumeric({ no_symbols: true }),
	body('correo').isEmail(),
	auth,
	updateClienteSeguro
);

export default router;
