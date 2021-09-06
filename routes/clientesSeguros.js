import express from 'express';
import {getClientesSeguro, createClienteSeguro, updateClienteSeguro} from '../controllers/clientesSeguroControllers.js'
import pkg from 'express-validator';
const router = express.Router();
const {body} = pkg;

router.get('/',getClientesSeguro);
router.post('/', body("cedula").isNumeric({no_symbols:true}),body("telefono").isNumeric({no_symbols:true}),body('correo').isEmail(), createClienteSeguro);
router.patch('/:id',body("telefono").isNumeric({no_symbols:true}),body("correo").isEmail(), updateClienteSeguro);

export default router;