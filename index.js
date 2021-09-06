import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import gerentesRoutes from './routes/gerentes.js'
import ventasClosetRoutes from './routes/ventasCloset.js'
import clientesClosetRoutes from './routes/clientesCloset.js'
import clienteSeguroRoutes from './routes/clientesSeguros.js'
import ventasSeguroRoutes from './routes/ventasSeguros.js'

const app = express();

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use('/gerentes', gerentesRoutes);
app.use('/ventascloset', ventasClosetRoutes);
app.use('/clientescloset', clientesClosetRoutes);
app.use('/clientesseguro', clienteSeguroRoutes);
app.use('/ventasseguro', ventasSeguroRoutes);

//const CONNECTION_URL = "mongodb://localhost:27017/sicodb";
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/sicodb', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
})
    .then(()=>app.listen(PORT, ()=>console.log(`Server on port: ${PORT}`)))
    .catch((err)=> console.log(err.message));
mongoose.set('useFindAndModify', false);
