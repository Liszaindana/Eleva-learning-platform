import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { enrollmentApi } from '../../api/endpoints'; // Jalur file tempat enrollmentApi berada
import { 
  BookOpen, Star, GraduationCap, 
  Clock} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');

  // 1. Konsumsi API riil menggunakan query yang sudah kamu punya
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['student-enrollments'],
    queryFn: enrollmentApi.getMyEnrollment,
  });

  // 2. Hitung statistik secara dinamis berdasarkan data riil database
  const totalCourses = enrollments.length;
  const inProgressCourses = enrollments.filter((e: any) => e.status === 'IN_PROGRESS' || e.status === 'in-progress').length;
  const completedCourses = enrollments.filter((e: any) => e.status === 'COMPLETED' || e.status === 'completed').length;
  
  // Menghitung rata-rata nilai (jika ada properti score/grade di tabel enrollment kamu)
  const totalScore = enrollments.reduce((acc: number, cur: any) => acc + (cur.score || cur.grade || 0), 0);
  const avgScore = totalCourses > 0 ? Math.round(totalScore / totalCourses) : 0;

  const stats = [
    { title: 'Total Courses', value: totalCourses, icon: BookOpen, iconColor: 'text-blue-400 bg-blue-500/10' },
    { title: 'In Progress', value: inProgressCourses, icon: Clock, iconColor: 'text-amber-400 bg-amber-500/10' },
    { title: 'Completed', value: completedCourses, icon: GraduationCap, iconColor: 'text-emerald-400 bg-emerald-500/10' },
    { title: 'Avg. Score', value: avgScore, icon: Star, iconColor: 'text-sky-400 bg-sky-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Konten Utama */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8 overflow-y-auto w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Dashboard</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Selamat datang kembali, {user?.name || 'Siswa'}! Yuk, lanjutkan perjalanan belajarmu.
          </p>
        </div>

        {/* Kartu Statistik Dinamis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.title}</p>
                    <h3 className="text-3xl font-black text-slate-900 ">{isLoading ? '...' : stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daftar Kelas Dinamis */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Kelas yang Diikuti</h2>
          
          {isLoading ? (
            <div className="text-center py-8 text-slate-500 text-sm">Sedang memuat data kelas...</div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
              Kamu belum mendaftar di kelas manapun.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enrollments.map((item: any) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between p-5 group">
                  <div>
                    {/* Sesuaikan properti item.kelas?.title atau item.class?.name dengan relasi database backend-mu */}
                    <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-2">
                      {item.kelas?.title || item.class?.title || 'Judul Kelas Tidak Tersedia'}
                    </h3>
                    <span className={`inline-block text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full ${
                      item.status === 'COMPLETED' || item.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <Button className="w-full py-2 text-xs">Mulai Belajar</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}