import mongoose from 'mongoose';
import NuevaVentaCloset from '../models/VentaCloset.js';

export const getVentasCloset = async (req, res) =>{
    try{
        const ventasCloset = await NuevaVentaCloset.find();
        res.status(200).json(ventasCloset);
    }catch(error){
        res.status(404).json({message: error.message});
    }
}

/*export const findById = async (req, res) =>{
    const {cedula,nombre,contrasenia} = req.body;
    try{
        const gerente = await ClienteCloset.findOne({cedula});
        return req.params._id;
    }catch(error){
        console.log(error)
        return res.status(404).json({ message: 'El usuario no existe' });
    }
    
};*/

export const createVentaCloset = async (req,res) =>{
    const {numeroContrato,cedulaCliente,contrato,valorVenta,registrada} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const existingUser = await NuevaVentaCloset.findOne({numeroContrato});
		if (existingUser)
			return res.status(400).json({ message: 'El contrato ya fue agregado' });
		console.log(numeroContrato);
        const creo = await NuevaVentaCloset.create({
            numeroContrato,cedulaCliente,contrato,valorVenta,registrada
        });
        res.status(201).json({creo})
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateVentaCloset = async (req,res) =>{
    const {id: _id} = req.params;
    const {numeroContrato,cedulaCliente,contrato,valorVenta,registrada} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('La venta no existe');
    const updatedVenta = await NuevaVentaCloset.findByIdAndUpdate(_id, {cedula,nombre,contrasenia}, {new: true});
    res.json(updatedVenta)
}