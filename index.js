import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import gerentesRoutes from './routes/gerentes.js'

const app = express();

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use('/gerentes', gerentesRoutes);

//const CONNECTION_URL = "mongodb://localhost:27017/sicodb";
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/sicodb', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
    .then(()=>app.listen(PORT, ()=>console.log(`Server on port: ${PORT}`)))
    .catch((err)=> console.log(err.message));
mongoose.set('useFindAndModify', false);
