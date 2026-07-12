import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft,
  Video,
  FileText,
  CheckCircle,
  Award,
  Star,
  Send,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { enrollmentApi } from '../../../api/enrollment';
import { reviewApi } from '../../../api/review';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';

export default function CourseLearningDetailPage() {
  const { id } = useParams();
  const classId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  const [activeMaterialId, setActiveMaterialId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // 1. Fetch Class detail
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ['classDetail', classId],
    queryFn: () => classApi.getById(classId),
    enabled: !isNaN(classId),
  });

  // 2. Fetch all enrollments to find the student's progress
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollmentsList'],
    queryFn: enrollmentApi.getAll,
  });

  // 3. Mutation to update enrollment progress
  const updateProgressMutation = useMutation({
    mutationFn: ({ enrollmentId, progress }: { enrollmentId: number; progress: number }) =>
      enrollmentApi.update(enrollmentId, { progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollmentsList'] });
      queryClient.invalidateQueries({ queryKey: ['classDetail', classId] });
      alert('Progress updated successfully!');
    },
  });

  // 4. Mutation to submit class review
  const submitReviewMutation = useMutation({
    mutationFn: (payload: { user_id: number; class_id: number; rating: number; comment: string }) =>
      reviewApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classDetail', classId] });
      setReviewComment('');
      alert('Review submitted successfully!');
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to submit review.');
    },
  });

  if (classLoading || enrollmentsLoading) {
    return <LoadingState text="Loading course classroom..." />;
  }

  if (!classData) {
    return (
      <EmptyState title="Course Not Found" description="The course you are looking for does not exist or has been removed." />
    );
  }

  // Find user's enrollment for this class
  const userEnrollment = enrollments.find(
    (e: any) => Number(e.user_id) === Number(userId) && Number(e.class_id) === classId
  );

  const materials = classData.materis || [];
  const exams = classData.exams || [];
  const reviews = classData.reviews || [];

  // Determine active material
  const activeMaterial = materials.find((m: any) => m.materi_id === activeMaterialId) || materials[0];

  // Check if student is enrolled
  const isEnrolled = !!userEnrollment;

  // Complete lesson & progress logic
  const handleMarkAsComplete = () => {
    if (!userEnrollment) return;

    const totalItems = materials.length;
    if (totalItems === 0) return;

    const currentProgress = userEnrollment.progress;
    // Calculate new progress step
    const singleStep = Math.ceil(100 / totalItems);
    const newProgress = Math.min(100, currentProgress + singleStep);

    updateProgressMutation.mutate({
      enrollmentId: userEnrollment.enrollment_id,
      progress: newProgress,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    submitReviewMutation.mutate({
      user_id: Number(userId),
      class_id: classId,
      rating,
      comment: reviewComment,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
        
        {/* Left Sidebar - Materials & Activities */}
        <div className="w-full lg:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <button
              onClick={() => navigate('/student/courses')}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              <ChevronLeft className="h-4.5 w-4.5 text-slate-600" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {classData.title}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isEnrolled ? `${userEnrollment.progress}% Completed` : 'Not enrolled'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Materials List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Lessons</h3>
              {materials.length === 0 ? (
                <p className="text-xs text-slate-500 italic px-2">No lessons added yet.</p>
              ) : (
                <div className="space-y-1">
                  {materials.map((materi: any) => {
                    const isSelected = activeMaterial?.materi_id === materi.materi_id;
                    return (
                      <button
                        key={materi.materi_id}
                        onClick={() => setActiveMaterialId(materi.materi_id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Video className={`h-4.5 w-4.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="text-xs truncate">{materi.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Exams List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Exams & Quizzes</h3>
              {exams.length === 0 ? (
                <p className="text-xs text-slate-500 italic px-2">No exams assigned yet.</p>
              ) : (
                <div className="space-y-1">
                  {exams.map((exam: any) => (
                    <button
                      key={exam.exam_id}
                      onClick={() => navigate('/student/exams')}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-left text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Award className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                        <span className="text-xs truncate font-semibold">{exam.title}</span>
                      </div>
                      {exam.is_passed && (
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Pane - Lesson content & Video */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {activeMaterial ? (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Video Player Display */}
              {activeMaterial.video_url && (
                <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video shadow-md relative group">
                  <iframe
                    className="w-full h-full"
                    src={activeMaterial.video_url.replace('watch?v=', 'embed/')}
                    title={activeMaterial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Lesson Description */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900">{activeMaterial.title}</h1>
                    <p className="text-xs text-slate-500 mt-1">Course: {classData.title}</p>
                  </div>
                  <Badge variant="info">Video & Reading</Badge>
                </div>
                
                <div className="prose max-w-none text-sm text-slate-600 leading-relaxed pt-2">
                  <p className="whitespace-pre-line">{activeMaterial.content || 'No reading content provided for this lesson.'}</p>
                </div>

                {isEnrolled && (
                  <div className="flex items-center justify-end border-t border-slate-100 pt-4 mt-6">
                    <Button
                      onClick={handleMarkAsComplete}
                      isLoading={updateProgressMutation.isPending}
                      className="text-xs font-bold"
                    >
                      Complete Lesson & Next
                    </Button>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900">Student Reviews & Ratings</h3>
                
                {isEnrolled && (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700">Write a Review</h4>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-amber-400 focus:outline-none"
                        >
                          <Star className={`h-5 w-5 ${star <= rating ? 'fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this class..."
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        size="sm"
                        isLoading={submitReviewMutation.isPending}
                        className="text-xs font-bold flex items-center gap-1.5"
                      >
                        <Send className="h-3 w-3" />
                        Submit Review
                      </Button>
                    </div>
                  </form>
                )}

                <div className="divide-y divide-slate-100">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((rev: any) => (
                      <div key={rev.review_id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800">{rev.user?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title="No Materials Available"
              description="There are currently no lesson materials uploaded for this class."
            />
          )}
      </div>
    </div>
  );
}
