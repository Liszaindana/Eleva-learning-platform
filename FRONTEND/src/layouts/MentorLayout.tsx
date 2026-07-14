import { LayoutDashboard, BookOpen, FileText, Star, User, HelpCircle, LogOut } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/endpoints';
import logo from '../assets/Logo.PNG';

export default function MentorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Daftarkan path asli dari PATHS rute kamu agar tombol sidebar tahu harus pindah ke mana
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: PATHS.MENTOR_DASHBOARD || '/mentor/dashboard' },
    { id: 'courses', label: 'My Courses', icon: BookOpen, path: PATHS.MENTOR_CLASS_LIST || '/mentor/courses' },
    { id: 'materials', label: 'Materials', icon: FileText, path: '/mentor/materials' },
    { id: 'reviews', label: 'Student Reviews', icon: Star, path: PATHS.MENTOR_REVIEW_LIST || '/mentor/reviews' },
    { id: 'profile', label: 'Profile', icon: User, path: '/mentor/profile' },
  ];

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate(PATHS.HOME);
    },
    onError: () => {
      logout();
      navigate(PATHS.HOME);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* SIDEBAR BOX - SEBELAH KIRI (TEMA PUTIH) */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0">
        <div className="p-6">
          {/* Logo / App Name */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900">Eleva Mentor</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
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

        {/* Sidebar Footer Area */}
        <div className="p-6 border-t border-slate-200 space-y-6">
          {/* Pro Plan Card - Disesuaikan agar tetap pop-out tapi masuk ke tema putih */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-xl -mr-8 -mt-8" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">Pro Plan</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Unlock advanced analytics and tools.
            </p>
            <Button size="sm" className="w-full text-xs font-semibold py-1.5 bg-blue-700 hover:bg-blue-100 text-white border-none">
              Upgrade to Pro
            </Button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1758685847967-c598c3b176b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxlY3R1cmVyJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Mentor Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || "Mentor User"}
              </p>
              <p className="text-xs text-slate-500 truncate">Mentor</p>
            </div>
          </div>

          {/* Help Center & Logout */}
          <div className="space-y-1 pt-1">
            <a href="#" className="flex items-center gap-3 px-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </a>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-2 py-2 text-xs font-medium text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* KONTEN HALAMAN UTAMA - SEBELAH KANAN (TEMA BERSIH) */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}