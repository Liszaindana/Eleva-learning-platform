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

export const createKriteriaValue = async (req: Request, res: Response) => {
  try {
    const { id_kriteria, value, score } = req.body;
    if (!id_kriteria || !value || score === undefined) {
      return res.status(400).json({ message: "id_kriteria, value, dan score wajib diisi." });
    }

    const kriteria = await prisma.kriteria.findUnique({ where: { id_kriteria: Number(id_kriteria) } });
    if (!kriteria) {
      return res.status(404).json({ message: "Kriteria tidak ditemukan." });
    }

    const kv = await prisma.kriteriaValue.create({
      data: {
        id_kriteria: Number(id_kriteria),
        value,
        score: Number(score),
      },
    });

    return res.status(201).json({ message: "Skala nilai berhasil dibuat.", data: kv });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getKriteriaValuesByKriteria = async (req: Request, res: Response) => {
  try {
    const id_kriteria = Number(req.params.id_kriteria);
    if (isNaN(id_kriteria)) return res.status(400).json({ message: "ID tidak valid." });

    const values = await prisma.kriteriaValue.findMany({
      where: { id_kriteria },
      orderBy: { score: "desc" },
    });

    return res.json(values);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateKriteriaValue = async (req: Request, res: Response) => {
  try {
    const id_value = Number(req.params.id_value);
    if (isNaN(id_value)) return res.status(400).json({ message: "ID tidak valid." });

    const existing = await prisma.kriteriaValue.findUnique({ where: { id_value } });
    if (!existing) return res.status(404).json({ message: "Skala nilai tidak ditemukan." });

    const { value, score } = req.body;
    const updated = await prisma.kriteriaValue.update({
      where: { id_value },
      data: {
        ...(value !== undefined && { value }),
        ...(score !== undefined && { score: Number(score) }),
      },
    });

    return res.json({ message: "Skala nilai berhasil diperbarui.", data: updated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteKriteriaValue = async (req: Request, res: Response) => {
  try {
    const id_value = Number(req.params.id_value);
    if (isNaN(id_value)) return res.status(400).json({ message: "ID tidak valid." });

    const existing = await prisma.kriteriaValue.findUnique({ where: { id_value } });
    if (!existing) return res.status(404).json({ message: "Skala nilai tidak ditemukan." });

    await prisma.kriteriaValue.delete({ where: { id_value } });
    return res.json({ message: "Skala nilai berhasil dihapus." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};