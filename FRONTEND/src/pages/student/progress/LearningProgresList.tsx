import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, BookOpen, Star } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { enrollmentApi } from '../../../api/enrollment';
import { examApi } from '../../../api/exam';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';

export default function LearningProgressPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  // 1. Fetch all classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesList'],
    queryFn: classApi.getAll,
  });

  // 2. Fetch all enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollmentsList'],
    queryFn: enrollmentApi.getAll,
  });

  // 3. Fetch all exams/grades
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['examsList'],
    queryFn: examApi.getAll,
  });

  if (classesLoading || enrollmentsLoading || examsLoading) {
    return <LoadingState text="Loading progress data..." />;
  }

  // Filter student enrollments
  const myEnrollments = enrollments.filter((e: any) => Number(e.user_id) === Number(userId));

  // Find classes that student is enrolled in
  const myEnrolledClasses = classes.filter((c: any) =>
    myEnrollments.some((e: any) => Number(e.class_id) === Number(c.class_id))
  );

  // Filter exams for this student
  const myExams = exams.filter((ex: any) => Number(ex.user_id) === Number(userId));
  const passedExams = myExams.filter((ex: any) => ex.is_passed);

  // Calculations
  const totalCourses = myEnrolledClasses.length;
  const completedCourses = myEnrollments.filter((e: any) => e.progress === 100).length;

  const totalLessons = myEnrolledClasses.reduce((sum: number, c: any) => sum + (c.materis?.length || 0), 0);
  const completedLessons = Math.round(
    myEnrolledClasses.reduce((sum: number, c: any) => {
      const enrollmentObj = myEnrollments.find((e: any) => Number(e.class_id) === Number(c.class_id));
      const progressPercent = enrollmentObj ? enrollmentObj.progress : 0;
      const totalMateri = c.materis?.length || 0;
      return sum + (progressPercent / 100) * totalMateri;
    }, 0)
  );

  // Unlocked achievements based on stats
  const achievements = [
    { id: 1, title: 'First Course Enrolled', icon: '🎓', unlocked: totalCourses > 0 },
    { id: 2, title: 'Exam Champion', icon: '🔥', unlocked: passedExams.length > 0 },
    { id: 3, title: 'Halfway There (50%)', icon: '⭐', unlocked: myEnrollments.some((e: any) => e.progress >= 50) },
    { id: 4, title: 'Full Completion', icon: '🏆', unlocked: completedCourses > 0 },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Learning Progress</h1>
            <p className="text-slate-500 text-sm mt-1">Track your achievements and course completion</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Courses Completed</h3>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{completedCourses}</p>
            <p className="text-xs text-slate-500 mt-1">of {totalCourses} enrolled courses</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Lessons Finished</h3>
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{completedLessons}</p>
            <p className="text-xs text-slate-500 mt-1">out of {totalLessons} total lessons</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Achievements Unlocked</h3>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{unlockedCount}</p>
            <p className="text-xs text-slate-500 mt-1">of {achievements.length} possible badges</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Your Badges & Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-100/55 border-amber-200'
                    : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <p className="text-3xl mb-2">{achievement.icon}</p>
                <p className="text-xs font-semibold text-slate-700">{achievement.title}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">
                  {achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Detailed Course Progress</h3>
          
          {myEnrolledClasses.length === 0 ? (
            <EmptyState
              title="No courses tracked"
              description="Start learning inside the Course Catalog to track your detailed lesson completions here."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {myEnrolledClasses.map((course: any) => {
                const enrollmentObj = myEnrollments.find((e: any) => Number(e.class_id) === Number(course.class_id));
                const progress = enrollmentObj ? enrollmentObj.progress : 0;
                const courseLessons = course.materis?.length || 0;
                const finishedLessons = Math.round((progress / 100) * courseLessons);
                const courseImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={course.class_id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
                    onClick={() => navigate(`/student/courses/${course.class_id}`)}
                  >
                    <img
                      src={courseImage}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{course.title}</h4>
                      <p className="text-[11px] text-slate-550 mt-1">
                        {finishedLessons} of {courseLessons} lessons finished
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500 font-semibold">Progress</span>
                          <span className="font-bold text-blue-600">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="text-xs shrink-0 self-start sm:self-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/courses/${course.class_id}`);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
  );
}
