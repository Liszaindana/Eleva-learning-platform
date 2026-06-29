import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. OPERASI CREATE (Membuat lembar ujian baru untuk user di kelas tertentu)
export const createexam = async (req: Request, res: Response) => {
    try {
        const { class_id, user_id, title, min_score, score } = req.body;

        // Validasi data minimal yang wajib dikirim frontend
        if (!class_id || !user_id || !title) {
            return res.status(400).json({ 
                message: "Data (class_id, user_id, title) wajib diisi!" 
            });
        }

        // Kalkulasi awal status kelulusan jika frontend langsung mengirim skor (opsional)
        const currentScore = score !== undefined ? Number(score) : 0;
        const currentMinScore = min_score !== undefined ? Number(min_score) : 60;
        const isPassedStatus = currentScore >= currentMinScore;

        const newExam = await prisma.exam.create({
            data: {
                class_id: Number(class_id),
                user_id: Number(user_id),
                title,
                min_score: currentMinScore,
                score: currentScore,
                is_passed: isPassedStatus
            },
            include: {
                class: true,
                user: true
            }
        });

        return res.status(201).json({
            message: "Data ujian berhasil dibuat",
            data: newExam
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal membuat data ujian", error: error.message });
    }
};

// 2. OPERASI READ ALL (Melihat semua daftar ujian)
export const getallexam = async (req: Request, res: Response) => {
    try {
        const exams = await prisma.exam.findMany({
            orderBy: { exam_id: "asc" },
            include: {
                class: true,
                user: true
            }
        });
        return res.json(exams);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil data ujian", error: error.message });
    }
};

// 3. OPERASI READ BY ID (Melihat detail satu data ujian)
export const getexambyid = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ujian tidak valid, harus berupa angka!" });
        }

        const exam = await prisma.exam.findUnique({
            where: { exam_id: id },
            include: {
                class: true,
                user: true
            }
        });

        if (!exam) {
            return res.status(404).json({ message: "Data ujian tidak ditemukan" });
        }

        return res.json(exam);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil detail ujian", error: error.message });
    }
};

// 4. OPERASI UPDATE (Biasanya digunakan saat guru menilai atau update judul ujian)
export const updateexam = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ujian tidak valid, harus berupa angka!" });
        }

        // Cek apakah data ujiannya eksis
        const existingExam = await prisma.exam.findUnique({
            where: { exam_id: id }
        });

        if (!existingExam) {
            return res.status(404).json({ message: "Data ujian tidak ditemukan" });
        }

        const { title, min_score, score, class_id, user_id } = req.body;
        const updateData: any = {};

        if (title) updateData.title = title;
        if (class_id) updateData.class_id = Number(class_id);
        if (user_id) updateData.user_id = Number(user_id);
        
        if (min_score !== undefined) updateData.min_score = Number(min_score);
        if (score !== undefined) updateData.score = Number(score);

        // Otomatisasi Logika Kelulusan: Jika skor atau nilai minimum diubah, hitung ulang is_passed
        if (score !== undefined || min_score !== undefined) {
            const finalScore = score !== undefined ? Number(score) : existingExam.score;
            const finalMinScore = min_score !== undefined ? Number(min_score) : existingExam.min_score;
            updateData.is_passed = finalScore >= finalMinScore;
        }

        const updatedExam = await prisma.exam.update({
            where: { exam_id: id },
            data: updateData,
            include: {
                class: true,
                user: true
            }
        });

        return res.json({
            message: "Data ujian berhasil diperbarui",
            data: updatedExam
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal memperbarui data ujian", error: error.message });
    }
};

// 5. OPERASI DELETE (Menghapus data record ujian)
export const deleteexam = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID ujian tidak valid, harus berupa angka!" });
        }

        const existingExam = await prisma.exam.findUnique({
            where: { exam_id: id }
        });

        if (!existingExam) {
            return res.status(404).json({ message: "Data ujian tidak ditemukan" });
        }

        await prisma.exam.delete({
            where: { exam_id: id }
        });

        return res.json({ message: "Data ujian berhasil dihapus secara permanen" });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal menghapus data ujian", error: error.message });
    }
};