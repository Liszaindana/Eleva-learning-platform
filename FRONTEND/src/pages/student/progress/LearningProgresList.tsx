import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CheckCircle, BarChart3, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { enrollmentApi } from '../../../api/enrollment';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';

export default function LearningProgressPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  // 1. Fetch data kelas
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesList'],
    queryFn: classApi.getAll,
  });

  // 2. Fetch data pendaftaran kelas
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollmentsList'],
    queryFn: enrollmentApi.getAll,
  });

  if (classesLoading || enrollmentsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <LoadingState text="Memuat progres belajar kamu..." />
      </div>
    );
  }

  // Filter kelas yang di-join oleh student ini
  const myEnrollments = enrollments.filter((e: any) => Number(e.user_id) === Number(userId));
  const myEnrolledClasses = classes.filter((c: any) =>
    myEnrollments.some((e: any) => Number(e.class_id) === Number(c.class_id))
  );

  // Kalkulasi Status Kelas
  const totalCourses = myEnrolledClasses.length;
  const completedCourses = myEnrollments.filter((e: any) => e.progress === 100).length;
  const activeCourses = totalCourses - completedCourses;

  // Rumus Finish Rate (Win Rate Belajar)
  const finishRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  // Penentuan warna dinamis berdasarkan tingginya Finish Rate (Khas Game)
  let finishRateColor = 'text-red-600 bg-red-50 border-red-100';
  if (finishRate >= 75) {
    finishRateColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
  } else if (finishRate >= 40) {
    finishRateColor = 'text-amber-600 bg-amber-50 border-amber-100';
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistik Progres</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau performa penyelesaian kelas dan riwayat belajarmu</p>
      </div>

      {/* 3 Columns Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Kelas Aktif */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-500">Kelas Berjalan</h3>
            <p className="text-3xl font-bold text-slate-900">{activeCourses}</p>
            <p className="text-xs text-slate-400">sedang aktif dipelajari</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Kelas Selesai */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-500">Kelas Selesai</h3>
            <p className="text-3xl font-bold text-slate-900">{completedCourses}</p>
            <p className="text-xs text-slate-400">dari {totalCourses} total kelas yang diambil</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Finish Rate (WR) ala Game */}
        <div className={`rounded-2xl p-6 border shadow-sm flex items-center justify-between transition-colors ${finishRateColor}`}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold opacity-80 text-slate-700">Finish Rate (WR)</h3>
            <p className="text-3xl font-extrabold">{finishRate}%</p>
            <p className="text-xs opacity-75 text-slate-500">
              {finishRate >= 75 ? '🔥 Sangat Konsisten!' : finishRate >= 40 ? '👍 Cukup Baik' : '⚠️ Selesaikan kelasmu!'}
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl shadow-sm">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Detailed Course Progress Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h3 className="text-md font-bold text-slate-900">Detail Progres Setiap Kelas</h3>
          <p className="text-slate-400 text-xs mt-0.5">Klik pada salah satu kelas untuk melanjutkan materi pembelajaran.</p>
        </div>

        {myEnrolledClasses.length === 0 ? (
          <EmptyState
            title="Belum ada kelas yang dilacak"
            description="Mulai mendaftar kelas di Course Catalog untuk memantau detail perkembangan belajarmu di sini."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {myEnrolledClasses.map((course: any) => {
              const enrollmentObj = myEnrollments.find((e: any) => Number(e.class_id) === Number(course.class_id));
              const progress = enrollmentObj ? enrollmentObj.progress : 0;
              const courseLessons = course.materis?.length || 0;
              const finishedLessons = Math.round((progress / 100) * courseLessons);
              const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';

              return (
                <div
                  key={course.class_id}
                  onClick={() => navigate(`/student/courses/${course.class_id}`)}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50/70 px-3 rounded-xl transition-all group"
                >
                  {/* Thumbnail Kelas */}
                  <img
                    src={fallbackImage}
                    alt={course.title}
                    className="w-14 h-14 object-cover rounded-xl shrink-0 border border-slate-100"
                  />

                  {/* Info Judul & Jumlah Modul */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {finishedLessons} dari {courseLessons} materi telah diselesaikan
                    </p>

                    {/* Progress Bar Container */}
                    <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 min-w-[28px] text-right">{progress}%</span>
                    </div>
                  </div>

                  {/* Tombol Lanjut Action */}
                  <Button
                    size="sm"
                    variant={progress === 100 ? 'secondary' : 'primary'}
                    className="text-xs shrink-0 self-start sm:self-center flex items-center gap-1.5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student/courses/${course.class_id}`);
                    }}
                  >
                    {progress === 100 ? 'Lihat Kembali' : 'Lanjutkan'}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}