import express from 'express';
import { getSeguroVencido, createSeguroVencido} from '../controllers/segurosVencidosController.js';
const router = express.Router();

router.get('/',getSeguroVencido);
router.post('/',createSeguroVencido);

export default router;