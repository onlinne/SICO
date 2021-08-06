import mongoose from 'mongoose';
import NuevaVentaSeguro from '../models/VentaSeguro.js';
import SeguroVencido from '../models/SegurosVencidos.js';
import schedule from 'node-schedule';
import ReportesSeguros from '../models/ReportesSeguros.js';
import ReportesSegurosSeis from '../models/ReportesSeisSeguros.js';
import ReportesSegurosUn from '../models/ReportesUnSeguros.js';


import pkg from 'express-validator';
const {body, validationResult} = pkg;

export const getVentasSeguro = async(req, res) =>{
    try{
        const ventasSeguro = await NuevaVentaSeguro.find();
        res.status(200).json(ventasSeguro);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const createVentasSeguro = async (req,res) =>{
    const {fechaVenta,tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta} = req.body;
    const nuevaFechaVenta = new Date(fechaVenta);
    const fechaHoy = new Date();
    const fechaHoyCero = new Date (fechaHoy.setHours(0,0,0,0));
    const anio= nuevaFechaVenta.getFullYear();
    const mes= nuevaFechaVenta.getMonth()+1;
    const dia= nuevaFechaVenta.getDate();
    nuevaFechaVenta.setHours(0,0,0,0);
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // if (nuevaFechaVenta.getMonth() > fechaHoyCero.getMonth() && nuevaFechaVenta.getFullYear() <= fechaHoyCero.getFullYear()){
    //     console.log('el mes no cuadra');
    //     return res.status(400).json({message: 'el mes no es adecuado'});  
    // }
    try{
        let fechaExpiracion = new Date(fechaVenta);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear()+1);
        fechaExpiracion.setHours(0,0,0,0);
        fechaExpiracion = fechaExpiracion.valueOf();
        const alreadyInUse = await NuevaVentaSeguro.findOne({placaVehiculo})
        if(alreadyInUse) return res.status(400).json({message:'El vehiculo ya cuenta con un seguro'});
        const creo = await NuevaVentaSeguro.create({
            anio,mes,dia,fechaExpiracion,tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta
        });
        res.status(201).json({creo})
    }catch(error){
        res.status(409).json({message: error.message});
    }
}


export const getAllByExpire = async (req,res) =>{
    let dias = parseInt(req.params.dias);
    let fecha = req.params.fecha;
    let fechaRecibida = new Date(fecha);
    let fechaProxima = new Date();
    fechaProxima.setDate(fechaRecibida.getDate()+ (dias+1));
    fechaProxima.setHours(0,0,0,0);
    fechaProxima = fechaProxima.valueOf();
    try{
        const seguroExpirado = await NuevaVentaSeguro.find({fechaExpiracion: fechaProxima});
        res.status(200).json(seguroExpirado);
        
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

export const updateVentasSeguro = async(req, res) =>{
    const {id: _id} = req.params;
    const {tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('El seguro no existe');
    const updateVenta = await NuevaVentaSeguro.findByIdAndUpdate(_id, {tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta}, {new:true});
    res.status(200).json(updateVenta)
}


//Automatizados
const segurosVencidos = async(req,res) =>{
    try{
        const vencidos = await NuevaVentaSeguro.find({expiro: true});
        let crear;
        for(const vencido of vencidos){
            const crear = await SeguroVencido.create({fechaVenta:vencido.fechaVenta,fechaExpiracion:vencido.fechaExpiracion,tipoVehiculo:vencido.tipoVehiculo,placaVehiculo:vencido.placaVehiculo,cedulaCliente:vencido.cedulaCliente,valorVenta:vencido.valorVenta,expiro:vencido.expiro})
        }
        const eliminar = await NuevaVentaSeguro.deleteMany({expiro:true});
        return vencidos;
    }catch(error){
        return error;
    }
}

const verVencidos = async(req,res) =>{
    try{
        const vencidos = await NuevaVentaSeguro.find({expiro: true});
        return vencidos;
    }catch(error){
        return error;
    }
}

const cambiarVencidos = async (req,res) =>{
    let fechaHoy = new Date();
    fechaHoy.setHours(0,0,0,0);
    fechaHoy = fechaHoy.valueOf();
    try{
        const vencidos = await NuevaVentaSeguro.updateMany({fechaExpiracion: fechaHoy},{expiro:true});
    }catch(error){
        return error;
    }

}

//cada 3 horas 0 */3 * * *
const job1 = schedule.scheduleJob('* * * * *',function(){
    try{
        cambiarVencidos();
        verVencidos().then(vencidos => {
            if(vencidos) {
                segurosVencidos();
            }
        });
    }catch(error){
        return error;
    }
});

const sumaVentas1Mes = async (req,res)=>{
 const fechaHoy = new Date();
 const mes = fechaHoy.getMonth();
 const fechaReporte = new Date();
 fechaReporte.setDate(fechaHoy.getDate()-1);
 try{
    const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
    let sumaVendidos= 0;
    for(const ventaSeguro of ventasSeguros){
       sumaVendidos = sumaVendidos + Number(ventaSeguro.valorVenta);
    }
    const crearReporte = await ReportesSeguros.create({anio: fechaReporte.getFullYear(), mes: fechaReporte.getMonth(), dia: fechaReporte.getDate(), valorVenta: sumaVendidos});
    return sumaVendidos;
 }catch(error){
    return error;
 }
}

//Scheduler del reporte mensual: 1 dia del mes: 0 0 1 * *; 
const job2 = schedule.scheduleJob('* * * * *',function(){
    try{
        sumaVentas1Mes();
    }catch(error){
        return error;
    }
});

export const sumaVentas1Mostrar = async (req,res)=>{
 const fechaHoy = new Date();
 const mes = fechaHoy.getMonth();
 try{
     const ventasSeguros = await NuevaVentaSeguro.find({mes: mes});
     const mesReporte = await ReportesSeguros.find({anio: fechaHoy.getFullYear(), mes: mes});
     res.status(200).json({ventasSeguros, mesReporte});
 }catch(error){
     res.status(400).json({message:error.message});
 }
}


const sumaVentas6Mes = async(req,res)=>{
    const fechaHoy = new Date();
    const fechaReporte = new Date();
    fechaReporte.setDate(fechaHoy.getDate()-1);
    let n = 0;
    let ventasSeguros1=[];
    try{
        while(n<=6){
            const mesn = fechaHoy.getMonth()-n;
            let ventasSeguros = await NuevaVentaSeguro.find({mes:mesn});
            ventasSeguros1.push.apply(ventasSeguros1,ventasSeguros);
            ventasSeguros=[];
            n = n+1;
        }
        let sumaVendidos= 0;
        for(const ventaSeguro1 of ventasSeguros1){
            sumaVendidos = Number(sumaVendidos) + Number(ventaSeguro1.valorVenta);
        }
        const crearReporte = await ReportesSegurosSeis.create({anio: fechaReporte.getFullYear(), mes: fechaReporte.getMonth(), dia: fechaReporte.getDate(), valorVenta: sumaVendidos});
        return crearReporte;
    }catch(error){
        return error;
    }
}
//const sumaVentas6Mostrar = async (req,res)=>{
//  const fechaHoy = new Date();
//  const mes = fechahoy.getMonth()-1;
//  try{
//      while(n<=6){
//             const mesn = fechahoy.getMonth()-n;
//             const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
//             ventasSeguros1.push(ventasSeguros);
//             n = n+1;
//      }
//      return ventasSeguros1;
//  }catch(error){
//      return error;
//  }
//}

export const sumaVentas12Mes = async(req,res)=>{
    const fechaHoy = new Date();
    const fechaReporte = new Date();
    fechaReporte.setHours(0,0,0,0);
    let sumaVendidos = 0;
    try{
        const anioAnterior = fechaHoy.getFullYear()-1;
        let ventasSeguros = await NuevaVentaSeguro.find({anio:anioAnterior});
        for(const ventaSeguro of ventasSeguros){
            sumaVendidos = sumaVendidos + Number(ventaSeguro.valorVenta);
        }
        const crearReporte = await ReportesSegurosUn.create({anio: anioAnterior, mes: fechaReporte.getMonth(), dia: fechaReporte.getDate(), valorVenta: sumaVendidos});
        res.status(200).json(crearReporte);
    }catch(error){
        res.status(400).json({message:error.message});
    }
}
//const sumaVentas12Mostrar = async (req,res)=>{
//  const fechaHoy = new Date();
//  const mes = fechahoy.getMonth()-1;
//  try{
//      let ventasSeguros1 = [];
//      while(n<=6){
//             const mesn = fechahoy.getMonth()-n;
//             const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
//             ventasSeguros1.push(ventasSeguros);
//             n = n+1;
//      }
//      return ventasSeguros1;
//  }catch(error){
//      return error;
//  }
//}

