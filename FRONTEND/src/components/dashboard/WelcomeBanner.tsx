import { Play, Flame, Award } from 'lucide-react';
import Button from '../ui/Button';

interface WelcomeBannerProps {
  userName: string;
  subtitle?: string;
  currentGoal?: string;
  resumePath?: string;
  onResumeClick?: () => void;
  progressPercent?: number;
  streakDays?: number;
}

export default function WelcomeBanner({
  userName,
  subtitle = "Ready to continue your learning journey?",
  currentGoal = "General Studies",
  onResumeClick,
  progressPercent = 0,
  streakDays = 1,
}: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-blue-400/20">
      {/* Dynamic decorative background shapes */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-sky-300/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm">
            <Award className="h-3.5 w-3.5" />
            Current Focus: {currentGoal}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-blue-100 text-sm md:text-base font-medium leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 border-none font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              onClick={onResumeClick}
            >
              Resume Learning
              <Play className="h-4 w-4 fill-current" />
            </Button>

            {streakDays > 0 && (
              <div className="flex items-center gap-1.5 bg-slate-900/20 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-xl">
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span className="text-xs font-bold">{streakDays} Day Streak</span>
              </div>
            )}
          </div>
        </div>

        {progressPercent > 0 && (
          <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl md:text-right shadow-inner">
            <div>
              <p className="text-3xl md:text-4xl font-black tracking-tight">{progressPercent}%</p>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-extrabold mt-1">
                Active Module Progress
              </p>
              <div className="h-1.5 w-32 bg-white/20 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
