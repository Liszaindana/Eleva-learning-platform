import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Compass, PlayCircle, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { classApi } from '../../api/class';
import { enrollmentApi } from '../../api/enrollment';
import CourseCard from '../../components/dashboard/CourseCard';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  // 1. Fetch data dari backend
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesList'],
    queryFn: classApi.getAll,
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollmentsList'],
    queryFn: enrollmentApi.getAll,
  });

  // 2. Mutasi Pendaftaran Kelas Baru
  const enrollMutation = useMutation({
    mutationFn: (classId: number) =>
      enrollmentApi.create({
        user_id: Number(userId),
        class_id: classId,
        role_in_class: 'siswa',
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsList'] });
      queryClient.invalidateQueries({ queryKey: ['classesList'] });
      alert('Selamat! Kamu berhasil mendaftar di kelas ini.');
      if (data?.data?.class_id) {
        navigate(`/student/courses/${data.data.class_id}`);
      }
    },
    onError: (error: any) => {
      alert(error.message || 'Gagal mendaftar ke dalam kelas.');
    },
  });

  if (classesLoading || enrollmentsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <LoadingState text="Memuat dashboard kamu..." />
      </div>
    );
  }

  // 3. Logika Filter Data Realistis
  const myEnrollments = enrollments.filter((e: any) => Number(e.user_id) === Number(userId));

  // Mendapatkan daftar kelas yang sedang diikuti
  const myEnrolledClasses = classes.filter((c: any) =>
    myEnrollments.some((e: any) => Number(e.class_id) === Number(c.class_id))
  );

  // Menentukan kelas terakhir yang diakses (Bisa diambil dari data paling akhir di-enroll)
  const lastAccessedCourse = myEnrolledClasses[myEnrolledClasses.length - 1];
  const lastAccessedEnrollment = myEnrollments.find(
    (e: any) => Number(e.class_id) === Number(lastAccessedCourse?.class_id)
  );

  // Kelas baru yang tersedia untuk dieksplorasi
  const exploreClasses = classes.filter(
    (c: any) => !myEnrollments.some((e: any) => Number(e.class_id) === Number(c.class_id)) && c.is_active
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER: Menyapa User */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Halo, {user?.name || 'Student'}! 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Selamat datang kembali. Yuk, lanjutkan progres belajarmu hari ini.</p>
        </div>

        {/* SECTION 1: Lanjutkan Belajar (Prioritas Utama) */}
        {lastAccessedCourse && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="bg-blue-500/30 text-blue-100 text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider">
                Terakhir Diakses
              </span>
              <h2 className="text-xl font-bold">{lastAccessedCourse.title}</h2>
              <p className="text-blue-100/80 text-sm">
                Progres saat ini: <span className="font-semibold text-white">{lastAccessedEnrollment?.progress || 0}%</span>
              </p>
            </div>
            <Button 
              onClick={() => navigate(`/student/courses/${lastAccessedCourse.class_id}`)}
              className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 cursor-pointer font-semibold shadow"
            >
              <PlayCircle className="h-5 w-5" />
              Lanjutkan Belajar
            </Button>
          </div>
        )}

        {/* SECTION 2: Daftar Kelas Saya */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Kelas Aktif Kamu ({myEnrolledClasses.length})</h3>
          </div>

          {myEnrolledClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <EmptyState
                icon={<BookOpen className="h-8 w-8 text-slate-400" />}
                title="Kamu belum terdaftar di kelas manapun"
                description="Silakan lihat daftar katalog di bawah untuk menemukan kelas pemrograman atau IT yang ingin kamu pelajari."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEnrolledClasses.map((course: any) => {
                const enrollmentObj = myEnrollments.find((e: any) => Number(e.class_id) === Number(course.class_id));
                return (
                  <CourseCard
                    key={course.class_id}
                    id={course.class_id}
                    title={course.title}
                    category={course.category?.categories || 'General'}
                    level={course.level?.level_info || 'All Levels'}
                    progress={enrollmentObj ? enrollmentObj.progress : 0}
                    mentorName={course.mentor?.name || 'Experienced Mentor'}
                    onClick={() => navigate(`/student/courses/${course.class_id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}