type Threshold = { min: number | null; score: number };

const scoringRules: Record<string, Threshold[]> = {
  // 1. Rating (skala 0-5)
  RATING: [
    { min: 4.8, score: 5 }, // 4,8 - 5,0
    { min: 4.5, score: 4 }, // 4,5 - 4,79
    { min: 4.0, score: 3 }, // 4,0 - 4,49
    { min: 3.5, score: 2 }, // 3,5 - 3,99
    { min: null, score: 1 }, // < 3,5
  ],

  // 2. Jumlah Peserta
  JUMLAH_PESERTA: [
    { min: 26, score: 5 }, // > 25
    { min: 20, score: 4 }, // 20 - 25
    { min: 15, score: 3 }, // 15 - 19
    { min: 10, score: 2 }, // 10 - 14
    { min: null, score: 1 }, // < 10
  ],

  // 3. Jumlah Kelas (total kelas yang diajar)
  JUMLAH_KELAS: [
    { min: 8, score: 5 }, // > 7
    { min: 5, score: 4 }, // 5 - 6
    { min: 3, score: 3 }, // 3 - 4
    { min: 2, score: 2 }, // 2
    { min: 1, score: 1 }, // 1
  ],

  // 4. Tingkat Kelulusan (%)
  KELULUSAN: [
    { min: 95, score: 5 }, // 95 - 100
    { min: 90, score: 4 }, // 90 - 94
    { min: 80, score: 3 }, // 80 - 89
    { min: 70, score: 2 }, // 70 - 79
    { min: null, score: 1 }, // < 70
  ],

  // 5. Lama Mengajar (tahun, boleh desimal)
  LAMA_MENGAJAR: [
    { min: 5, score: 5 }, // > 5 tahun
    { min: 4, score: 4 }, // 4 tahun
    { min: 3, score: 3 }, // 3 tahun
    { min: 2, score: 2 }, // 2 tahun
    { min: null, score: 1 }, // 1 tahun (atau kurang)
  ],
};

/**
 * Konversi nilai mentah menjadi skor 1-5 sesuai aturan di atas.
 * Cari threshold dengan `min` tertinggi yang masih <= rawValue.
 */
export function convertToKriteriaScore(kode: string, rawValue: number): number {
  const rules = scoringRules[kode];
  if (!rules) {
    throw new Error(`Belum ada aturan konversi skor untuk kriteria '${kode}'.`);
  }

  const sorted = [...rules].sort(
    (a, b) => (a.min ?? -Infinity) - (b.min ?? -Infinity)
  );

  let matched = sorted[0]?.score ?? 1; // fallback: skor terendah
  for (const rule of sorted) {
    if (rule.min === null || rawValue >= rule.min) {
      matched = rule.score;
    }
  }
  return matched;
}

export const SUPPORTED_SCORING_KODE = Object.keys(scoringRules);