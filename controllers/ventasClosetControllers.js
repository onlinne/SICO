import mongoose from 'mongoose';
import NuevaVentaCloset from '../models/VentaCloset.js';
import Schedule from 'node-schedule';
import ReportesUnMesCloset from '../models/ReportesUnMesCloset.js';
import ReportesSeisMesCloset from '../models/ReportesSeisMesCloset.js';
import ReportesAnioCloset from '../models/ReportesAnioCloset.js';
import pkg from 'express-validator';
const {body, validationResult} = pkg;

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
    const {fechaVenta,numeroContrato,cedulaCliente,contrato,valorVenta} = req.body;
    const fechaHoy = new Date(fechaVenta);
    fechaHoy.setHours(0,0,0,0);
    const anio= fechaHoy.getFullYear();
    const mes= fechaHoy.getMonth()+1;
    const dia= fechaHoy.getDate();
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const existingContract = await NuevaVentaCloset.findOne({numeroContrato});
		if (existingContract)
			return res.status(400).json({ message: 'El contrato ya fue registrado en una venta' });
		console.log(numeroContrato);
        const contractCreate = await NuevaVentaCloset.create({
            numeroContrato,cedulaCliente,contrato,valorVenta,anio,mes,dia
        });
        res.status(201).json({contractCreate})
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




/*
-asd-asd-a-sd-asd-a-s-ad-as-d-ad-aa a-sd-a-da-sd-as-d-asd-a-d-as-a-s-ad-ad-a-as-adsa-sa-sds--asas-d
asdqwewdasdad-----------------asdasa-----------------asdasdasda-sd-asd-asd-as-da-ds-asd-a-d-asd-asd
asdasa--as-das-as-as-as-dasasd-asd-a-sas-as-d-wqe-wq---fds-sdf-d-fds-f--sdf-as-d-asd-as-d-ad-as-d-a
*/
const sumaVentas1Mes = async (req,res)=>{
    const fechaHoy = new Date();
    const mes = fechaHoy.getMonth()-1;
    console.log("mes "+mes);
    const fechaReporte = new Date();
    fechaReporte.setDate(fechaHoy.getDate());
    try{
       const ventasCloset = await NuevaVentaCloset.find({anio: fechaHoy.getFullYear(), mes:mes});
       console.log("ventasCloset "+ventasCloset);
       let sumaVendidos= 0;
       for(const ventaCloset of ventasCloset){
          sumaVendidos = sumaVendidos + Number(ventaCloset.valorVenta);
          console.log("sumaVendidos "+sumaVendidos);
       }
       const crearReporte = await ReportesUnMesCloset.create({
           monthReported: mes, 
           yearReport: fechaReporte.getFullYear(), 
           monthReport: fechaReporte.getMonth(), 
           dayReport: fechaReporte.getDate(), 
           valorVenta: sumaVendidos});
           console.log('Closets: Reporte de un mes creado '+crearReporte);
       return sumaVendidos;
    }catch(error){
       return error;
    }
}
   
const sumaVentas6Mes = async(req,res)=>{
    const fechaHoy = new Date();
    const fechaReporte = new Date();
    fechaReporte.setDate(fechaHoy.getDate());
    let mes = fechaHoy.getMonth();
    let n = 0;
    let ventasCloset1=[];
    try{
        while(n<6){
            if(mes >=6){
                const mesCount = fechaHoy.getMonth()-n;
                let ventasCloset = await NuevaVentaCloset.find({anio:fechaHoy.getFullYear(), mes:mesCount}); 
                ventasCloset1.push.apply(ventasCloset1,ventasCloset);
                ventasCloset=[];
                n = n+1;
            }else if(mes<6){
                const mesCount = 11-n;
                let ventasCloset = await NuevaVentaCloset.find({anio:fechaHoy.getFullYear()-1, mes:mesCount}); 
                ventasCloset1.push.apply(ventasCloset1,ventasCloset);
                ventasCloset=[];
                n = n+1;
            }
        }
        let sumaVendidos= 0;
        for(const ventaCloset1 of ventasCloset1){
            sumaVendidos = Number(sumaVendidos) + Number(ventaCloset1.valorVenta);
        }
        const crearReporte = await ReportesSeisMesCloset.create({ 
            yearReport: fechaReporte.getFullYear(), 
            monthReport: fechaReporte.getMonth(), 
            dayReport: fechaReporte.getDate(), 
            valorVenta: sumaVendidos});
        console.log('Closets: Reporte de seis meses creado '+crearReporte);
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
        let ventasCloset = await NuevaVentaCloset.find({anio:anioAnterior});
        for(const ventaCloset of ventasCloset){
            sumaVendidos = sumaVendidos + Number(ventaCloset.valorVenta);
        }
        const crearReporte = await ReportesAnioCloset.create({
            yearReported: anioAnterior, 
            yearReport: fechaReporte.getFullYear(), 
            monthReport: fechaReporte.getMonth(), 
            dayReport: fechaReporte.getDate(), 
            valorVenta: sumaVendidos});
        console.log('Closets: Reporte del año ' + anioAnterior + ' creado');
        return crearReporte;
    }catch(error){
        return error;
    }
}
   
const objectOfMonths = {
    reportOneMonth : {
        async query (today){
            const verify = await ReportesUnMesCloset.find({
                monthReported: today.getMonth()-1, 
                yearReport: today.getFullYear()});
            return verify;
        },
        sum(){sumaVentas1Mes()}
    },
    reportSixMonths: {
        async query (today){
            const verify = await ReportesSeisMesCloset.find({
                yearReport: today.getFullYear(), 
                monthReport: today.getMonth()});
            return verify;
        },
        sum(){sumaVentas6Mes()}
    },
    reportYear: {
        async query (today){
            const verify = await ReportesAnioCloset.find({yearReported: today.getFullYear()-1});
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
const jobOneMonthReportClosets = Schedule.scheduleJob('0 14,17 1-15 * TUE',function(){
    try{
        verificationReport('reportOneMonth');
    }catch(error){
        return error;
    }
});
   
//6meses = 2pm <0 14 1-15 1,7 TUE>: 
//At 14:00 on every day-of-month from 1 through 15 and on Tuesday in January and July.
const jobSixMonthReportClosets = Schedule.scheduleJob('0 14 1-15 1,7 TUE',function(){
    try{
        verificationReport('reportSixMonths');
    }catch(error){
        return error;
    }
});

//1año = ponerlo x veces los primeros 15 dias de enero <0 14,19 1-15 1 TUE>: 
//At minute 0 past hour 14 and 19 on every day-of-month from 1 through 15 and on Tuesday in January.
const jobYearReportClosets = Schedule.scheduleJob('0 14,19 1-15 1 TUE',function(){
    try{
        verificationReport('reportYear');
    }catch(error){
        return error;
    }
});

/*
-asd-asd-a-sd-asd-a-s-ad-as-d-ad-aa a-sd-a-da-sd-as-d-asd-a-d-as-a-s-ad-ad-a-as-adsa-sa-sds--asas-d
asdqwewdasdad-----------------asdasa-----------------asdasdasda-sd-asd-asd-as-da-ds-asd-a-d-asd-asd
asdasa--as-das-as-as-as-dasasd-asd-a-sas-as-d-wqe-wq---fds-sdf-d-fds-f--sdf-as-d-asd-as-d-ad-as-d-a
*/

export const sumaVentas1Mostrar = async (req,res)=>{
    const fechaHoy = new Date();
    const mes = fechaHoy.getMonth()-1;
    try{
        const ventasCloset = await NuevaVentaCloset.find({anio: fechaHoy.getFullYear(), mes: mes});
        const reporteUnMes = await ReportesUnMesCloset.find({yearReport: fechaHoy.getFullYear(), monthReport: mes});
        res.status(200).json({ventasCloset, reporteUnMes});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}
   
export const sumaVentas6Mostrar = async (req,res)=>{
    const fechaHoy = new Date();
    const mes = fechaHoy.getMonth()-1;
    const anio = fechaHoy.getFullYear()-1;
    try{
        if(mes ===6){
            const ventasCloset = await NuevaVentaCloset.find({mes:6});
            const reporteSeisMes = await ReportesSeisMesCloset.find({yearReport: fechaHoy.getFullYear(), monthReport: 6});
        }else if(mes===0){
            const ventasCloset = await NuevaVentaCloset.find({anio:anio,mes:0});
            const reporteSeisMes = await ReportesSeisMesCloset.find({yearReport: fechaHoy.getFullYear(), monthReport: 0});
        }
        res.status(200).json({ventasCloset, reporteSeisMes});
    }catch(error){
        res.status(200).json({message: error.message});
    }
}
   
export const sumaVentas12Mostrar = async (req,res)=>{
    const fechaHoy = new Date();
    try{
        const ventasCloset = await NuevaVentaCloset.find({anio: fechaHoy.getFullYear()-1});
        const reporteAnio = await ReportesAnioCloset.find({yearReported: fechaHoy.getFullYear()-1});
        res.status(200).json({ventasCloset, reporteAnio});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}
   