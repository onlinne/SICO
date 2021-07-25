import express from 'express';
import {getGerentes,createGerentes, updateGerente, deleteGerente} from '../controllers/gerentesControllers.js'
import pkg from 'express-validator';
const router = express.Router();
const {body} = pkg;

//localhost:5000/gerentes
router.get('/',getGerentes);
router.post('/', body("cedula").isNumeric({no_symbols:true}),body("telefono").isNumeric({no_symbols:true}),body('correo').isEmail(),createGerentes);
router.patch('/:id',updateGerente);
router.delete('/:id',deleteGerente);

export default router;