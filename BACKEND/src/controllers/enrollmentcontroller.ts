import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. OPERASI CREATE (User mendaftar / dimasukkan ke dalam kelas)
export const createenrollment = async (req: Request, res: Response) => {
    try {
        const { user_id, class_id, role_in_class } = req.body;

        // Validasi input wajib
        if (!user_id || !class_id || !role_in_class) {
            return res.status(400).json({ 
                message: "Data (user_id, class_id, role_in_class) wajib diisi!" 
            });
        }

        // Validasi isi role_in_class agar tidak ngawur
        if (role_in_class !== 'mentor' && role_in_class !== 'siswa') {
            return res.status(400).json({ 
                message: "role_in_class harus berupa 'mentor' atau 'siswa'!" 
            });
        }

        // Cek apakah user ini sudah terdaftar di kelas yang sama (mencegah double enrollment)
        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                user_id: Number(user_id),
                class_id: Number(class_id)
            }
        });

        if (existingEnrollment) {
            return res.status(400).json({ 
                message: "User ini sudah terdaftar di dalam kelas tersebut!" 
            });
        }

        // Simpan data pendaftaran baru
        const newEnrollment = await prisma.enrollment.create({
            data: {
                user_id: Number(user_id),
                class_id: Number(class_id),
                role_in_class,
                progress: 0 // Default awal belajar
            },
            include: {
                user: true,
                class: true
            }
        });

        return res.status(201).json({
            message: "Berhasil mendaftarkan user ke dalam kelas",
            data: newEnrollment
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal membuat pendaftaran", error: error.message });
    }
};

// 2. OPERASI READ ALL (Melihat semua daftar enrollment)
export const getallenrollment = async (req: Request, res: Response) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            orderBy: { enrollment_id: "asc" },
            include: {
                user: true,
                class: true
            }
        });
        return res.json(enrollments);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil data pendaftaran", error: error.message });
    }
};

// 3. OPERASI READ BY ID
export const getenrollmentbyid = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID pendaftaran tidak valid!" });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: { enrollment_id: id },
            include: {
                user: true,
                class: true
            }
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
        }

        return res.json(enrollment);
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal mengambil detail pendaftaran", error: error.message });
    }
};

// 4. OPERASI UPDATE (Biasanya untuk mengupdate Progress belajar atau Role)
export const updateenrollment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID pendaftaran tidak valid!" });
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: { enrollment_id: id }
        });

        if (!existingEnrollment) {
            return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
        }

        const { progress, role_in_class } = req.body;
        const updateData: any = {};

        // Validasi & masukkan data secara dinamis (mengatasi exactOptionalPropertyTypes)
        if (progress !== undefined) updateData.progress = Number(progress);
        if (role_in_class) {
            if (role_in_class !== 'mentor' && role_in_class !== 'siswa') {
                return res.status(400).json({ message: "role_in_class harus 'mentor' atau 'siswa'!" });
            }
            updateData.role_in_class = role_in_class;
        }

        const updatedEnrollment = await prisma.enrollment.update({
            where: { enrollment_id: id },
            data: updateData,
            include: {
                user: true,
                class: true
            }
        });

        return res.json({
            message: "Data pendaftaran berhasil diperbarui",
            data: updatedEnrollment
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal memperbarui pendaftaran", error: error.message });
    }
};

// 5. OPERASI DELETE (Membatalkan pendaftaran / keluar dari kelas)
export const deleteenrollment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID pendaftaran tidak valid!" });
        }

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: { enrollment_id: id }
        });

        if (!existingEnrollment) {
            return res.status(404).json({ message: "Data pendaftaran tidak ditemukan" });
        }

        await prisma.enrollment.delete({
            where: { enrollment_id: id }
        });

        return res.json({ message: "User berhasil dikeluarkan dari kelas (Enrollment dihapus)" });
    } catch (error: any) {
        return res.status(500).json({ message: "Gagal menghapus pendaftaran", error: error.message });
    }
};