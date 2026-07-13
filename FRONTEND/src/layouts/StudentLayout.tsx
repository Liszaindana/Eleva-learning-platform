import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// Tambahkan ikon Star (atau ikon lain sesuai seleramu) untuk menu SPK
import { LayoutDashboard, BookOpen, Award, FileText, Calendar, User, HelpCircle, LogOut, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { PATHS } from '../routes/paths'; // Sesuaikan lokasi path importmu jika perlu

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { id: 'my-courses', label: 'My Courses', path: '/student/courses', icon: BookOpen },
    { id: 'learning-progress', label: 'Learning Progress', path: '/student/progress', icon: Award },    
    { id: 'profile', label: 'Profile', path: '/student/profile', icon: User },
    { id: 'assignments', label: 'Assignments', path: '/student/exams', icon: FileText },
    { id: 'recommendation', label: 'Rekomendasi Mentor', path: PATHS.RECOMMENDATION, icon: Star },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    try {
      // Jalankan fungsi logout untuk hapus token/state user
      await logout(); 
      
      // Arahkan ke halaman login (atau PATHS.LOGIN jika menggunakan objek paths)
      navigate('/login'); 
    } catch (error) {
      console.error("Gagal logout:", error);
      // Fallback jika terjadi kendala pada async action store
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="flex flex-col justify-between h-full p-6">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white text-lg font-bold">E</div>
              <span className="text-xl font-semibold tracking-wide text-slate-900">Eleva</span>
            </div>

            <div className="flex items-center gap-3 rounded-3xl bg-slate-100 p-4 mb-8">
              <img
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User Avatar"
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 truncate">{user?.name ?? 'Student'}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Participant</p>
              </div>
            </div>

            <nav className="space-y-3">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 pt-6">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-blue-700">Unlock more resources</p>
              <p className="mt-2 text-sm text-slate-600">Upgrade to Pro for more learning benefits.</p>
              <Button variant="primary" size="sm" className="mt-4 w-full">
                Upgrade to Pro
              </Button>
            </div>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}