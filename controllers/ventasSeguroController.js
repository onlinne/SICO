import mongoose from 'mongoose';
import NuevaVentaSeguro from '../models/VentaSeguro.js';
import SeguroVencido from '../models/SegurosVencidos.js';
import schedule from 'node-schedule';


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
    //const nuevafechaventa = new Date(fechaVenta);
    //const año= nuevafechaventa.getFullYear();
    //const mes= nuevafechaventa.getMonth();
    //const dia= nuevafechaventa.getDate();
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
        let fechaExpiracion = new Date(fechaVenta);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear()+1);
        fechaExpiracion.setHours(0,0,0,0);
        fechaExpiracion = fechaExpiracion.valueOf();
        const alreadyInUse = await NuevaVentaSeguro.findOne({placaVehiculo})
        if(alreadyInUse) return res.status(400).json({message:'El vehiculo ya cuenta con un seguro'});
        const creo = await NuevaVentaSeguro.create({
            //año,mes,dia,fechaExpiracion,tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta
            fechaVenta,fechaExpiracion,tipoVehiculo, placaVehiculo, cedulaCliente, valorVenta
        });
        res.status(201).json({creo})
    }catch(error){
        res.status(409).json({message: error.message});
    }
}

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
    res.json(updateVenta)
}


//Automatizados
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

//const sumaVentas1Mes = async (req,res)=>{
//  const fechaHoy = new Date();
//  const mes = fechahoy.getMonth()-1;
//  try{
//      const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
//      let sumaVendidos= 0;
//      for(const ventaSeguro of ventasSeguros){
//      sumaVendidos = sumaVendidos + Number(ventaSeguro.valorVenta);
//      }
//      return sumaVendidos;
//  }catch(error){
//      return error;
//  }
//}
//const sumaVentas1Mes = async (req,res)=>{
//  const fechaHoy = new Date();
//  const mes = fechahoy.getMonth()-1;
//  try{
//      const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
//      return ventasSeguros;
//  }catch(error){
//      return error;
//  }
//}


// const sumaVentas6Mes = async(req,res)=>{
//     const fechaHoy = new Date();
//     let n = 1;
//     let ventasSeguros1 = [];
//     try{
//         while(n<=6){
//             const mesn = fechahoy.getMonth()-n;
//             const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
//             ventasSeguros1.push(ventasSeguros);
//             n = n+1;
//         }
//         let sumaVendidos= 0;
//         for(const ventaSeguro1 of ventasSeguros1){
//         sumaVendidos = sumaVendidos + Number(ventaSeguro.valorVenta);
//         }
//         return sumaVendidos;
//     }catch(error){
//         return error;
//     }
// }
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

// const sumaVentas12Mes = async(req,res)=>{
//     const fechaHoy = new Date();
//     let n = 1;
//     let ventasSeguros1 = [];
//     try{
//         while(n<=12){
//             const mesn = fechahoy.getMonth()-n;
//             const ventasSeguros = await NuevaVentaSeguro.find({mes:mes});
//             ventasSeguros1.push(ventasSeguros);
//             n = n+1;
//         }
//         let sumaVendidos= 0;
//         for(const ventaSeguro1 of ventasSeguros1){
//         sumaVendidos = sumaVendidos + Number(ventaSeguro.valorVenta);
//         }
//         return sumaVendidos;
//     }catch(error){
//         return error;
//     }
// }
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

//cada 3 horas 0 */3 * * *
const job = schedule.scheduleJob('* * * * *',function(){
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