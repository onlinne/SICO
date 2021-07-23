import express from 'express';
import {getClientesSeguro, createClienteSeguro, updateClienteSeguro} from '../controllers/clientesSeguroControllers.js'
import pkg from 'express-validator';
const router = express.Router();
const {body} = pkg;

router.get('/',getClientesSeguro);
router.post('/', body('correo').isEmail(), createClienteSeguro);
router.patch('/:id', updateClienteSeguro);

export default router;