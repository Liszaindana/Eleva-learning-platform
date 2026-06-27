import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import bcrypt from 'bcrypt'; // Untuk me-hash password sebelum disimpan

export const getalluser = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { user_id: "asc" }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user", error });
    }
}

export const getuserbyId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID User tidak valid, harus berupa angka!" });
        }

        const user = await prisma.user.findUnique({
            where: { user_id: id },
            include: {
                role: true,        // Ikut sertakan data Role (admin/mentor/user_biasa)
                enrollments: true  // Opsional: Ikut sertakan kelas yang sudah diikuti
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "user tidak ditemukan",
            });
        }

        return res.json({
            message: "Berhasil mengambil data user.",
            data: user
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data user",
            error,
        });
    }
};

// 1. REGISTRASI SISWA (Halaman Awal - Publik)
export const registerStudent = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // TETAP panggil prisma.role (nama modelnya), tapi 'where' menggunakan kolom role_text
        const studentRole = await prisma.role.findFirst({
            where: {
                role_text: 'siswa'
            }
        });

        if (!studentRole) return res.status(500).json({ message: "Role siswa tidak ditemukan di sistem." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan ke database
        const newStudent = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role_id: studentRole.role_id, // Mengambil properti role_id hasil temuan di atas
            }
        });

        return res.status(201).json({ message: "Registrasi siswa berhasil!", data: newStudent });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// 2. PEMBUATAN USER OLEH ADMIN (Untuk Daftarin Mentor / Admin Baru)
export const createUserByAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role_id, join_date } = req.body;

        // 1. Cek apakah role_id yang dikirim dari frontend itu ada di database
        const targetRole = await prisma.role.findUnique({
            where: { role_id: role_id }
        });

        if (!targetRole) {
            return res.status(400).json({ message: "Role yang dipilih tidak valid / tidak ditemukan." });
        }

        // 2. VALIDASI KHUSUS MENTOR: Inputan join_date wajib diisi
        if (targetRole.role_text === 'mentor' && !join_date) {
            return res.status(400).json({
                message: "Gagal membuat user. Inputan tanggal bergabung (join_date) wajib diisi jika mendaftarkan Mentor!"
            });
        }

        // 3. Cek apakah email sudah terdaftar sebelumnya agar tidak duplikat
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan oleh user lain." });
        }

        // 4. Hash password sebelum disimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Simpan ke database menggunakan Prisma
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, // Pastikan kolom password sudah ada di model User
                role_id: role_id,
                // Kondisional logika: jika ada join_date (mentor), ubah teks ke format Date objek. 
                // Jika tidak ada (admin), jangan diisi supaya Prisma otomatis pakai default(now()) / curdate.
                ...(join_date && { join_date: new Date(join_date) })
            },
            include: {
                role: true // Sekalian mengembalikan informasi objek role-nya saat sukses
            }
        });

        return res.status(201).json({
            message: `Berhasil membuat akun baru dengan role: ${targetRole.role_text}`,
            data: newUser
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID User tidak valid, harus berupa angka!" });
        }

        const { name, email, role_id } = req.body;

        const actorRole = (req as any).user?.role; // Role orang yang sedang login (diambil dari token)

        // 1. VALIDASI UTAMA: Jika bukan admin, langsung tolak
        if (actorRole !== 'admin') {
            return res.status(403).json({
                message: "Forbidden: Hanya Admin atau Super Admin yang memiliki hak akses untuk mengubah data user!"
            });
        }

        // 2. Cek apakah user yang mau di-update datanya memang ada di database
        const userExist = await prisma.user.findUnique({
            where: { user_id: id }
        });

        if (!userExist) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        // 3. Eksekusi update data menggunakan Prisma
        const updatedUser = await prisma.user.update({
            where: { user_id: id },
            data: {
                name,
                email,
                role_id // Admin bebas mengubah role_id user ini (misal dari siswa dinaikkan jadi mentor)
            },
            include: {
                role: true // Sekalian ambil info role barunya
            }
        });

        return res.json({
            message: "Data user berhasil diperbarui oleh Admin.",
            data: updatedUser
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        // 1. Ambil ID dari parameter URL dan ubah menjadi Number (karena skema sudah Int)
        const id = Number(req.params.id);

        // Antisipasi jika ID yang dimasukkan ke URL bukan angka valid
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID User tidak valid, harus berupa angka!" });
        }

        // Ambil data role aktor yang sedang login (menggunakan bypass 'as any' sementara)
        const actorRole = (req as any).user?.role;

        // 2. Validasi Hak Akses: Hanya Admin atau Super Admin yang boleh menghapus
        if (actorRole !== 'admin' && actorRole !== 'super_admin') {
            return res.status(403).json({
                message: "Forbidden: Anda tidak memiliki hak akses untuk menghapus user!"
            });
        }

        // 3. Cek apakah user yang mau dihapus memang ada di database
        const userExist = await prisma.user.findUnique({
            where: { user_id: id }
        });

        if (!userExist) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        // 4. Eksekusi Penghapusan Data
        await prisma.user.delete({
            where: { user_id: id }
        });

        // 5. Kembalikan Response Sukses
        return res.json({
            message: `User dengan nama "${userExist.name}" berhasil dihapus.`
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Gagal menghapus data user",
            error: error.message
        });
    }
};