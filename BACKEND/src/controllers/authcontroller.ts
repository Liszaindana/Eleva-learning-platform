import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// =============================
// REGISTER SISWA
// =============================
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi.",
      });
    }

    // Cek email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah digunakan.",
      });
    }

    // Cari role siswa
    const studentRole = await prisma.role.findFirst({
      where: {
        role_text: "siswa",
      },
    });

    if (!studentRole) {
      return res.status(500).json({
        message: "Role siswa belum tersedia.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan User
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: studentRole.role_id,
      },
      include: {
        role: true,
      },
    });

    return res.status(201).json({
      message: "Registrasi berhasil.",
      data: newUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =============================
// LOGIN
// =============================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const comparePassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!comparePassword) {
      return res.status(401).json({
        message: "Email atau password salah.",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role.role_text,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      message: "Login berhasil.",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role.role_text,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =============================
// GET PROFILE
// =============================
export const me = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        user_id: req.user.user_id,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan.",
      });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                message: "Email tidak ditemukan."
            });
        }

        return res.json({
            message: "Email ditemukan. Silakan reset password."
        });

    } catch (error:any) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// =============================
// LOGOUT
// =============================
export const logout = async (_req: Request, res: Response) => {
  return res.json({
    message: "Logout berhasil. Silakan hapus token di frontend.",
  });
};