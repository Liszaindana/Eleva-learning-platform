import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Star,
  HelpCircle,
  LogOut,
  Sliders,
  Clock,
} from 'lucide-react';
import { PATHS } from '../routes/paths';
import logo from '../assets/Logo.PNG';
import { authApi } from '../api/endpoints';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Daftarkan path asli dari PATHS rute kamu agar tombolnya tahu harus pindah ke mana
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: PATHS.ADMIN_DASHBOARD },
    { id: 'users', label: 'Users', icon: Users, path: PATHS.ADMIN_USER_LIST },
    { id: 'courses', label: 'Courses', icon: BookOpen, path: PATHS.ADMIN_CLASS_LIST },
    { id: 'categories', label: 'Categories', icon: FileText, path: PATHS.ADMIN_CATEGORY_LIST },
    { id: 'reviews', label: 'Reviews', icon: Star, path: PATHS.ADMIN_REVIEW_LIST },
    { id: 'kriteria', label: 'Kriteria SPK', icon: Sliders, path: PATHS.ADMIN_KRITERIA },
    { id: 'histori', label: 'Histori', icon: Clock, path: PATHS.ADMIN_RECOMMENDATION_ALL },
  ];

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate(PATHS.HOME);
    },
    onError: (error) => {
      console.error("Gagal logout di backend, tetap bersihkan frontend:", error);
      logout();
      navigate(PATHS.HOME);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* SIDEBAR BOX - SEBELAH KIRI */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900">Eleva Admin</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              // OTOMATIS AKTIF: Membandingkan URL browser saat ini dengan target path menu
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
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

        <div className="p-6 border-t border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <a href="#" className="flex items-center gap-3 px-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-2 py-2 text-xs font-medium text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* KONTEN HALAMAN UTAMA - SEBELAH KANAN */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}