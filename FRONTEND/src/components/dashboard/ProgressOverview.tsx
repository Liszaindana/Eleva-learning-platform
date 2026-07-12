import { TrendingUp } from 'lucide-react';

interface ProgressOverviewProps {
  completedCourses: number;
  totalCourses: number;
  completedLessons: number;
  totalLessons: number;
  certificatesCount: number;
  streakDays: number;
}

export default function ProgressOverview({
  completedCourses,
  totalCourses,
  completedLessons,
  totalLessons,
  certificatesCount,
  streakDays,
}: ProgressOverviewProps) {
  const lessonProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const courseProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Learning Progress</h3>
        <TrendingUp className="h-5 w-5 text-blue-500" />
      </div>

      {/* Courses Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">Completed Courses</span>
          <span className="text-slate-800">{completedCourses}/{totalCourses}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${courseProgress}%` }}
          />
        </div>
      </div>

      {/* Completed Lessons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">Completed Lessons</span>
          <span className="text-slate-800">{completedLessons}/{totalLessons}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${lessonProgress}%` }}
          />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-blue-700">{certificatesCount}</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">Certificates</p>
        </div>
        <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-amber-700">{streakDays}</p>
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-1">Day Streak</p>
        </div>
      </div>
    </div>
  );
}
