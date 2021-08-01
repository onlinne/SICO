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

const cambiarVencidos = async (req,res) =>{
    let fechaHoy = new Date();
    fechaHoy.setHours(0,0,0,0);
    fechaHoy = fechaHoy.valueOf();
    console.log(fechaHoy);
    try{
        const vencidos = await NuevaVentaSeguro.updateMany({fechaExpiracion: fechaHoy},{expiro:true});
    }catch(error){
        return error;
    }

}

//cada 3 horas 0 */3 * * *
const job = schedule.scheduleJob('* * * * *',function(){
    try{
        const actualizacion = cambiarVencidos();
        let vencidos = NuevaVentaSeguro.find({expiro: true});
        console.log('los vencidos fueron actualizados');
    if (vencidos != ''){
        const cambio = segurosVencidos();
        console.log('los seguros vencidos han sido retirados');
        console.log(vencidos);
        console.log('----------------------------------------------------------');
    }
    }catch(error){
        return error;
    }
 
});