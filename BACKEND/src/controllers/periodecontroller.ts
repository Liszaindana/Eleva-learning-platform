import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// operasi create
export const createperiode = async (req: Request, res: Response) => {
    try {
        const { year } = req.body;

        if (!year) {
            return res.status(400).json({ message: "Tahun periode wajib diisi" });
        }

        const newperiode = await prisma.periode.create({
            data: { year },
        });

        res.status(201).json({
            message: "periode berhasil dibuat",
            data: newperiode,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat periode", error });
    }
};

// operasi read
export const getallperiode = async (req: Request, res: Response) => {
    try {

        const periode = await prisma.periode.findMany({
            orderBy: { periode_id: "asc" },
            include: {
                classes: true, // Agar tahu periode ini dipakai di kelas apa saja
            }
        });
        res.json(periode);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data periode", error });
    }
};

// operasi read by id
export const getperiodebyId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID periode tidak valid, harus berupa angka!" });
        }

        const periode = await prisma.periode.findUnique({
            where: { periode_id: id },
            include: {
                classes: true, // Supaya detail kelas-nya ikut keluar
            }
        });

        if (!periode) {
            return res.status(404).json({
                message: "periode tidak ditemukan",
            });
        }

        res.json(periode);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil detail periode",
            error,
        });
    }
};

// operasi update
export const updateperiode = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID periode tidak valid, harus berupa angka!" });
        }

        const existingperiode = await prisma.periode.findUnique({
            where: { periode_id: id },
        });

        if (!existingperiode) {
            return res.status(404).json({
                message: "periode tidak ditemukan",
            });
        }

        const { year } = req.body;

        if (!year) {
            return res.status(400).json({ message: "Tahun periode baru wajib diisi" });
        }

        const updatedperiode = await prisma.periode.update({
            where: { periode_id: id },
            data: { year },
        });

        res.json({
            message: "periode berhasil diupdate",
            data: updatedperiode,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal update periode",
            error,
        });
    }
};

// operasi delete
export const deleteperiode = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID periode tidak valid, harus berupa angka!" });
        }

        // Cek apakah periode ada sebelum dihapus
        const existingperiode = await prisma.periode.findUnique({
            where: { periode_id: id },
        });

        if (!existingperiode) {
            return res.status(404).json({
                message: "periode tidak ditemukan",
            });
        }

        // Melakukan penghapusan
        await prisma.periode.delete({
            where: { periode_id: id },
        });

        res.json({
            message: "periode berhasil dihapus secara permanen",
        });
    } catch (error) {
        // TIPS: Jika periode ini sudah terlanjur dipakai di tabel kelas, 
        // mysql akan menolak dihapus (Error Foreign Key Constraint). Kita tangani di sini:
        res.status(500).json({
            message: "Gagal menghapus periode. Pastikan periode tidak sedang digunakan oleh kelas mana pun.",
            error,
        });
    }
};