import type { Response } from "express";
import { prisma } from "../lib/db.js";
import { getMetricValue, SUPPORTED_KRITERIA_KODE } from "../lib/mentorMetrics.js";

type KriteriaRow = { id_kriteria: number; kode: string; nama: string; tipe: string; bobot: number; kepentingan: number | null };

// =====================================================================
// 1. CREATE RECOMMENDATION REQUEST
// =====================================================================
export const createRecommendationRequest = async (req: any, res: Response) => {
  try {
    const { category_id, method, weights } = req.body;
    let { periode_id } = req.body;
    const userId = req.user?.user_id;

    // ---------- 1. VALIDASI REQUEST ----------
    if (!userId) {
      return res.status(401).json({ message: "Anda harus login untuk membuat rekomendasi." });
    }
    if (!category_id) {
      return res.status(400).json({ message: "category_id wajib diisi." });
    }
    if (!method || !["SAW", "WP", "TOPSIS"].includes(method)) {
      return res.status(400).json({ message: "method wajib diisi dan harus salah satu dari 'SAW', 'WP', 'TOPSIS'." });
    }
    if (weights !== undefined && !Array.isArray(weights)) {
      return res.status(400).json({ message: "weights harus berupa array." });
    }

    const categoryIdNum = Number(category_id);
    if (isNaN(categoryIdNum)) {
      return res.status(400).json({ message: "category_id harus berupa angka." });
    }

    const category = await prisma.category.findUnique({ where: { category_id: categoryIdNum } });
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }

    // periode_id opsional dari user; kalau tidak dikirim, pakai periode terbaru
    let periodeIdNum: number;
    if (periode_id !== undefined && periode_id !== null) {
      periodeIdNum = Number(periode_id);
      if (isNaN(periodeIdNum)) {
        return res.status(400).json({ message: "periode_id harus berupa angka." });
      }
      const periodeExist = await prisma.periode.findUnique({ where: { periode_id: periodeIdNum } });
      if (!periodeExist) {
        return res.status(404).json({ message: "Periode tidak ditemukan." });
      }
    } else {
      const latestPeriode = await prisma.periode.findFirst({ orderBy: { periode_id: "desc" } });
      if (!latestPeriode) {
        return res.status(400).json({ message: "Belum ada data periode di sistem." });
      }
      periodeIdNum = latestPeriode.periode_id;
    }

    // ---------- 2. AMBIL SELURUH MENTOR BERDASARKAN category_id ----------
    const candidateClasses = await prisma.class.findMany({
      where: {
        category_id: categoryIdNum,
        periode_id: periodeIdNum,
      },
      select: { user_id: true },
      distinct: ["user_id"],
    });
    const mentorIds = candidateClasses.map((c) => c.user_id);

    if (mentorIds.length === 0) {
      return res.status(404).json({ message: "Tidak ada mentor pada kategori & periode ini." });
    }

    // ---------- 3. AMBIL SELURUH DATA KRITERIA ----------
    const kriteriaList: KriteriaRow[] = await prisma.kriteria.findMany();
    if (kriteriaList.length === 0) {
      return res.status(400).json({ message: "Belum ada data kriteria di sistem." });
    }

    // Pastikan semua kode kriteria di database didukung oleh mentorMetrics.ts
    const unsupported = kriteriaList.filter((k) => !SUPPORTED_KRITERIA_KODE.includes(k.kode));
    if (unsupported.length > 0) {
      return res.status(400).json({
        message: `Kriteria berikut belum punya cara penghitungan otomatis: ${unsupported.map((k) => k.kode).join(", ")}`,
      });
    }

    // ---------- 4. BOBOT: sumbernya beda tergantung metode ----------
    const weightMap = new Map<number, number>();

    if (method === "SAW") {
      // SAW pakai kriteria.bobot langsung (mis. 0.30, 0.20, dst)
      kriteriaList.forEach((k) => weightMap.set(k.id_kriteria, k.bobot));
    } else {
      // WP & TOPSIS pakai nilai kepentingan (1-5), dinormalisasi dengan dibagi total
      const missingKepentingan = kriteriaList.filter((k) => k.kepentingan == null);
      if (missingKepentingan.length > 0) {
        return res.status(400).json({
          message: `Kriteria berikut belum punya nilai kepentingan (dibutuhkan untuk metode ${method}): ${missingKepentingan.map((k) => k.nama).join(", ")}`,
        });
      }
      const totalKepentingan = kriteriaList.reduce((sum, k) => sum + (k.kepentingan ?? 0), 0);
      kriteriaList.forEach((k) => weightMap.set(k.id_kriteria, (k.kepentingan ?? 0) / totalKepentingan));
    }

    // Override manual dari request (kalau user kirim weights, ini menang di atas keduanya)
    if (Array.isArray(weights) && weights.length > 0) {
      for (const w of weights) {
        const kId = Number(w.kriteria_id);
        const bobot = Number(w.bobot);
        if (isNaN(kId) || isNaN(bobot) || bobot < 0) {
          return res.status(400).json({ message: "Format weights tidak valid. Contoh: [{ kriteria_id, bobot }]." });
        }
        if (!weightMap.has(kId)) {
          return res.status(400).json({ message: `kriteria_id ${kId} pada weights tidak ditemukan.` });
        }
        weightMap.set(kId, bobot);
      }
    }

    // ---------- 5. NORMALISASI ULANG (total bobot dipastikan = 1) ----------
    const totalBobot = Array.from(weightMap.values()).reduce((a, b) => a + b, 0);
    if (totalBobot <= 0) {
      return res.status(400).json({ message: "Total bobot kriteria harus lebih besar dari 0." });
    }
    kriteriaList.forEach((k) => {
      weightMap.set(k.id_kriteria, weightMap.get(k.id_kriteria)! / totalBobot);
    });

    // ---------- 6 & 7. HITUNG SKOR MENTOR (getMetricValue SUDAH RETURN SKOR 1-5) & BANGUN DECISION MATRIX ----------
    const matrix = new Map<number, Map<number, number>>();
    for (const mentorId of mentorIds) {
      const row = new Map<number, number>();
      for (const k of kriteriaList) {
        const score = await getMetricValue(k.kode, mentorId); // sudah 1-5, TIDAK perlu convertToKriteriaScore lagi
        row.set(k.id_kriteria, score);
      }
      matrix.set(mentorId, row);
    }
    // ---------- 8-10. HITUNG SESUAI METHOD ----------
    let scores: { user_id: number; score: number }[];
    if (method === "SAW") {
      scores = calculateSAW(mentorIds, kriteriaList, matrix, weightMap);
    } else if (method === "WP") {
      scores = calculateWP(mentorIds, kriteriaList, matrix, weightMap);
    } else {
      scores = calculateTOPSIS(mentorIds, kriteriaList, matrix, weightMap);
    }

    // ---------- 11. RANKING HASIL ----------
    scores.sort((a, b) => b.score - a.score);

    // ---------- 12. SIMPAN REQUEST KE recommendation_request ----------
    const recommendationRequest = await prisma.recommendationRequest.create({
      data: {
        user_id: userId,
        category_id: categoryIdNum,
        periode_id: periodeIdNum,
        method,
      },
    });

    // ---------- 13. SIMPAN BOBOT KE request_bobot ----------
    await prisma.requestBobot.createMany({
      data: kriteriaList.map((k) => ({
        id_recomen: recommendationRequest.id_recomen,
        id_kriteria: k.id_kriteria,
        bobot_req: weightMap.get(k.id_kriteria)!,
      })),
    });

    // ---------- 14. SIMPAN RANKING KE recommendation_hasil ----------
    await prisma.recommendationResult.createMany({
      data: scores.map((s, idx) => ({
        id_recomen: recommendationRequest.id_recomen,
        user_id: s.user_id,
        score: s.score,
        ranking: idx + 1,
      })),
    });

    // ---------- 15. RETURN JSON HASIL RANKING ----------
    const finalResult = await prisma.recommendationRequest.findUnique({
      where: { id_recomen: recommendationRequest.id_recomen },
      include: {
        category: true,
        periode: true,
        weights: { include: { kriteria: true } },
        results: {
          orderBy: { ranking: "asc" },
          include: { user: { select: { user_id: true, name: true, email: true } } },
        },
      },
    });

    return res.status(201).json({
      message: "Rekomendasi mentor berhasil dihitung.",
      data: finalResult,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Gagal membuat rekomendasi.", error: error.message });
  }
};

// =====================================================================
// ALGORITMA SPK
// =====================================================================

function calculateSAW(
  mentorIds: number[],
  kriteriaList: KriteriaRow[],
  matrix: Map<number, Map<number, number>>,
  weightMap: Map<number, number>
): { user_id: number; score: number }[] {
  const maxPerKriteria = new Map<number, number>();
  const minPerKriteria = new Map<number, number>();

  kriteriaList.forEach((k) => {
    const values = mentorIds.map((id) => matrix.get(id)!.get(k.id_kriteria) || 0);
    maxPerKriteria.set(k.id_kriteria, Math.max(...values, 1));
    const positives = values.filter((v) => v > 0);
    minPerKriteria.set(k.id_kriteria, positives.length ? Math.min(...positives) : 1);
  });

  return mentorIds.map((id) => {
    let total = 0;
    kriteriaList.forEach((k) => {
      const x = matrix.get(id)!.get(k.id_kriteria) || 0;
      const r =
        k.tipe === "benefit"
          ? x / maxPerKriteria.get(k.id_kriteria)!
          : minPerKriteria.get(k.id_kriteria)! / (x || 1);
      total += r * weightMap.get(k.id_kriteria)!;
    });
    return { user_id: id, score: total };
  });
}

function calculateWP(
  mentorIds: number[],
  kriteriaList: KriteriaRow[],
  matrix: Map<number, Map<number, number>>,
  weightMap: Map<number, number>
): { user_id: number; score: number }[] {
  const sValues = mentorIds.map((id) => {
    let s = 1;
    kriteriaList.forEach((k) => {
      const x = matrix.get(id)!.get(k.id_kriteria) || 1;
      const w = weightMap.get(k.id_kriteria)!;
      s *= Math.pow(x || 1, k.tipe === "benefit" ? w : -w);
    });
    return { user_id: id, s };
  });

  const totalS = sValues.reduce((a, b) => a + b.s, 0) || 1;
  return sValues.map((sv) => ({ user_id: sv.user_id, score: sv.s / totalS }));
}

function calculateTOPSIS(
  mentorIds: number[],
  kriteriaList: KriteriaRow[],
  matrix: Map<number, Map<number, number>>,
  weightMap: Map<number, number>
): { user_id: number; score: number }[] {
  // Langkah 1: normalisasi matriks (dibagi akar jumlah kuadrat per kolom kriteria)
  const denomPerKriteria = new Map<number, number>();
  kriteriaList.forEach((k) => {
    const sumSquares = mentorIds.reduce((sum, id) => {
      const x = matrix.get(id)!.get(k.id_kriteria) || 0;
      return sum + x * x;
    }, 0);
    denomPerKriteria.set(k.id_kriteria, Math.sqrt(sumSquares) || 1);
  });

  // Langkah 2: matriks ternormalisasi terbobot (v_ij = w_j * r_ij)
  const weighted = new Map<number, Map<number, number>>();
  mentorIds.forEach((id) => {
    const row = new Map<number, number>();
    kriteriaList.forEach((k) => {
      const x = matrix.get(id)!.get(k.id_kriteria) || 0;
      const r = x / denomPerKriteria.get(k.id_kriteria)!;
      row.set(k.id_kriteria, r * weightMap.get(k.id_kriteria)!);
    });
    weighted.set(id, row);
  });

  // Langkah 3: solusi ideal positif (A+) dan negatif (A-) per kriteria
  const idealPositive = new Map<number, number>();
  const idealNegative = new Map<number, number>();
  kriteriaList.forEach((k) => {
    const values = mentorIds.map((id) => weighted.get(id)!.get(k.id_kriteria)!);
    if (k.tipe === "benefit") {
      idealPositive.set(k.id_kriteria, Math.max(...values));
      idealNegative.set(k.id_kriteria, Math.min(...values));
    } else {
      idealPositive.set(k.id_kriteria, Math.min(...values));
      idealNegative.set(k.id_kriteria, Math.max(...values));
    }
  });

  // Langkah 4: jarak ke solusi ideal positif (D+) & negatif (D-)
  // Langkah 5: nilai preferensi C = D- / (D+ + D-)
  return mentorIds.map((id) => {
    let sumPos = 0;
    let sumNeg = 0;
    kriteriaList.forEach((k) => {
      const v = weighted.get(id)!.get(k.id_kriteria)!;
      sumPos += Math.pow(v - idealPositive.get(k.id_kriteria)!, 2);
      sumNeg += Math.pow(v - idealNegative.get(k.id_kriteria)!, 2);
    });
    const dPos = Math.sqrt(sumPos);
    const dNeg = Math.sqrt(sumNeg);
    const c = dPos + dNeg === 0 ? 0 : dNeg / (dPos + dNeg);
    return { user_id: id, score: c };
  });
}

// =====================================================================
// 2. GET RECOMMENDATION HISTORY
// =====================================================================
export const getRecommendationHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Anda harus login untuk melihat riwayat rekomendasi." });
    }

    const history = await prisma.recommendationRequest.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        category: true,
        periode: true,
        weights: { include: { kriteria: true } },
        results: {
          orderBy: { ranking: "asc" },
          include: { user: { select: { user_id: true, name: true, email: true } } },
        },
      },
    });

    return res.json({
      message: "Berhasil mengambil riwayat rekomendasi.",
      data: history,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Gagal mengambil riwayat rekomendasi.", error: error.message });
  }
};

// =====================================================================
// 3. GET RECOMMENDATION DETAIL
// =====================================================================
export const getRecommendationDetail = async (req: any, res: Response) => {
  try {
    const id_recomen = Number(req.params.id);
    if (isNaN(id_recomen)) {
      return res.status(400).json({ message: "ID rekomendasi tidak valid, harus berupa angka." });
    }

    const detail = await prisma.recommendationRequest.findUnique({
      where: { id_recomen },
      include: {
        category: true,
        periode: true,
        weights: { include: { kriteria: true } },
        results: {
          orderBy: { ranking: "asc" },
          include: { user: { select: { user_id: true, name: true, email: true } } },
        },
      },
    });

    if (!detail) {
      return res.status(404).json({ message: "Data rekomendasi tidak ditemukan." });
    }

    return res.json({
      message: "Berhasil mengambil detail rekomendasi.",
      data: detail,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Gagal mengambil detail rekomendasi.", error: error.message });
  }
};

// =====================================================================
// 4. DELETE RECOMMENDATION
// =====================================================================
export const deleteRecommendation = async (req: any, res: Response) => {
  try {
    const id_recomen = Number(req.params.id);
    if (isNaN(id_recomen)) {
      return res.status(400).json({ message: "ID rekomendasi tidak valid, harus berupa angka." });
    }

    const existing = await prisma.recommendationRequest.findUnique({ where: { id_recomen } });
    if (!existing) {
      return res.status(404).json({ message: "Data rekomendasi tidak ditemukan." });
    }

    // Hapus data anak terlebih dahulu (tidak ada onDelete: Cascade di schema)
    await prisma.recommendationResult.deleteMany({ where: { id_recomen } });
    await prisma.requestBobot.deleteMany({ where: { id_recomen } });
    await prisma.recommendationRequest.delete({ where: { id_recomen } });

    return res.json({ message: "Data rekomendasi berhasil dihapus." });
  } catch (error: any) {
    return res.status(500).json({ message: "Gagal menghapus data rekomendasi.", error: error.message });
  }
};

// =====================================================================
// 5. GET ALL RECOMMENDATIONS (FOR ADMIN)
// =====================================================================
export const getAllAdminRecommendations = async (req: any, res: Response) => {
  try {
    // Mengambil semua data rekomendasi dari database tanpa filter user_id
    const allRecommendations = await prisma.recommendationRequest.findMany({
      orderBy: { created_at: "desc" },
      include: {
        category: true,
        periode: true,
        user: { select: { user_id: true, name: true, email: true } }, // Menyertakan info user yang melakukan request
        weights: { include: { kriteria: true } },
        results: {
          orderBy: { ranking: "asc" },
          include: { user: { select: { user_id: true, name: true, email: true } } },
        },
      },
    });

    return res.json({
      message: "Berhasil mengambil semua data rekomendasi admin.",
      data: allRecommendations,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal mengambil data rekomendasi admin.",
      error: error.message
    });
  }
};