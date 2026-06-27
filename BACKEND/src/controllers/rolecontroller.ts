import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// operasi create
export const createrole = async (req: Request, res: Response) => {
    try {
        const { role_text } = req.body;

        if (!role_text) {
            return res.status(400).json({ message: "Nama role wajib diisi" });
        }

        const newrole = await prisma.role.create({
            data: { role_text },
        });

        res.status(201).json({
            message: "Kategori berhasil dibuat",
            data: newrole,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat role baru", error });
    }
};

// operasi read
export const getallrole = async (req: Request, res: Response) => {
    try {

        const role = await prisma.role.findMany({
            orderBy: { role_id: "asc" },
            include: {
                users: true, // Agar tahu role ini dipakai siapa saja
            }
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data role", error });
    }
};

// operasi read by id
export const getrolebyId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID role tidak valid, harus berupa angka!" });
        }

        const role = await prisma.role.findUnique({
            where: { role_id: id },
            include: {
                users: true, // Supaya detail role-nya ikut keluar
            }
        });

        if (!role) {
            return res.status(404).json({
                message: "role tidak ditemukan",
            });
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data role",
            error,
        });
    }
};

// operasi update
export const updaterole = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID role tidak valid, harus berupa angka!" });
        }

        const existingrole = await prisma.role.findUnique({
            where: { role_id: id },
        });

        if (!existingrole) {
            return res.status(404).json({
                message: "Kategori tidak ditemukan",
            });
        }

        const { role_text } = req.body;

        if (!role_text) {
            return res.status(400).json({ message: "Nama role baru wajib diisi" });
        }

        const updatedrole = await prisma.role.update({
            where: { role_id: id },
            data: { role_text },
        });

        res.json({
            message: "Kategori berhasil diupdate",
            data: updatedrole,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal update kategori",
            error,
        });
    }
};

// operasi delete
export const deleterole = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID role tidak valid, harus berupa angka!" });
        }

        // Cek apakah rolenya ada sebelum dihapus
        const existingrole = await prisma.role.findUnique({
            where: { role_id: id },
        });

        if (!existingrole) {
            return res.status(404).json({
                message: "role tidak ditemukan",
            });
        }

        // Melakukan penghapusan
        await prisma.role.delete({
            where: { role_id: id },
        });

        res.json({
            message: "role berhasil dihapus secara permanen",
        });
    } catch (error) {
        // TIPS: Jika role ini sudah terlanjur dipakai di tabel user, 
        // mysql akan menolak dihapus (Error Foreign Key Constraint). Kita tangani di sini:
        res.status(500).json({
            message: "Gagal menghapus role. Pastikan role tidak sedang digunakan oleh kelas mana pun.",
            error,
        });
    }
};