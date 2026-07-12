import { prisma } from "./db.js";

export type KriteriaValueRow = {
  id_value: number;
  id_kriteria: number;
  value: string;
  score: number;
};

/**
 * Ambil semua baris kriteria_value untuk sekumpulan id_kriteria sekaligus,
 * dikelompokkan per id_kriteria supaya tidak query berulang-ulang (N+1).
 */
export async function loadKriteriaValueMap(
  kriteriaIds: number[]
): Promise<Map<number, KriteriaValueRow[]>> {
  const rows = await prisma.kriteriaValue.findMany({
    where: { id_kriteria: { in: kriteriaIds } },
  });

  const map = new Map<number, KriteriaValueRow[]>();
  rows.forEach((row) => {
    const list = map.get(row.id_kriteria) ?? [];
    list.push(row);
    map.set(row.id_kriteria, list);
  });
  return map;
}

/**
 * Konversi nilai mentah (mis. rating rata-rata 4.85) menjadi skor 1-5
 * berdasarkan tabel kriteria_value yang berlaku untuk kriteria tsb.
 *
 * Logikanya: pilih baris dengan skor TERTINGGI yang min_value-nya
 * masih <= rawValue. Kalau tidak ada satupun baris yang cocok
 * (rawValue di bawah semua batas), otomatis fallback ke skor terendah.
 */
export function convertToKriteriaScore(
  rows: KriteriaValueRow[],
  rawValue: number
): number {

  for (const row of rows) {

    const value = row.value.trim();

    // >5
    if (value.startsWith(">")) {
      const min = parseFloat(
        value.replace(">", "").replace(" Tahun", "")
      );

      if (rawValue > min) {
        return row.score;
      }
    }

    // <10
    if (value.startsWith("<")) {
      const max = parseFloat(value.replace("<", ""));

      if (rawValue < max) {
        return row.score;
      }
    }

    // 4,8-5,0
    if (value.includes("-")) {

      const parts = value.replace(/,/g, ".").split("-");

      const min = Number(parts[0]);
      const max = Number(parts[1]);

      if (
        !Number.isNaN(min) &&
        !Number.isNaN(max) &&
        rawValue >= min &&
        rawValue <= max
      ) {
        return row.score;
      }
    }

    // 4 Tahun / 3 Tahun / 2 Tahun / 1 Tahun
    const exact = parseFloat(
      value.replace(" Tahun", "").replace(",", ".")
    );

    if (!Number.isNaN(exact)) {
      if (rawValue >= exact && rawValue < exact + 1) {
        return row.score;
      }
    }
  }

  return 1;
}