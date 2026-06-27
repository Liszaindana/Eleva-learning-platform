import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { PrismaMariaDb } from '@prisma/adapter-mariadb'; 

import { PrismaClient } from './generated/prisma/index.js';

import categoryRoute from "./routes/categoryRoute.js";
import userRoute from "./routes/userRoute.js"
import classRoute from './routes/classRoute.js';
import examRoute from './routes/examRoute.js';
import levelRoute from './routes/levelRoute.js';
import materiRoute from './routes/materiRoute.js';
import periodeRoute from './routes/periodeRoute.js';
import reviewRoute from './routes/reviewRoute.js';
import roleRoute from './routes/roleRoute.js';
import enrollmentRoute from './routes/enrollmentRoute.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const prisma = new PrismaClient({ adapter });

// Route testing
app.get('/', async (req, res) => {
    res.send("hello world")
});

app.use(categoryRoute);
app.use(classRoute);
app.use(enrollmentRoute);
app.use(examRoute);
app.use(levelRoute);
app.use(materiRoute);
app.use(periodeRoute);
app.use(reviewRoute);
app.use(roleRoute);
app.use(userRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server Prisma 7 + Laragon sukses berjalan di http://localhost:${PORT}`);
});