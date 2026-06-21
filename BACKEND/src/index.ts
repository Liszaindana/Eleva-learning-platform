import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { PrismaMariaDb } from '@prisma/adapter-mariadb'; 

import { PrismaClient } from './generated/prisma/index.js';

import userRoute from "./routes/userRoute.js"

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

app.use(userRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server Prisma 7 + Laragon sukses berjalan di http://localhost:${PORT}`);
});