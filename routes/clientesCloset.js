import express from 'express';
import {getClientesCloset,createClienteCloset,updateClienteCloset} from '../controllers/clientesClosetControllers.js'
const router = express.Router();

//localhost:5000/gerentes
router.get('/',getClientesCloset);
router.post('/',createClienteCloset);
router.patch('/:id',updateClienteCloset);

export default router;