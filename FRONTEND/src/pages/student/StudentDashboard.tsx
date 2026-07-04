import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Star,
  User,
  GraduationCap,
  Clock,
  Calendar,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { PATHS } from '../../routes/paths';
import logo from '../../assets/Logo.png';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const stats = [
    {
      title: 'Total Courses',
      value: '12',
      trend: '+3',
      trendUp: true,
      subText: 'this month',
      icon: BookOpen,
      iconColor: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'In Progress',
      value: '4',
      trend: '1',
      trendUp: true,
      subText: 'new',
      icon: Clock,
      iconColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Completed',
      value: '8',
      trend: '67%',
      trendUp: true,
      subText: 'completion',
      icon: GraduationCap,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Avg. Score',
      value: '88',
      trend: '+2',
      trendUp: true,
      subText: 'points',
      icon: Star,
      iconColor: 'text-sky-400 bg-sky-500/10',
    },
  ];

  const myCourses = [
    {
      id: 1,
      title: 'Advanced UI Design Systems',
      description: 'Master the art of creating scalable design systems.',
      progress: 75,
      tag: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Product Management 101',
      description: 'Essential skills for aspiring product managers.',
      progress: 40,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    navigate(PATHS.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900">Eleva</span>
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
                      ? 'bg-blue-50 text-blue-700'
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
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Sarah Johnson</p>
              <p className="text-xs text-slate-500 truncate">Student</p>
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Dashboard</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Welcome back, Sarah! Continue your learning journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
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

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Courses</h2>
              <p className="text-xs text-slate-600 mt-0.5">Track your learning progress</p>
            </div>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                <div className="h-44 w-full relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.tag && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="info">{course.tag}</Badge>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-bold text-slate-900">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <Button className="w-full py-2">Continue Learning</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
