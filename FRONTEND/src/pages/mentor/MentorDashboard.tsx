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
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Mentor Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Welcome back, <span className="font-semibold">{user?.name || "Mentor"}</span>.
            Here's what's happening with your students.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>

            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${stat.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>

              </div>

              <div className="mt-5">

                {stat.progress !== undefined ? (

                  <div>

                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Completion</span>
                      <span className="font-semibold text-indigo-600">
                        {stat.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>

                  </div>

                ) : (

                  <div className="flex items-center gap-2">

                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {stat.trend}
                    </span>

                    <span className="text-xs text-slate-500">
                      {stat.subText}
                    </span>

                  </div>

                )}

              </div>

            </div>
          );
        })}

      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Student Growth */}

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

          <div className="mb-6">

            <h3 className="text-lg font-semibold text-slate-900">
              Student Growth
            </h3>

            <p className="text-sm text-slate-500">
              Monthly student acquisition
            </p>

          </div>

          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <span className="text-sm text-slate-500">
              Growth Chart Visualized
            </span>
          </div>

        </div>

        {/* Rating */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            Rating Breakdown
          </h3>

          <div className="space-y-5">

            {ratingBreakdown.map((row) => (

              <div
                key={row.stars}
                className="flex items-center gap-3"
              >

                <span className="w-12 text-sm font-medium text-slate-600">
                  {row.stars}★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                    style={{
                      width: `${row.percentage}%`,
                    }}
                  />

                </div>

                <span className="w-10 text-right text-sm font-semibold text-slate-600">
                  {row.percentage}%
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* ACTIVE COURSES */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Active Courses
          </h2>

          <span className="text-sm text-slate-500">
            {myUniqueCourses.length} Courses
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {myUniqueCourses.map((course) => (

            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
            >

              {/* Cover */}
              <div className="relative h-44 overflow-hidden">

                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

              </div>

              {/* Content */}
              <div className="flex h-[210px] flex-col justify-between p-5">

                <div>

                  <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {course.description}
                  </p>

                </div>

                <div>

                  <div className="mb-4 flex items-center justify-between border-t border-slate-200 pt-4">

                    <div className="text-sm text-slate-600">
                      Students
                      <div className="font-semibold text-slate-900">
                        {course.students}
                      </div>
                    </div>

                    <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                      ★ {course.rating}
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      navigate(mentorClassEditPath(course.id))
                    }
                    className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Edit Course
                  </button>

                </div>

              </div>

            </div>

          ))}

          {/* Create New */}

          <div
            onClick={() => navigate(PATHS.MENTOR_CLASS_CREATE)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
          >

            <div className="mb-4 rounded-full bg-indigo-100 p-4">
              <Plus className="h-7 w-7 text-indigo-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Create New Course
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Start building a new learning experience for your students.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
} // <--- KURUNG KURAWAL PENUTUP UTAMA DI SINI SEKARANG!