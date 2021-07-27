import mongoose from 'mongoose';
import NuevaVentaSeguro from '../models/VentaSeguro.js';
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
        // var fecha = new Date(fechaVenta);
        //  var anio = fecha.getFullYear();
        //  var mes = fecha.getMonth();
        //  var dia = fecha.getDate(); 
        // const fechaExpiracion= new Date(anio+1,mes,dia);
        const fechaExpiracion = new Date(fechaVenta);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear()+1);
        fechaExpiracion.setHours(0,0,0,0);
        // fechaExpiracion.setMonth(fechaExpiracion.getMonth());
        // fechaExpiracion.setDate(fechaExpiracion.getDate());
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

export const getAllByExpire = async (req,res) =>{
    const fechaHoy = new Date();
    const fechaProxima = new Date();
    fechaProxima.setDate(fechaHoy.getDate()+5);
    fechaProxima.setHours(0,0,0,0);
    console.log(fechaProxima);
    try{
        const seguroExpirado = await NuevaVentaSeguro.find({fechaExpiracion: fechaProxima});
        console.log({fechaExpiracion: fechaProxima});
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

/*export const faltaTiempo = async(req,res)=>{
    const {id: _id} = req.params;
    const {fechaVenta} = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('El seguro no existe');
}*/
