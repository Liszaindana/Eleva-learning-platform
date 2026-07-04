import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/index.js';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname || 'localhost',
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username || 'root',
  password: decodeURIComponent(dbUrl.password || ''),
  database: dbUrl.pathname.substring(1),
});

export const prisma = new PrismaClient({ adapter });