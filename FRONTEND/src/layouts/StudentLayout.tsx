import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Sesuaikan path store kamu
import { PATHS } from '../routes/paths'; // Sesuaikan path routes kamu
import { 
  LayoutDashboard, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Star, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import logo from '../assets/Logo.png'; // Sesuaikan path logo kamu

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Daftar item sidebar untuk Siswa (Tanpa materi yang ambigu)
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', path: PATHS.STUDENT_DASHBOARD, icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', path: '/student/courses', icon: BookOpen }, // Sesuaikan jika ada path khusus
    { id: 'explore', label: 'Explore Classes', path: '/student/explore', icon: Compass }, 
    { id: 'recommendation', label: 'Rekomendasi SPK', path: PATHS.RECOMMENDATION, icon: Sparkles },
    { id: 'reviews', label: 'My Reviews', path: '/student/reviews', icon: Star },
    { id: 'profile', label: 'Profile', path: '/student/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar Container */}
      <aside 
        className={`bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Button Collapse */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-500 hover:text-slate-800 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Top Section: Logo */}
        <div className="p-5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shrink-0">
              <img src={logo} alt="Eleva Logo" className="h-6 w-6 object-contain" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-wider text-slate-900 transition-opacity duration-200">
                Eleva
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 mt-8">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0 uppercase">
              {user?.name?.charAt(0) || 'S'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 transition-opacity duration-200">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Siswa'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'siswa@eleva.com'}</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50/50 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}