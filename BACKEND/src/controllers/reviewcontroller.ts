import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. OPERASI CREATE (Memberikan rating dan ulasan untuk kelas)
export const createreview = async (req: Request, res: Response) => {
    try {
        const { user_id, class_id, rating, comment } = req.body;

        // Validasi: Pastikan data wajib terisi
        if (!user_id || !class_id || !rating || !comment) {
            return res.status(400).json({ 
                message: "Semua data (user_id, class_id, rating, comment) wajib diisi!" 
            });
        }

        // Validasi batas rating (skala 1 - 5)
        const ratingNumber = Number(rating);
        if (ratingNumber < 1 || ratingNumber > 5) {
            return res.status(400).json({ message: "Rating harus berada di skala 1 sampai 5!" });
        }

        const newReview = await prisma.review.create({
            data: {
                user_id: Number(user_id),
                class_id: Number(class_id),
                rating: ratingNumber,
                comment
            },
            include: {
                user: true,
                class: true
            }
        });

        return res.status(201).json({
            message: "Ulasan berhasil dikirim",
            data: newReview
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal membuat ulasan", error: error.message });
    }
};

// 2. OPERASI READ ALL (Melihat semua review)
export const getallreview = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { review_id: "asc" }, // Diurutkan berdasarkan id review
            include: {
                user: true,
                class: true
            }
        });
        return res.json(reviews);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil data ulasan", error: error.message });
    }
};

// 3. OPERASI READ BY ID (Mengambil ulasan spesifik lewat Int ID)
export const getreviewbyid = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); // 💡 Sekarang diconvert ke Number

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ulasan tidak valid, harus berupa angka!" });
        }

        const review = await prisma.review.findUnique({
            where: { review_id: id },
            include: {
                user: true,
                class: true
            }
        });

        if (!review) {
            return res.status(404).json({ message: "Ulasan tidak ditemukan" });
        }

        return res.json(review);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil detail ulasan", error: error.message });
    }
};

// 4. OPERASI UPDATE (Mengubah isi review atau rating)
export const updatereview = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); // 💡 Sekarang diconvert ke Number

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ulasan tidak valid, harus berupa angka!" });
        }

        const existingReview = await prisma.review.findUnique({
            where: { review_id: id }
        });

        if (!existingReview) {
            return res.status(404).json({ message: "Ulasan tidak ditemukan" });
        }

        const { rating, comment } = req.body;
        const updateData: any = {};

        if (rating !== undefined) {
            const ratingNumber = Number(rating);
            if (ratingNumber < 1 || ratingNumber > 5) {
                return res.status(400).json({ message: "Rating harus berada di skala 1 sampai 5!" });
            }
            updateData.rating = ratingNumber;
        }

        if (comment) updateData.comment = comment;

        const updatedReview = await prisma.review.update({
            where: { review_id: id },
            data: updateData,
            include: {
                user: true,
                class: true
            }
        });

        return res.json({
            message: "Ulasan berhasil diperbarui",
            data: updatedReview
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal memperbarui ulasan", error: error.message });
    }
};

// 5. OPERASI DELETE (Menghapus ulasan)
export const deletereview = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id); // 💡 Sekarang diconvert ke Number

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ulasan tidak valid, harus berupa angka!" });
        }

        const existingReview = await prisma.review.findUnique({
            where: { review_id: id }
        });

        if (!existingReview) {
            return res.status(404).json({ message: "Ulasan tidak ditemukan" });
        }

        await prisma.review.delete({
            where: { review_id: id }
        });

        return res.json({ message: "Ulasan berhasil dihapus secara permanen" });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal menghapus ulasan", error: error.message });
    }
};