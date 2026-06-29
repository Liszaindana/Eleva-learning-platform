import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// operasi create
export const createlevel = async (req: Request, res: Response) => {
    try {
        const { level_info } = req.body;

        if (!level_info) {
            return res.status(400).json({ message: "Nama level wajib diisi" });
        }

        const newlevel = await prisma.level.create({
            data: { level_info },
        });

        res.status(201).json({
            message: "level berhasil dibuat",
            data: newlevel,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat level baru", error });
    }
};

// operasi read
export const getalllevel = async (req: Request, res: Response) => {
    try {

        const level = await prisma.level.findMany({
            orderBy: { level_id: "asc" },
            include: {
                classes: true, // Agar tahu level ini dipakai di kelas apa saja
            }
        });
        res.json(level);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data level", error });
    }
};

// operasi read by id
export const getlevelbyId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID level tidak valid, harus berupa angka!" });
        }

        const level = await prisma.level.findUnique({
            where: { level_id: id },
            include: {
                classes: true, // Supaya detail kelas-nya ikut keluar
            }
        });

        if (!level) {
            return res.status(404).json({
                message: "level tidak ditemukan",
            });
        }

        res.json(level);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data level",
            error,
        });
    }
};

// operasi update
export const updatelevel = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID level tidak valid, harus berupa angka!" });
        }

        const existinglevel = await prisma.level.findUnique({
            where: { level_id: id },
        });

        if (!existinglevel) {
            return res.status(404).json({
                message: "level tidak ditemukan",
            });
        }

        const { level_info } = req.body;

        if (!level_info) {
            return res.status(400).json({ message: "Nama level baru wajib diisi" });
        }

        const updatedlevel = await prisma.level.update({
            where: { level_id: id },
            data: { level_info },
        });

        res.json({
            message: "level berhasil diupdate",
            data: updatedlevel,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal update level",
            error,
        });
    }
};

// operasi delete
export const deletelevel = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID level tidak valid, harus berupa angka!" });
        }

        // Cek apakah level ada sebelum dihapus
        const existinglevel = await prisma.level.findUnique({
            where: { level_id: id },
        });

        if (!existinglevel) {
            return res.status(404).json({
                message: "level tidak ditemukan",
            });
        }

        // Melakukan penghapusan
        await prisma.level.delete({
            where: { level_id: id },
        });

        res.json({
            message: "level berhasil dihapus secara permanen",
        });
    } catch (error) {
        // TIPS: Jika role ini sudah terlanjur dipakai di tabel user, 
        // mysql akan menolak dihapus (Error Foreign Key Constraint). Kita tangani di sini:
        res.status(500).json({
            message: "Gagal menghapus level. Pastikan level tidak sedang digunakan oleh kelas mana pun.",
            error,
        });
    }
};