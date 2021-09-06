import express from 'express';
import {getClientesCloset, createClienteCloset,updateClienteCloset} from '../controllers/clientesClosetControllers.js'
import pkg from 'express-validator';
const router = express.Router();
const {body} = pkg;

//localhost:5000/gerentes
router.get('/',getClientesCloset);
router.post('/', body("cedula").isNumeric({no_symbols:true}),body("telefono").isNumeric({no_symbols:true}),body('correo').isEmail(),body("correo").isEmail(),createClienteCloset);
router.patch('/:id',body("telefono").isNumeric({no_symbols:true}), body("correo").isEmail(),updateClienteCloset);

export default router;