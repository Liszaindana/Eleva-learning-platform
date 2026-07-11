import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. OPERASI CREATE (Memberikan rating dan ulasan untuk kelas)
export const createreview = async (req: any, res: Response) => {
    try {
        //  user_id SEKARANG DARI TOKEN LOGIN, BUKAN DARI BODY
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Anda harus login untuk memberi ulasan." });
        }

        const { class_id, rating, comment } = req.body;

        // Validasi: Pastikan data wajib terisi
        if (!class_id || !rating || !comment) {
            return res.status(400).json({ 
                message: "Semua data (class_id, rating, comment) wajib diisi!" 
            });
        }

        // Validasi batas rating (skala 1 - 5)
        const ratingNumber = Number(rating);
        if (ratingNumber < 1 || ratingNumber > 5) {
            return res.status(400).json({ message: "Rating harus berada di skala 1 sampai 5!" });
        }

        const classIdNumber = Number(class_id);

        const kelas = await prisma.class.findUnique({ where: { class_id: classIdNumber } });
        if (!kelas) {
            return res.status(404).json({ message: "Kelas tidak ditemukan." });
        }

        // wajib sudah terdaftar sebagai siswa di kelas ini
        const enrollment = await prisma.enrollment.findFirst({
            where: { user_id: userId, class_id: classIdNumber, role_in_class: "siswa" },
        });
        if (!enrollment) {
            return res.status(403).json({
                message: "Kamu harus mengikuti kelas ini terlebih dahulu sebelum memberi ulasan.",
            });
        }

        // wajib sudah terdaftar sebagai siswa di kelas ini
        const existingUserReview = await prisma.review.findFirst({
            where: { user_id: userId, class_id: classIdNumber },
        });
        if (existingUserReview) {
            return res.status(409).json({ message: "Kamu sudah pernah memberi ulasan untuk kelas ini." });
        }

        const newReview = await prisma.review.create({
            data: {
                user_id: userId,
                class_id: classIdNumber,
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
            orderBy: { review_id: "asc" },
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
        const id = Number(req.params.id);

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
export const updatereview = async (req: any, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ulasan tidak valid, harus berupa angka!" });
        }

        const existingReview = await prisma.review.findUnique({
            where: { review_id: id }
        });

        if (!existingReview) {
            return res.status(404).json({ message: "Ulasan tidak ditemukan" });
        }

        // ⬇️ BARU: cuma pemilik ulasan atau admin yang boleh edit
        const userId = req.user?.user_id;
        const userRole = req.user?.role;
        if (existingReview.user_id !== userId && userRole !== "admin") {
            return res.status(403).json({ message: "Kamu tidak berhak mengubah ulasan ini." });
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
export const deletereview = async (req: any, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ulasan tidak valid, harus berupa angka!" });
        }

        const existingReview = await prisma.review.findUnique({
            where: { review_id: id }
        });

        if (!existingReview) {
            return res.status(404).json({ message: "Ulasan tidak ditemukan" });
        }

        //  BARU: cuma pemilik ulasan atau admin yang boleh hapus
        const userId = req.user?.user_id;
        const userRole = req.user?.role;
        if (existingReview.user_id !== userId && userRole !== "admin") {
            return res.status(403).json({ message: "Kamu tidak berhak menghapus ulasan ini." });
        }

        await prisma.review.delete({
            where: { review_id: id }
        });

        return res.json({ message: "Ulasan berhasil dihapus secara permanen" });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal menghapus ulasan", error: error.message });
    }
};