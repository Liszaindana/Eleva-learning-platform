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
  ArrowUpRight,
  ChevronDown,
  Calendar,
  Download,
  Plus,
  HelpCircle,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { PATHS } from '../../routes/paths';
import logo from '../../assets/Logo.png';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [studentGrowthYear, setStudentGrowthYear] = useState('This Year');

  // Static/Mock Data corresponding to screenshot
  const stats = [
    {
      title: 'Total Students',
      value: '1,284',
      trend: '+12%',
      trendUp: true,
      subText: 'vs last month',
      icon: GraduationCap,
      iconColor: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      title: 'Average Rating',
      value: '4.9',
      trend: '0.2',
      trendUp: true,
      subText: 'this month',
      icon: Star,
      iconColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Graduation Rate',
      value: '88%',
      trend: '88/100',
      trendUp: true,
      subText: 'completed',
      icon: TrendingUp,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      progress: 88,
    },
    {
      title: 'Teaching Period',
      value: '3.5 yrs',
      trend: 'Established',
      trendUp: true,
      subText: 'experience',
      icon: Clock,
      iconColor: 'text-sky-400 bg-sky-500/10',
    },
  ];

  const ratingBreakdown = [
    { stars: 5, percentage: 92 },
    { stars: 4, percentage: 6 },
    { stars: 3, percentage: 1 },
    { stars: 2, percentage: 0.5 },
    { stars: 1, percentage: 0.5 },
  ];

  const activeCourses = [
    {
      id: 1,
      title: 'Advanced UI Design Systems',
      description: 'Master the art of creating scalable design systems for modern applications.',
      students: 342,
      rating: 4.9,
      progress: 75,
      tag: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Product Management 101',
      description: 'Essential skills for aspiring product managers in the digital era.',
      students: 215,
      rating: 4.8,
      progress: 40,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'reviews', label: 'Student Reviews', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    // Navigate to home or login page on logout
    navigate(PATHS.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-6">
          {/* Logo / App Name */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <img src={logo} alt="Eleva Logo" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Eleva</span>
          </div>

          {/* Navigation Items */}
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
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Budi Santoso Avatar"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Budi Santoso</p>
              <p className="text-xs text-slate-500 truncate">Senior Mentor</p>
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
              className="w-full flex items-center gap-3 px-2 py-2 text-xs font-medium text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Mentor Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Welcome back, Pak Budi. Here's what's happening with your students.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all"
              >
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {stat.progress !== undefined ? (
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
                        <span>Completion</span>
                        <span className="font-semibold text-indigo-400">{stat.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          stat.trendUp
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {stat.trend}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{stat.subText}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS / ANALYSIS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Growth Chart */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Student Growth</h3>
                <p className="text-xs text-slate-400">Monthly student acquisition</p>
              </div>
              <div className="relative">
                <select
                  value={studentGrowthYear}
                  onChange={(e) => setStudentGrowthYear(e.target.value)}
                  className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 pr-8 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option>This Year</option>
                  <option>Last Year</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* SVG Visualizing Student Growth Line & Area Chart */}
            <div className="h-64 w-full flex items-end">
              <svg className="w-full h-full" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="40" y1="40" x2="580" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="40" y1="90" x2="580" y2="90" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="40" y1="140" x2="580" y2="140" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="40" y1="190" x2="580" y2="190" stroke="#1e293b" strokeDasharray="4 4" />

                {/* Left labels */}
                <text x="15" y="45" fill="#64748b" className="text-[10px] font-medium">1,500</text>
                <text x="15" y="95" fill="#64748b" className="text-[10px] font-medium">1,000</text>
                <text x="15" y="145" fill="#64748b" className="text-[10px] font-medium">500</text>
                <text x="15" y="195" fill="#64748b" className="text-[10px] font-medium">0</text>

                {/* Area under the line */}
                <path
                  d="M 60 210 L 60 170 Q 140 160 140 150 T 220 120 T 300 110 T 380 90 T 460 70 T 540 50 L 540 210 Z"
                  fill="url(#chartGradient)"
                />

                {/* Main Growth Curve Line */}
                <path
                  d="M 60 170 Q 140 160 140 150 T 220 120 T 300 110 T 380 90 T 460 70 T 540 50"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive circles/nodes on the line */}
                <circle cx="60" cy="170" r="5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <circle cx="140" cy="150" r="5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <circle cx="220" cy="120" r="5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <circle cx="300" cy="110" r="5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <circle cx="380" cy="90" r="5" fill="#6366f1" stroke="#0f172a" strokeWidth="2" />
                <circle cx="460" cy="70" r="5" fill="#8b5cf6" stroke="#0f172a" strokeWidth="2" />
                <circle cx="540" cy="50" r="6" fill="#ec4899" stroke="#0f172a" strokeWidth="2" className="animate-pulse" />

                {/* Tooltip value for July node */}
                <rect x="500" y="10" width="55" height="25" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
                <text x="512" y="27" fill="#ffffff" className="text-[11px] font-bold">+12%</text>

                {/* X Axis Labels */}
                <text x="50" y="230" fill="#64748b" className="text-[11px] font-semibold">Jan</text>
                <text x="130" y="230" fill="#64748b" className="text-[11px] font-semibold">Feb</text>
                <text x="210" y="230" fill="#64748b" className="text-[11px] font-semibold">Mar</text>
                <text x="290" y="230" fill="#64748b" className="text-[11px] font-semibold">Apr</text>
                <text x="370" y="230" fill="#64748b" className="text-[11px] font-semibold">May</text>
                <text x="450" y="230" fill="#64748b" className="text-[11px] font-semibold">Jun</text>
                <text x="530" y="230" fill="#6366f1" className="text-[11px] font-bold">Jul</text>
              </svg>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Rating Breakdown</h3>
              <p className="text-xs text-slate-400 mb-6">Distribution of student feedback</p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-4">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-300 w-12 shrink-0">
                    {row.stars} Stars
                  </span>
                  <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 w-10 text-right">
                    {row.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* View All Reviews Footer */}
            <div className="mt-8 border-t border-slate-800 pt-4 text-center">
              <a
                href="#"
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5"
              >
                View All 428 Reviews
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ACTIVE COURSES SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Active Courses</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage and track your active learning courses</p>
            </div>
            <a href="#" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              View All
            </a>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700/80 transition-all duration-300 flex flex-col group"
              >
                {/* Course Image */}
                <div className="h-44 w-full relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.tag && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="success">{course.tag}</Badge>
                    </div>
                  )}
                </div>

                {/* Course Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-4">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4 text-indigo-400" />
                        <strong>{course.students}</strong> Students
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.rating}
                      </span>
                    </div>

                    {/* Course Progress */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-400">Course Progress</span>
                        <span className="font-bold text-slate-300">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 active:scale-[0.98] text-xs font-semibold text-slate-200 rounded-xl transition-all border border-slate-700/60 cursor-pointer">
                      Edit Course
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Course Placeholder */}
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/10 hover:bg-indigo-500/[0.02] cursor-pointer group transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 flex items-center justify-center mb-4 transition-colors">
                <Plus className="h-6 w-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                Create New Course
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                Launch a new learning path and reach more students.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-slate-900 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            <span className="text-indigo-400 font-semibold">Eleva</span> — © 2026 Eleva Indonesia. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact Us</a>
            <a href="#" className="hover:text-slate-300 transition-colors">FAQ</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
