import { count } from "console";
import { prisma } from "./db.js";

const metricGetters: Record<string, (mentorId: number) => Promise<number>> = {
  RATING: async (mentorId) => {
    const result = await prisma.review.aggregate({
      where: { class: { user_id: mentorId } },
      _avg: { rating: true },
    });
    return result._avg.rating ?? 0;
  },

  KELULUSAN: async (mentorId) => {
  const result = await prisma.exam.aggregate({
    where: {
      class: {
        user_id: mentorId,
      },
    },
    _avg: {
      score: true,
    },
  });

  return Number((result._avg.score ?? 0).toFixed(2));
},

  JUMLAH_PESERTA: async (mentorId) => {
    const count = await prisma.enrollment.count({
      where: { role_in_class: "student", class: { user_id: mentorId } },
    });
    console.log("Mentor", mentorId, "Jumlah Peserta =", count);
    return count;
  },

  // Jumlah kelas yang SEDANG AKTIF milik mentor ini (bukan total kelas)
  JUMLAH_KELAS: async (mentorId) => {
    return prisma.class.count({
      where: { user_id: mentorId, is_active: true },
    });
  },

  LAMA_MENGAJAR: async (mentorId) => {
    const mentor = await prisma.user.findUnique({
      where: { user_id: mentorId },
      select: { join_date: true },
    });
    if (!mentor) return 0;
      console.log(mentor);

    const now = new Date();
    const diff = now.getTime() - mentor.join_date.getTime();
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    console.log("Lama:", years);
    return Number(years.toFixed(2));
  },
};

export async function getMetricValue(kode: string, mentorId: number): Promise<number> {
  const getter = metricGetters[kode];
  if (!getter) {
    throw new Error(`Kode kriteria '${kode}' belum didukung.`);
  }
  return getter(mentorId);
}

export const SUPPORTED_KRITERIA_KODE = Object.keys(metricGetters);