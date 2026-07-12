import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Sparkles,
  Star,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Container from '../../components/ui/Container';
import SectionHeader from '../../components/ui/SectionHeader';
import { useAuthStore } from '../../store/authStore';

const courseData = [
  {
    id: 1,
    title: 'AI and Machine Learning',
    mentor: 'Dr. Irfan Hakim',
    progress: 42,
    rating: 4.9,
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    mentor: 'Sari Wijaya',
    progress: 12,
    rating: 4.8,
  },
  {
    id: 3,
    title: 'Strategic Management Fundamentals',
    mentor: 'Prof. Bambang Tejo',
    progress: 86,
    rating: 5.0,
  },
];

const assignments = [
  {
    id: 1,
    title: 'Module 4 Quiz: Data Structures',
    due: 'Tomorrow, 11:59 PM',
    status: 'Urgent',
    variant: 'danger',
  },
  {
    id: 2,
    title: 'UX Case Study Submission',
    due: 'In 3 days',
    status: 'Pending',
    variant: 'warning',
  },
];

export default function StudentDashboard() {
  const { user } = useAuthStore();

  return (
    <Container className="py-10">
      <div className="space-y-8">
        <SectionHeader
          title={`Good evening, ${user?.name ?? 'Student'}!`}
          subtitle="You’ve completed 4 courses this month. Keep it up!"
          action={
            <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              2,450 XP
            </Button>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-xl shadow-blue-500/10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 shadow-sm shadow-white/10">
                  <Bell className="h-4 w-4" />
                  Platform Pembelajaran Online Terbaik
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Continue where you left off
                </h2>
                <p className="mt-4 max-w-xl text-sm text-white/80">
                  Module 4: Neural Networks and Deep Learning. You are almost there!
                </p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/90 shadow-inner shadow-white/10">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em]">Current Goal</span>
                  <span className="font-semibold">AI Foundation</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] bg-slate-950/20 shadow-inner shadow-white/10">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-white ring-4 ring-white/20">
                    <span className="text-4xl font-semibold">68%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/80">Current Goal</p>
                <p className="mt-2 text-base font-semibold text-white">AI Foundation</p>
              </div>
              <Button size="sm" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
                Resume Lesson
              </Button>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Progress Overview</p>
                  <p className="mt-2 text-sm text-slate-500">Weekly Target</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">12/15 Hours</span>
              </div>

              <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Completed Lessons</span>
                  <span>24/30</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-3/4 rounded-full bg-blue-600" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Certificates</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">12</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Day Streak</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">45</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <BookOpen className="h-5 w-5" />
                <p className="text-sm font-medium">Next Class</p>
              </div>
              <div className="mt-4 rounded-[1.75rem] bg-slate-50 p-5">
                <p className="text-sm text-slate-500">UI/UX Design Masterclass</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Session starts in 2 hours</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recently Joined Courses</p>
              <p className="mt-2 text-sm text-slate-500">Stay consistent and reach your milestones.</p>
            </div>
            <Link to="/student/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {courseData.map((course) => (
              <div key={course.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-3xl bg-white p-3 shadow-sm">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge variant="info" className="text-[11px] uppercase tracking-[0.18em]">
                    {course.progress}%
                  </Badge>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{course.mentor}</p>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    {course.rating}
                  </span>
                  <span className="text-slate-400">Progress</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Upcoming Assignments</p>
                <p className="mt-1 text-sm text-slate-500">Stay ahead with your deadlines.</p>
              </div>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{assignment.title}</p>
                      <p className="mt-2 text-sm text-slate-500">Due {assignment.due}</p>
                    </div>
                    <Badge variant={assignment.variant as any}>{assignment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Next Milestone</p>
                <p className="mt-1 text-sm text-slate-500">Complete 2 more modules to unlock your global certification.</p>
              </div>
              <div className="rounded-3xl bg-white p-3 text-blue-600 shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Module Completion</span>
                <span>4 / 6</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-2/3 rounded-full bg-blue-600" />
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-[1.75rem] bg-slate-100 p-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Junior Data Analyst Certificate</p>
                    <p className="text-sm text-slate-500">Complete 2 more modules to unlock.</p>
                  </div>
                </div>
                <Button className="w-full" size="md">
                  View Learning Path
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
