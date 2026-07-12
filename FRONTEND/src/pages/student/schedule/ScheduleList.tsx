import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Video, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';

export default function SchedulePage() {
  const { user } = useAuthStore();
  const userId = user?.user_id;

  // Fetch all classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classesListAll'],
    queryFn: classApi.getAll,
  });

  if (classesLoading) {
    return <LoadingState text="Loading your class schedule..." />;
  }

  // Filter classes student is enrolled in
  const myClasses = classes.filter((c: any) =>
    c.enrollment?.some((e: any) => Number(e.user_id) === Number(userId))
  );

  // Map enrolled classes to mock weekly schedule slots
  // Just to make it dynamic and realistic
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const mockScheduleSlots = myClasses.map((cls: any, index: number) => {
    const dayIndex = index % daysOfWeek.length;
    const day = daysOfWeek[dayIndex];
    const timeSlots = [
      { start: '09:00 AM', end: '11:00 AM' },
      { start: '01:00 PM', end: '03:00 PM' },
      { start: '04:00 PM', end: '06:00 PM' },
    ];
    const slot = timeSlots[index % timeSlots.length];
    
    return {
      id: cls.class_id,
      title: cls.title,
      category: cls.category?.categories || 'General',
      day,
      start: slot.start,
      end: slot.end,
      mentorName: cls.mentor?.name || 'Experienced Mentor',
      type: index % 2 === 0 ? 'Live Video Class' : 'Self-Paced Mentoring',
    };
  });

  // Group by day of week
  const scheduleByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = mockScheduleSlots.filter((slot) => slot.day === day);
    return acc;
  }, {} as Record<string, typeof mockScheduleSlots>);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">Keep track of your upcoming lectures and mentoring hours</p>
        </div>

        {myClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <EmptyState
              icon={<Calendar className="h-8 w-8" />}
              title="No Scheduled Sessions"
              description="Enroll in courses to generate your weekly interactive mentoring schedule."
            />
          </div>
        ) : (
          <div className="space-y-6">
            {daysOfWeek.map((day) => {
              const sessions = scheduleByDay[day] || [];
              return (
                <div key={day} className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">{day}</h3>
                  {sessions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic px-2">No lectures scheduled for this day.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 text-sm">{session.title}</h4>
                              <p className="text-xs text-slate-500 font-semibold">Mentor: {session.mentorName}</p>
                            </div>
                            <Badge variant={session.type === 'Live Video Class' ? 'info' : 'warning'} className="text-[9px] px-2.5 py-0.5 font-bold uppercase">
                              {session.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock className="h-4 w-4 text-slate-400" />
                              {session.start} - {session.end}
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                              {session.type === 'Live Video Class' ? (
                                <>
                                  <Video className="h-4 w-4 text-slate-400" />
                                  <span className="text-blue-600 hover:underline cursor-pointer">Join Video Meet</span>
                                </>
                              ) : (
                                <>
                                  <BookOpen className="h-4 w-4 text-slate-400" />
                                  <span>Self Study Portal</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
