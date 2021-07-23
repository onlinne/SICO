import express from 'express';
import { getVentasSeguro, createVentasSeguro, updateVentasSeguro } from '../controllers/ventasSeguroController.js';
const router = express.Router();
// const {body} = pkg;

router.get('/', getVentasSeguro);
router.post('/', createVentasSeguro);
router.patch('/:id', updateVentasSeguro);

export default router;