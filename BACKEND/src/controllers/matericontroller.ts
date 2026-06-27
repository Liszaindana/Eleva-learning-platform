import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. OPERASI CREATE (Menambahkan materi baru ke dalam kelas)
export const createmateri = async (req: Request, res: Response) => {
    try {
        const { class_id, title, content, video_url } = req.body;

        // Validasi: Pastikan semua kolom wajib diisi
        if (!class_id || !title || !content || !video_url) {
            return res.status(400).json({ 
                message: "Semua data (class_id, title, content, video_url) wajib diisi!" 
            });
        }

        // Simpan materi baru ke database
        const newMateri = await prisma.materi.create({
            data: {
                class_id: Number(class_id), // Pastikan diconvert ke Int sesuai skema
                title,
                content,
                video_url
            },
            include: {
                class: true // Menampilkan info kelas tempat materi ini bernaung
            }
        });

        return res.status(201).json({
            message: "Materi baru berhasil ditambahkan",
            data: newMateri
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal membuat materi", error: error.message });
    }
};

// 2. OPERASI READ ALL (Mengambil semua materi yang ada di sistem)
export const getallmateri = async (req: Request, res: Response) => {
    try {
        const materis = await prisma.materi.findMany({
            orderBy: { materi_id: "asc" },
            include: {
                class: true
            }
        });
        return res.json(materis);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil data materi", error: error.message });
    }
};

// 3. OPERASI READ BY ID (Mengambil detail satu materi)
export const getmateribyid = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID materi tidak valid, harus berupa angka!" });
        }

        const materi = await prisma.materi.findUnique({
            where: { materi_id: id },
            include: {
                class: true
            }
        });

        if (!materi) {
            return res.status(404).json({ message: "Materi tidak ditemukan" });
        }

        return res.json(materi);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil detail materi", error: error.message });
    }
};

// 4. OPERASI UPDATE (Memperbarui data materi)
export const updatemateri = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID materi tidak valid, harus berupa angka!" });
        }

        // Cek keberadaan materi sebelum diupdate
        const existingMateri = await prisma.materi.findUnique({
            where: { materi_id: id }
        });

        if (!existingMateri) {
            return res.status(404).json({ message: "Materi tidak ditemukan" });
        }

        const { class_id, title, content, video_url } = req.body;
        const updateData: any = {};

        // Menyusun objek secara dinamis untuk menghindari error 'exactOptionalPropertyTypes'
        if (class_id) updateData.class_id = Number(class_id);
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (video_url) updateData.video_url = video_url;

        const updatedMateri = await prisma.materi.update({
            where: { materi_id: id },
            data: updateData,
            include: {
                class: true
            }
        });

        return res.json({
            message: "Materi berhasil diperbarui",
            data: updatedMateri
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal memperbarui materi", error: error.message });
    }
};

// 5. OPERASI DELETE (Menghapus materi)
export const deletemateri = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID materi tidak valid, harus berupa angka!" });
        }

        const existingMateri = await prisma.materi.findUnique({
            where: { materi_id: id }
        });

        if (!existingMateri) {
            return res.status(404).json({ message: "Materi tidak ditemukan" });
        }

        await prisma.materi.delete({
            where: { materi_id: id }
        });

        return res.json({ message: "Materi berhasil dihapus secara permanen" });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal menghapus materi", error: error.message });
    }
};