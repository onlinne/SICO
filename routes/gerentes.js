import express from 'express';
import {getGerentes,createGerentes, updateGerente, deleteGerente} from '../controllers/gerentesControllers.js'
const router = express.Router();

//localhost:5000/gerentes
router.get('/',getGerentes);
router.post('/',createGerentes);
router.patch('/:id',updateGerente);
router.delete('/:id',deleteGerente);

export default router;