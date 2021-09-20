import express from 'express';
import {
	getSeguroVencido,
	createSeguroVencido,
} from '../controllers/segurosVencidosController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', auth, getSeguroVencido);
router.post('/', auth, createSeguroVencido);

export default router;
