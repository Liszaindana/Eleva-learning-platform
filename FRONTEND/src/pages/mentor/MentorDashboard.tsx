import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  Calendar,
  Download,
  Plus,
  Star,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { PATHS, mentorClassEditPath } from '../../routes/paths';
import { useAuthStore } from '../../store/authStore';
import { enrollmentApi, reviewApi, userApi } from '../../api/endpoints';
import { useQuery } from '@tanstack/react-query';

interface EnrollmentData {
  enrollment_id: number;
  user_id: number;
  class_id: number;
  progress: number;
  role_in_class: string;
  user: {
    user_id: number;
    role_id: number;
    name: string;
    email: string;
    join_date: string;
  };
  class: {
    class_id: number;
    category_id: number;
    periode_id: number;
    level_id: number;
    user_id: number;
    title: string;
    description: string;
    is_active: boolean;
  };
}

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const mentorId = (user as any)?.user_id;

  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const { data: enrollment = [], isLoading: isLoadingEnroll, isError: isErrorEnroll } = useQuery<EnrollmentData[]>({
    queryKey: ['allenrollment'],
    queryFn: enrollmentApi.getAll,
  });

  const [ratingBreakdown, setRatingBreakdown] = useState([
  { stars: 5, percentage: 0 },
  { stars: 4, percentage: 0 },
  { stars: 3, percentage: 0 },
  { stars: 2, percentage: 0 },
  { stars: 1, percentage: 0 },
]);

  const { data: mentorProfileResponse, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['mentorProfile', mentorId],
    queryFn: () => userApi.getById(Number(mentorId)),
    enabled: !!mentorId, // Hanya jalan jika mentorId ada
  });

  const { data: allReviewsResponse } = useQuery({
    queryKey: ['allReviews'],
    queryFn: reviewApi.getAll,
  });

  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    graduationRate: 0,
    teachingPeriod: '0 Mos',
  });

  const [myUniqueCourses, setMyUniqueCourses] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState('0.0');

  useEffect(() => {
    if (!enrollment || enrollment.length === 0) return;

    const mentorId = (user as any)?.user_id;
    const myStudents = enrollment.filter(item => item.class?.user_id === mentorId);
    const totalStudents = myStudents.length;
    const graduatedStudents = myStudents.filter(item => item.progress === 100).length;
    const graduationRate = totalStudents > 0
      ? Math.round((graduatedStudents / totalStudents) * 100)
      : 0;

    const calculatePeriod = (joinDateString?: string) => {
      if (!joinDateString) return '0 Mos';

      const joinDate = new Date(joinDateString);
      const now = new Date();

      const totalMonths = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());

      if (totalMonths <= 0) return '1 Mo';

      if (totalMonths < 12) {
        return `${totalMonths} Mos`;
      }

      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      const yearStr = `${years} Yr${years > 1 ? 's' : ''}`;
      const monthStr = months > 0 ? `${months} Mos` : '';

      return `${yearStr} ${monthStr}`.trim();
    };

    const mentorData = mentorProfileResponse?.data as any;

    const mentorJoinDate = mentorData?.join_date || mentorData?.joinDate;
    const teachingPeriod = calculatePeriod(mentorJoinDate);

    setStatsData({
      totalStudents,
      graduationRate,
      teachingPeriod,
    });

    const courseMap: Record<number, any> = {};
    myStudents.forEach((item) => {
      const c = item.class;
      if (!c) return;

      if (!courseMap[c.class_id]) {
        courseMap[c.class_id] = {
          id: c.class_id,
          title: c.title,
          description: c.description,
          students: 0,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        };
      }
      courseMap[c.class_id].students += 1;
    });

    setMyUniqueCourses(Object.values(courseMap));

    const reviewList = Array.isArray(allReviewsResponse)
      ? allReviewsResponse
      : (allReviewsResponse as any)?.data || [];

    const myReviews = reviewList.filter((rev: any) => rev.class?.user_id === mentorId);

    if (myReviews.length > 0) {
      // A. Hitung Rata-Rata Rating
      const totalRating = myReviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
      const avg = (totalRating / myReviews.length).toFixed(1);
      setAverageRating(avg);

      // B. Hitung Breakdown Bintang (5, 4, 3, 2, 1)
      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      myReviews.forEach((rev: any) => {
        const r = rev.rating as 1 | 2 | 3 | 4 | 5;
        if (counts[r] !== undefined) counts[r]++;
      });

      const breakdown = [5, 4, 3, 2, 1].map((stars) => {
        const count = counts[stars as 1 | 2 | 3 | 4 | 5];
        const percentage = Math.round((count / myReviews.length) * 100);
        return { stars, percentage };
      });
      setRatingBreakdown(breakdown);
    } else {
      setAverageRating('0.0');
      setRatingBreakdown([
        { stars: 5, percentage: 0 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ]);
    }

  }, [enrollment, user, mentorProfileResponse, allReviewsResponse]);

  if (isLoadingEnroll || isLoadingProfile) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Fetching dashboard analytics...</p>
      </div>
    );
  }

  if (isErrorEnroll) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 text-rose-400">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-medium">Failed to load enrollment data.</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: statsData.totalStudents.toLocaleString(),
      trend: 'Realtime',
      trendUp: true,
      subText: 'active data',
      icon: GraduationCap,
      iconColor: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      title: 'Average Rating',
      value: averageRating,
      trend: '0.0',
      trendUp: true,
      subText: 'this month',
      icon: Star,
      iconColor: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Graduation Rate',
      value: `${statsData.graduationRate}%`,
      trend: 'completed',
      trendUp: true,
      subText: 'students',
      icon: TrendingUp,
      iconColor: 'text-emerald-400 bg-emerald-500/10',
      progress: statsData.graduationRate,
    },
    {
      title: 'Teaching Period',
      value: statsData.teachingPeriod,
      trend: 'Established',
      trendUp: true,
      subText: 'experience',
      icon: Clock,
      iconColor: 'text-sky-400 bg-sky-500/10',
    },
  ];

  return (
    <div className="w-full p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* HEADER AREA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mentor Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Welcome back, {user?.name || "Mentor"}. Here's what's happening with your students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
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
            <div key={idx} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl group hover:border-slate-700/80 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconColor}`}>
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
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${stat.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{stat.trend}</span>
                    <span className="text-xs text-slate-500 font-medium">{stat.subText}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAPH ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Student Growth</h3>
              <p className="text-xs text-slate-400">Monthly student acquisition</p>
            </div>
          </div>
          <div className="h-64 w-full flex items-end">
            <span className="text-slate-600 text-xs m-auto">Growth Chart Visualized</span>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-lg font-bold text-white mb-4">Rating Breakdown</h3>
          <div className="space-y-4">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 w-12">{row.stars} Stars</span>
                <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${row.percentage}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-400 w-10 text-right">{row.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE COURSES */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Active Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myUniqueCourses.map((course) => (
            <div key={course.id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col group">
              <div className="h-44 w-full relative overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{course.description}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-4">
                  <span>Students: <strong>{course.students}</strong></span>
                  <span className="text-amber-400 font-semibold">★ {course.rating}</span>
                </div>
                <button onClick={() => navigate(mentorClassEditPath(course.id))} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-all">
                  Edit Course
                </button>
              </div>
            </div>
          ))}

          <div onClick={() => navigate(PATHS.MENTOR_CLASS_CREATE)} className="border-2 border-dashed border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-slate-900/10 hover:bg-indigo-500/[0.02] cursor-pointer transition-all">
            <Plus className="h-6 w-6 text-slate-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-200">Create New Course</h3>
          </div>
        </div>
      </div>
    </div>
  );
} // <--- KURUNG KURAWAL PENUTUP UTAMA DI SINI SEKARANG!