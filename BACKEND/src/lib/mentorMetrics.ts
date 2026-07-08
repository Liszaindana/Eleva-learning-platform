import { prisma } from "./db.js";

const metricGetters: Record<
  string,
  (mentorId: number) => Promise<number>
> = {
 
// RATING MENTOR
  RATING: async (mentorId) => {
    const result = await prisma.review.aggregate({
      where: {
        class: {
          user_id: mentorId,
        },
      },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating ?? 0;
  },

// TINGKAT KELULUSAN
  KELULUSAN: async (mentorId) => {
    const totalExam = await prisma.exam.count({
      where: {
        class: {
          user_id: mentorId,
        },
      },
    });

    if (totalExam === 0) return 0;

    const passedExam = await prisma.exam.count({
      where: {
        class: {
          user_id: mentorId,
        },
        is_passed: true,
      },
    });

    return Number(((passedExam / totalExam) * 100).toFixed(2));
  },

 
// JUMLAH SISWA
  JUMLAH_PESERTA: async (mentorId) => {
    const total = await prisma.enrollment.count({
      where: {
        role_in_class: "siswa",
        class: {
          user_id: mentorId,
        },
      },
    });

    return total;
  },

// JUMLAH KELAS
  JUMLAH_KELAS: async (mentorId) => {
    return await prisma.class.count({
      where: {
        user_id: mentorId,
      },
    });
  },

// LAMA MENGAJAR
  LAMA_MENGAJAR: async (mentorId) => {
    const mentor = await prisma.user.findUnique({
      where: {
        user_id: mentorId,
      },
      select: {
        join_date: true,
      },
    });

    if (!mentor) return 0;

    const now = new Date();

    const diff =
      now.getTime() - mentor.join_date.getTime();

    const years =
      diff / (1000 * 60 * 60 * 24 * 365.25);

    return Number(years.toFixed(2));
  },
};

// GET NILAI KRITERIA
export async function getMetricValue(
  kode: string,
  mentorId: number
): Promise<number> {
  const getter = metricGetters[kode];

  if (!getter) {
    throw new Error(
      `Kode kriteria '${kode}' belum didukung.`
    );
  }

  return getter(mentorId);
}

// DAFTAR KRITERIA YANG DIDUKUNG
export const SUPPORTED_KRITERIA_KODE =
  Object.keys(metricGetters);