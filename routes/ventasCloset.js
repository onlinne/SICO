import express from 'express';
import {getVentasCloset,createVentaCloset,updateVentaCloset} from '../controllers/ventasClosetControllers.js'
const router = express.Router();

//localhost:5000/gerentes
router.get('/',getVentasCloset);
router.post('/',createVentaCloset);
router.patch('/:id',updateVentaCloset);

export default router;