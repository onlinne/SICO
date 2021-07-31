import express from 'express';
import { getVentasSeguro, getAllByExpire,cambiarVencidos,segurosVencidos,createVentasSeguro, updateVentasSeguro } from '../controllers/ventasSeguroController.js';
import { getSeguroVencido, createSeguroVencido} from '../controllers/segurosVencidosController.js';
import pkg from 'express-validator';
const router = express.Router();
const {body} = pkg;

router.get('/', getVentasSeguro);
router.get('/vencido',getSeguroVencido);
router.get('/fecha/:fecha/:dias',getAllByExpire);
router.get('/cambiarvencidos',cambiarVencidos);
router.get('/segurosVencidos',segurosVencidos);
router.post('/',body("cedulaCliente").isNumeric({no_symbols:true}),body("fechaVenta").isDate(), createVentasSeguro);
router.patch('/:id',body("ceducedulaClientelaCliente").isNumeric({no_symbols:true}), updateVentasSeguro);

export default router;