import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

export const getalluser = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: "asc" }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user", error });
    }
}

export const createuser = async (req: Request, res: Response) => {
    try {
        // 1. Ambil data yang dikirim oleh client/frontend
        const { nama, email, password } = req.body;
        
        // 2. Validasi sederhana
        if (!nama || !email || !password) {
            return res.status(400).json({ error: 'Nama, email, dan password wajib diisi!' });
        }
    
        // 3. Simpan ke database Laragon menggunakan Prisma
        const newuser = await prisma.user.create({
            data: {
                name: nama,      // Kolom 'name' di skema diisi variabel 'nama'
                email: email,
                password: password
            }
        });

        // 4. Berikan respons sukses jika berhasil
        return res.status(201).json({
            message: 'User berhasil didaftarkan!',
            data: newuser
        });
        
    } catch (error: any) {
        console.error(error);
        
        // Antisipasi jika email sudah terdaftar (Unique constraint error)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email sudah digunakan!' });
        }

        return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
};