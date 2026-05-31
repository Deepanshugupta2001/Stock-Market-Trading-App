import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
// import yahooFinance from 'yahoo-finance2';

import { createServer } from "http" ;
import { Server } from "socket.io";
import cors from 'cors';
import authRoutes from './http/routes/auth.routes.js'
import env from './env.js';
import mongoose from 'mongoose';
import { startsocket } from './socket/index.js';
import stockRoutes from './http/routes/stock.routes.js';
import { buyOrderExecuting, sellOrderExecuting } from './jobs/orderExecution.js';
const PORT = env.PORT || 4444 ;
const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

startsocket(httpServer);

app.use(cors({
    origin : env.CORS_ORIGIN
}));  
// console.log("DATABASE_URL:", process.env.DATABASE_URL)
app.use('/api/auth', authRoutes);
app.use('/api/stock',stockRoutes);

// Testing Purpose :
// const quote = await yahooFinance.quote("AAPL");
// console.log(quote.regularMarketPrice);
mongoose.connect(env.DATABASE_URL)
    .then(()=>{
        httpServer.listen(PORT,()=>{
            console.log(`http://localhost:`+PORT);

            buyOrderExecuting();

            // sellOrderExecuting();
        })
    })
