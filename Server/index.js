import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { postgresConnect, connectDb } from './Config/db.js';
import Router from './Route/route_task.js';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString}] ${req.method} Requested to ${req.url}`);
    next();
})

app.use("/api/task", Router);


const Createserver = async() => {
    try {
        
        await connectDb();

        await postgresConnect.sync({ alter: true });

        app.listen(port, () => {
            console.log("Server Connected 🚀");
            
        })

    } catch (error) {
        console.log("Server Error", error); 
    }
}

Createserver();