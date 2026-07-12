import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, GraduationCap, Compass } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { enrollmentApi } from '../../../api/enrollment';
import CourseCard from '../../../components/dashboard/CourseCard';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  const [activeTab, setActiveTab] = useState<'my' | 'explore'>('my');

  // Fetch all classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesList'],
    queryFn: classApi.getAll,
  });

  // Fetch all enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollmentsList'],
    queryFn: enrollmentApi.getAll,
  });

  // Mutation to enroll in a new class
  const enrollMutation = useMutation({
    mutationFn: (classId: number) =>
      enrollmentApi.create({
        user_id: Number(userId),
        class_id: classId,
        role_in_class: 'siswa',
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsList'] });
      queryClient.invalidateQueries({ queryKey: ['classesList'] });
      alert('Congratulations! You have successfully enrolled in this course.');
      if (data?.data?.class_id) {
        navigate(`/student/courses/${data.data.class_id}`);
      }
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to enroll in the class.');
    },
  });

  if (classesLoading || enrollmentsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <LoadingState text="Loading courses catalog..." />
      </div>
    );
  }

  // Filter enrollments for current student
  const myEnrollments = enrollments.filter((e: any) => Number(e.user_id) === Number(userId));

  // Enrolled classes
  const myEnrolledClasses = classes.filter((c: any) =>
    myEnrollments.some((e: any) => Number(e.class_id) === Number(c.class_id))
  );

  // Unenrolled classes
  const exploreClasses = classes.filter(
    (c: any) => !myEnrollments.some((e: any) => Number(e.class_id) === Number(c.class_id)) && c.is_active
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Course Center</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and discover your learning paths</p>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl self-start sm:self-center">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'my'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              My Courses ({myEnrolledClasses.length})
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="h-4 w-4" />
              Explore Catalog ({exploreClasses.length})
            </button>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'my' ? (
          myEnrolledClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <EmptyState
                icon={<BookOpen className="h-8 w-8" />}
                title="No enrolled courses yet"
                description="You are not enrolled in any courses. Browse our explore catalog to find courses."
                action={
                  <Button onClick={() => setActiveTab('explore')}>
                    Explore Course Catalog
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEnrolledClasses.map((course: any) => {
                const enrollmentObj = myEnrollments.find((e: any) => Number(e.class_id) === Number(course.class_id));
                const progress = enrollmentObj ? enrollmentObj.progress : 0;
                return (
                  <CourseCard
                    key={course.class_id}
                    id={course.class_id}
                    title={course.title}
                    category={course.category?.categories || 'General'}
                    level={course.level?.level_info || 'All Levels'}
                    progress={progress}
                    mentorName={course.mentor?.name || 'Experienced Mentor'}
                    onClick={() => navigate(`/student/courses/${course.class_id}`)}
                  />
                );
              })}
            </div>
          )
        ) : exploreClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <EmptyState
              icon={<Compass className="h-8 w-8" />}
              title="No courses available to enroll"
              description="Looks like you have enrolled in all available courses or there are no new courses at the moment!"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreClasses.map((course: any) => (
              <CourseCard
                key={course.class_id}
                id={course.class_id}
                title={course.title}
                category={course.category?.categories || 'General'}
                level={course.level?.level_info || 'All Levels'}
                progress={0}
                mentorName={course.mentor?.name || 'Experienced Mentor'}
                actionText="Enroll Now"
                onActionClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Do you want to enroll in "${course.title}"?`)) {
                    enrollMutation.mutate(course.class_id);
                  }
                }}
                onClick={() => navigate(`/student/courses/${course.class_id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
