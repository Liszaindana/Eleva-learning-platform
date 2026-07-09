import { LayoutDashboard, BookOpen, FileText, Star, User, HelpCircle, LogOut } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import { PATHS } from '../routes/paths';
import { useAuthStore } from '../store/authStore'; 
import { authApi } from '../api/endpoints'; 
import logo from '../assets/Logo.png'; 

export default function MentorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Ambil state user saat ini dan fungsi logout

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
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6">
          {/* Logo / App Name */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">Eleva</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              // ✨ Cek keaktifan tab berdasarkan rute URL saat ini (Lebih akurat daripada local state)
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)} // ✨ Beneran pindah rute/halaman
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
        <div className="p-6 border-t border-slate-800 space-y-6">
          {/* Pro Plan Card */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl -mr-8 -mt-8" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Pro Plan</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Unlock advanced analytics and tools.
            </p>
            <Button size="sm" className="w-full text-xs font-semibold py-1.5">
              Upgrade to Pro
            </Button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img
              src={
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              alt="Mentor Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              {/* ✨ Menampilkan nama mentor dinamis dari database */}
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "Mentor User"}
              </p>
              <p className="text-xs text-slate-500 truncate">Mentor</p>
            </div>
          </div>

          {/* Help Center & Logout */}
          <div className="space-y-1 pt-1">
            <a href="#" className="flex items-center gap-3 px-2 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </a>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-2 py-2 text-xs font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/5 transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Container utama untuk merender komponen halaman di sebelah kanan */}
      <main className="flex-1 bg-slate-950 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}