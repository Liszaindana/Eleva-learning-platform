import { useState } from 'react';
import {
  Users,
  BookOpen,
  Star,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import { kelasApi } from '../../api/class';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // 1. Ambil data User riil menggunakan adminApi.getUsers yang sudah bener tadi
  const {
    data: usersData = [],
    isLoading: isLoadingUsers
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers, // <-- Diubah ke adminApi
  });

  // 2. Ambil data Kelas riil menggunakan kelasApi.getAll (sesuai nama objek kamu)
  const {
    data: classesData = [],
    isLoading: isLoadingClasses
  } = useQuery({
    queryKey: ['adminClasses'],
    queryFn: kelasApi.getAll, // <-- Dipastikan pakai kelasApi (huruf k)
  });

  // 3. Masukkan jumlah array (.length) ke stats card
  const stats = [
    {
      title: 'Total Users',
      value: isLoadingUsers ? '...' : usersData.length.toLocaleString(),
      trend: '+12%',
      trendUp: true,
      subText: 'vs last month',
      icon: Users,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Total Courses',
      value: isLoadingClasses ? '...' : classesData.length.toLocaleString(),
      trend: '+5',
      trendUp: true,
      subText: 'new',
      icon: BookOpen,
      iconColor: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Total Enrollments',
      value: '3,521', // Dummy dulu, sesuaikan nanti jika sudah ada api enrollment
      trend: '+18%',
      trendUp: true,
      subText: 'vs last month',
      icon: TrendingUp,
      iconColor: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      title: 'Avg. Rating',
      value: '4.8', // Dummy dulu, sesuaikan nanti jika sudah ada api review
      trend: '0.1',
      trendUp: true,
      subText: 'this month',
      icon: Star,
      iconColor: 'text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
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

        {/* GRID STATS */}

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
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.trendUp
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
