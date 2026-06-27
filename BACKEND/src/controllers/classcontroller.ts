import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// operasi create
export const createclass = async (req: Request, res: Response) => {
    try {
        const { title, description, category_id, periode_id, level_id } = req.body;

        // 1. Validasi: Pastikan semua data wajib diisi
        if (!title || !description || !category_id || !periode_id || !level_id) {
            return res.status(400).json({
                message: "Semua data (title, description, category_id, periode_id, level_id) wajib diisi!"
            })
        }

        const newclass = await prisma.class.create({
            data: {
                title,
                description,
                category_id: Number(category_id),
                periode_id: Number(periode_id),
                level_id: Number(level_id),
                is_active: true
            },
            // Include di bawah ini opsional, agar response langsung menampilkan detail relasinya
            include: {
                category: true,
                periode: true,
                level: true
            }
        });

        return res.status(201).json({ message: "pembuatan kelas berhasil", data: newclass });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// operasi read
export const getallclass = async (req: Request, res: Response) => {
    try {
        const kelas = await prisma.class.findMany({
            orderBy: { class_id: "asc" },
            include: {
                category: true,
                enrollment: true,
                exams: true,
                level: true,
                materis: true,
                periode: true,
                reviews: true,
            }
        });
        res.json(kelas);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kelas" })
    }
};

export const getclassbyid = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID kelas tidak valid, harus berupa angka!" });
        }

        const kelas = await prisma.class.findUnique({
            where: { class_id: id },
            include: {
                category: true,
                enrollment: true,
                exams: true,
                level: true,
                materis: true,
                periode: true,
                reviews: true,
            }
        });

        if (!kelas) {
            return res.status(404).json({
                message: "kelas tidak ditemukan",
            });
        }

        res.json(kelas);
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data kelas",
            error,
        });
    }
};

// operasi update
export const updateclass = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); // ID Kelas dari URL

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID kelas tidak valid, harus berupa angka!" });
        }

        // 1. Cek apakah kelasnya memang ada di database
        const existingClass = await prisma.class.findUnique({
            where: { class_id: id },
        });

        if (!existingClass) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }

        const { title, description, category_id, periode_id, level_id, is_active } = req.body;

        // 1. Buat dulu objek kosong dengan tipe data bawaan Prisma untuk update Class
        const updateData: any = {};

        // 2. Isi objek secara dinamis hanya jika datanya ada (menghindari passing 'undefined')
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category_id) updateData.category_id = Number(category_id);
        if (periode_id) updateData.periode_id = Number(periode_id);
        if (level_id) updateData.level_id = Number(level_id);

        if (is_active !== undefined) {
            updateData.is_active = Boolean(is_active);
        }

        // 2. Eksekusi Update ke Database
        const updatedClass = await prisma.class.update({
            where: { class_id: id },
            data: updateData,
            include: {
                category: true,
                periode: true,
                level: true
            }
        });

        return res.json({
            message: "Kelas berhasil diperbarui",
            data: updatedClass,
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal memperbarui kelas", error: error.message });
    }
};

// operasi delete
export const deleteclass = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID kelas tidak valid, harus berupa angka!" });
        }

        const existingkelas = await prisma.class.findUnique({
            where: { class_id: id },
        });

        if (!existingkelas) {
            return res.status(404).json({
                message: "kelas tidak ditemukan",
            });
        }

        // Melakukan penghapusan
        await prisma.class.delete({
            where: { class_id: id },
        });

        res.json({
            message: "Kelas berhasil dihapus secara permanen"
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus kelas. pastikan kelas tidak memiliki atribut lain",
            error,
        });
    }
};