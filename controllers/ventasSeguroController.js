import mongoose from 'mongoose';
import NuevaVentaSeguro from '../models/VentaSeguro.js';
import SeguroVencido from '../models/SegurosVencidos.js';
import Schedule from 'node-schedule';
import ReportesSeguros from '../models/ReportesSeguros.js';
import ReportesSegurosSeis from '../models/ReportesSeisSeguros.js';
import ReportesSegurosUn from '../models/ReportesAnioSeguros.js';


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


//Automatized expired secures:
const segurosVencidos = async(req,res) =>{
    try{
        const vencidos = await NuevaVentaSeguro.find({expiro: true});
        let crear;
        for(const vencido of vencidos){
            const crear = await SeguroVencido.create({
                fechaVenta:vencido.fechaVenta,
                fechaExpiracion:vencido.fechaExpiracion,
                tipoVehiculo:vencido.tipoVehiculo,
                placaVehiculo:vencido.placaVehiculo,
                cedulaCliente:vencido.cedulaCliente,
                valorVenta:vencido.valorVenta,
                expiro:vencido.expiro})
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

//cada 3 horas <0 */3 * * *>: At minute 0 past every 3rd hour.
const jobExpiredSecures = Schedule.scheduleJob('0 */3 * * *',function(){
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

//Automatized tasks for reports:

const sumaVentas1Mes = async (req,res)=>{
 const fechaHoy = new Date();
 const mes = fechaHoy.getMonth()-1;
 const fechaReporte = new Date();
 fechaReporte.setDate(fechaHoy.getDate());
 try{
     console.log('funcion ventas');
    const ventasSeguros = await NuevaVentaSeguro.find({anio: fechaHoy.getFullYear(), mes:mes});
    let sumaVendidos= 0;
    for(const ventaSeguro of ventasSeguros){
       sumaVendidos = sumaVendidos + Number(ventaSeguro.valorVenta);
    }
    const crearReporte = await ReportesSeguros.create({
        monthReported: mes, 
        yearReport: fechaReporte.getFullYear(), 
        monthReport: fechaReporte.getMonth(), 
        dayReport: fechaReporte.getDate(), 
        valorVenta: sumaVendidos});
    console.log('Reporte del mes ' + mes + ' Creado');
    return sumaVendidos;
 }catch(error){
    return error.message;
 }
}

const sumaVentas6Mes = async(req,res)=>{
    const fechaHoy = new Date();
    const fechaReporte = new Date();
    fechaReporte.setDate(fechaHoy.getDate());
    let mes = fechaHoy.getMonth();
    let n = 1;
    let ventasSeguros1=[];
    //let nuevon=6;
    try{
        while(n<6){
            if(mes >6){
                const mesCount = fechaHoy.getMonth()-n;
                let ventasSeguros = await NuevaVentaSeguro.find({anio:fechaHoy.getFullYear(), mes:mesCount}); 
                ventasSeguros1.push.apply(ventasSeguros1,ventasSeguros);
                ventasSeguros=[];
                n = n+1;
            }else if(mes<=6){
                const mesCount = 12-n;
                let ventasSeguros = await NuevaVentaSeguro.find({anio:fechaHoy.getFullYear()-1, mes:mesCount}); 
                ventasSeguros1.push.apply(ventasSeguros1,ventasSeguros);
                ventasSeguros=[];
                n = n+1;
            }
        }
        let sumaVendidos= 0;
        for(const ventaSeguro1 of ventasSeguros1){
            sumaVendidos = Number(sumaVendidos) + Number(ventaSeguro1.valorVenta);
        }
        const crearReporte = await ReportesSegurosSeis.create({ 
            yearReport: fechaReporte.getFullYear(), 
            monthReport: fechaReporte.getMonth(), 
            dayReport: fechaReporte.getDate(), 
            valorVenta: sumaVendidos});
        console.log('Reporte de seis meses creado'+crearReporte);
        return crearReporte;
    }catch(error){
        return error;
    }
}

const sumaVentas12Mes = async(req,res)=>{
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
        const crearReporte = await ReportesSegurosUn.create({
            yearReported: anioAnterior, 
            yearReport: fechaReporte.getFullYear(), 
            monthReport: fechaReporte.getMonth(), 
            dayReport: fechaReporte.getDate(), 
            valorVenta: sumaVendidos});
        console.log('Reporte del año ' + anioAnterior + ' creado');
        return crearReporte;
    }catch(error){
        return error;
    }
}

const objectOfMonths = {
    reportOneMonth : {
       async query (today){
            const verify = await ReportesSeguros.find({
                monthReported: today.getMonth()-1, 
                yearReport: today.getFullYear()});
            return verify;
        },
        sum(){sumaVentas1Mes()}
    },
    reportSixMonths: {
        async query (today){
            const verify = await ReportesSegurosSeis.find({
                yearReport: today.getFullYear(), 
                monthReport: today.getMonth()});
            return verify;
        },
        sum(){sumaVentas6Mes()}
    },
    reportYear: {
        async query (today){
            const verify = await ReportesSegurosUn.find({yearReported: today.getFullYear()-1});
            return verify;
        },
        sum(){sumaVentas12Mes()}
    }
}

const verificationReport = async(key, req, res)=>{
    try{
        const today = new Date();
        const verify = await objectOfMonths[key].query(today);
        if(!verify.length){
            objectOfMonths[key].sum();
        }else{
            console.log('El reporte ya existe');
        }
        return verify;
    }catch(error){
        return error;
    }
}

//1mes =  2pm y a las 5  <0 14,17 1-15 * TUE>: 
//At every minute past hour 14 and 17 on every day-of-month from 1 through 15 and on Tuesday.
const jobOneMonthReportSecures = Schedule.scheduleJob('0 14,17 1-15 * TUE',function(){
    try{
        verificationReport('reportOneMonth');
    }catch(error){
        return error;
    }
});

//6meses = 2pm <0 14 1-15 1,7 TUE>: 
//At 14:00 on every day-of-month from 1 through 15 and on Tuesday in January and July.
const jobSixMonthReportSecures = Schedule.scheduleJob('0 14 1-15 1,7 TUE',function(){
    try{
        verificationReport('reportSixMonths');
    }catch(error){
        return error;
    }
});

//1año = ponerlo x veces los primeros 15 dias de enero <0 14,19 1-15 1 TUE>: 
//At minute 0 past hour 14 and 19 on every day-of-month from 1 through 15 and on Tuesday in January.
const jobYearReportSecures = Schedule.scheduleJob('0 14,19 1-15 1 TUE',function(){
    try{
        verificationReport('reportYear');
    }catch(error){
        return error;
    }
});

export const sumaVentas1Mostrar = async (req,res)=>{
    const fechaHoy = new Date();
    const anio = fechaHoy.getFullYear();
    const mes = fechaHoy.getMonth();
    const mesAnterior = fechaHoy.getMonth()-1;
    try{
        const ventasSeguros = await NuevaVentaSeguro.find({anio: anio, mes: mesAnterior});
        const mesReporte = await ReportesSeguros.find({yearReport: anio, monthReport: mes});
        res.status(200).json({ventasSeguros, mesReporte});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

export const sumaVentas6Mostrar = async (req,res)=>{
    const fechaHoy = new Date();
    const mes = fechaHoy.getMonth()-1;
    const anio = fechaHoy.getFullYear()-1;
    let ventasSegurosMostrar = [];
    let mesReporte = [];
    let n=1;
    try{
         if(mes ===6){
            while(n<=6){
                let ventasSeguros = await NuevaVentaSeguro.find({anio:fechaHoy.getFullYear(), mes:n}); 
                ventasSegurosMostrar.push.apply(ventasSegurosMostrar,ventasSeguros);
                ventasSeguros=[];
                n = n+1;
            }
            mesReporte = await ReportesSegurosSeis.find({yearReport: fechaHoy.getFullYear(), monthReport: 6});
        }else if(mes===0){
            while(n<=6){
                let mesCount = 12-n;
                let ventasSeguros = await NuevaVentaSeguro.find({anio:fechaHoy.getFullYear(), mes:mesCount}); 
                ventasSegurosMostrar.push.apply(ventasSegurosMostrar,ventasSeguros);
                ventasSeguros=[];
                n = n+1;
            }
            mesReporte = await ReportesSegurosSeis.find({yearReport: anio, monthReport: 0});
        }
        res.status(200).json({ventasSegurosMostrar, mesReporte});
    }catch(error){
        res.status(200).json({message: error.message});
    }
}

export const sumaVentas12Mostrar = async (req,res)=>{
    const fechaHoy = new Date();
    try{
        const ventasSeguros = await NuevaVentaSeguro.find({anio: fechaHoy.getFullYear()-1});
        const anioReporte = await ReportesSegurosUn.find({yearReported: fechaHoy.getFullYear()-1});
        res.status(200).json({ventasSeguros, anioReporte});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}
