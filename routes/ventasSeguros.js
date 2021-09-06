import express from 'express';
import { getVentasSeguro, getAllByExpire,createVentasSeguro, updateVentasSeguro, sumaVentas1Mostrar, sumaVentas6Mostrar,sumaVentas12Mostrar} from '../controllers/ventasSeguroController.js';
import { getSeguroVencido} from '../controllers/segurosVencidosController.js';
import pkg from 'express-validator';

const router = express.Router();
const {body} = pkg;

router.get('/', getVentasSeguro);
router.get('/vencido',getSeguroVencido);
router.get('/fecha/:fecha/:dias',getAllByExpire);
router.post('/',body("cedulaCliente").isNumeric({no_symbols:true}), createVentasSeguro);
router.patch('/:id',body("ceducedulaClientelaCliente").isNumeric({no_symbols:true}), updateVentasSeguro);
router.get('/reporteunmes', sumaVentas1Mostrar);
router.get('/reporteseismeses', sumaVentas6Mostrar);
router.get('/reportesanio', sumaVentas12Mostrar)

export default router;