import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";


// ===============================
// CREATE CLASS
// ===============================
export const createclass = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category_id,
      periode_id,
      level_id,
      user_id,
    } = req.body;

    if (
      !title ||
      !description ||
      !category_id ||
      !periode_id ||
      !level_id ||
      !user_id
    ) {
      return res.status(400).json({
        message:
          "title, description, category_id, periode_id, level_id dan user_id wajib diisi.",
      });
    }

    // cek mentor
    const mentor = await prisma.user.findUnique({
      where: {
        user_id: Number(user_id),
      },
      include: {
        role: true,
      },
    });

    if (!mentor) {
      return res.status(404).json({
        message: "Mentor tidak ditemukan.",
      });
    }

    const newClass = await prisma.class.create({
      data: {
        title,
        description,
        category_id: Number(category_id),
        periode_id: Number(periode_id),
        level_id: Number(level_id),
        user_id: Number(user_id),
        is_active: true,
      },

      include: {
        mentor: true,
        category: true,
        periode: true,
        level: true,
      },
    });

    return res.status(201).json({
      message: "Berhasil membuat kelas.",
      data: newClass,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ===============================
// GET ALL
// ===============================
export const getallclass = async (
  req: Request,
  res: Response
) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        class_id: "asc",
      },

      include: {
        mentor: true,
        category: true,
        periode: true,
        level: true,
        materis: true,
        enrollment: true,
        reviews: true,
        exams: true,
      },
    });

    return res.json(classes);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ===============================
// GET BY ID
// ===============================
export const getclassbyid = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const kelas = await prisma.class.findUnique({
      where: {
        class_id: id,
      },

      include: {
        mentor: true,
        category: true,
        periode: true,
        level: true,
        materis: true,
        enrollment: true,
        reviews: true,
        exams: true,
      },
    });

    if (!kelas) {
      return res.status(404).json({
        message: "Kelas tidak ditemukan.",
      });
    }

    return res.json(kelas);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ===============================
// UPDATE
// ===============================
export const updateclass = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const kelas = await prisma.class.findUnique({
      where: {
        class_id: id,
      },
    });

    if (!kelas) {
      return res.status(404).json({
        message: "Kelas tidak ditemukan.",
      });
    }

    const {
      title,
      description,
      category_id,
      periode_id,
      level_id,
      user_id,
      is_active,
    } = req.body;

    const updated = await prisma.class.update({
      where: {
        class_id: id,
      },

      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(category_id && {
          category_id: Number(category_id),
        }),
        ...(periode_id && {
          periode_id: Number(periode_id),
        }),
        ...(level_id && {
          level_id: Number(level_id),
        }),
        ...(user_id && {
          user_id: Number(user_id),
        }),
        ...(is_active !== undefined && {
          is_active: Boolean(is_active),
        }),
      },

      include: {
        mentor: true,
        category: true,
        periode: true,
        level: true,
      },
    });

    return res.json({
      message: "Kelas berhasil diperbarui.",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// ===============================
// DELETE
// ===============================
export const deleteclass = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const kelas = await prisma.class.findUnique({
      where: {
        class_id: id,
      },
    });

    if (!kelas) {
      return res.status(404).json({
        message: "Kelas tidak ditemukan.",
      });
    }

    await prisma.class.delete({
      where: {
        class_id: id,
      },
    });

    return res.json({
      message: "Kelas berhasil dihapus.",
    });
  } catch (error: any) {
    return res.status(500).json({
      message:
        "Gagal menghapus kelas. Pastikan tidak memiliki relasi data.",
      error: error.message,
    });
  }
};