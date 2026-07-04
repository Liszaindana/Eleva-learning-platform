import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Star,
  Settings,
  Calendar,
  HelpCircle,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { PATHS } from '../../routes/paths';
import logo from '../../assets/Logo.png';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const stats = [
    {
      title: 'Total Users',
      value: '1,284',
      trend: '+12%',
      trendUp: true,
      subText: 'vs last month',
      icon: Users,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Total Courses',
      value: '42',
      trend: '+5',
      trendUp: true,
      subText: 'new',
      icon: BookOpen,
      iconColor: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Total Enrollments',
      value: '3,521',
      trend: '+18%',
      trendUp: true,
      subText: 'vs last month',
      icon: TrendingUp,
      iconColor: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      trend: '0.1',
      trendUp: true,
      subText: 'this month',
      icon: Star,
      iconColor: 'text-amber-400 bg-amber-500/10',
    },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate(PATHS.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900">Eleva Admin</span>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
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

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage your Eleva platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 cursor-pointer transition-all"
              >
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      stat.trendUp
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {stat.trend}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{stat.subText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
