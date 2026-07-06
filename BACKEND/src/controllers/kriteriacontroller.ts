import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// =======================
// CREATE KRITERIA
// =======================
export const createKriteria = async (req: Request, res: Response) => {
  try {
    const { kode, nama, tipe, bobot } = req.body;

    if (!kode || !nama || !tipe || bobot == null) {
      return res.status(400).json({
        message: "Semua data wajib diisi!",
      });
    }

    if (!["benefit", "cost"].includes(tipe.toLowerCase())) {
      return res.status(400).json({
        message: "Tipe hanya boleh 'benefit' atau 'cost'.",
      });
    }

    const existingKode = await prisma.kriteria.findUnique({
      where: {
        kode,
      },
    });

    if (existingKode) {
      return res.status(400).json({
        message: "Kode kriteria sudah digunakan.",
      });
    }

    const newKriteria = await prisma.kriteria.create({
      data: {
        kode,
        nama,
        tipe: tipe.toLowerCase(),
        bobot: Number(bobot),
      },
    });

    return res.status(201).json({
      message: "Kriteria berhasil ditambahkan.",
      data: newKriteria,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// GET ALL KRITERIA
// =======================
export const getAllKriteria = async (req: Request, res: Response) => {
  try {
    const data = await prisma.kriteria.findMany({
      orderBy: {
        id_kriteria: "asc",
      },
    });

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// GET KRITERIA BY ID
// =======================
export const getKriteriaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const data = await prisma.kriteria.findUnique({
      where: {
        id_kriteria: id,
      },
      include: {
        values: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan.",
      });
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// UPDATE KRITERIA
// =======================
export const updateKriteria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const existing = await prisma.kriteria.findUnique({
      where: {
        id_kriteria: id,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan.",
      });
    }

    const { kode, nama, tipe, bobot } = req.body;

    const updated = await prisma.kriteria.update({
      where: {
        id_kriteria: id,
      },
      data: {
        ...(kode && { kode }),
        ...(nama && { nama }),
        ...(tipe && { tipe: tipe.toLowerCase() }),
        ...(bobot != null && { bobot: Number(bobot) }),
      },
    });

    return res.json({
      message: "Kriteria berhasil diperbarui.",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// DELETE KRITERIA
// =======================
export const deleteKriteria = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const existing = await prisma.kriteria.findUnique({
      where: {
        id_kriteria: id,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Kriteria tidak ditemukan.",
      });
    }

    await prisma.kriteria.delete({
      where: {
        id_kriteria: id,
      },
    });

    return res.json({
      message: "Kriteria berhasil dihapus.",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};