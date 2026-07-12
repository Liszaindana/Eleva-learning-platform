import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Star, Send } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { classApi } from '../../../api/class';
import { reviewApi } from '../../../api/review';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';

export default function ClassReviewPage() {
  const { id } = useParams();
  const classId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.user_id;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Fetch course name
  const { data: courseData, isLoading } = useQuery({
    queryKey: ['classDetail', classId],
    queryFn: () => classApi.getById(classId),
    enabled: !isNaN(classId),
  });

  // Mutation to submit review
  const submitReviewMutation = useMutation({
    mutationFn: (payload: { user_id: number; class_id: number; rating: number; comment: string }) =>
      reviewApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classDetail', classId] });
      alert('Your review has been submitted successfully.');
      navigate(`/student/courses/${classId}`);
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to submit review.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(classId) || !userId) {
      alert('Invalid course or user session. Please try again.');
      return;
    }
    if (rating === 0) {
      alert('Please select a rating of at least 1 star.');
      return;
    }

    submitReviewMutation.mutate({
      user_id: Number(userId),
      class_id: classId,
      rating,
      comment,
    });
  };

  if (isLoading) {
    return <LoadingState text="Loading course details..." />;
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white border border-slate-200 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Write a Review</h1>
            <p className="text-slate-500 text-sm font-semibold">
              {courseData?.title || 'Course Review'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Your Rating</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-all ${
                      star <= rating ? 'fill-amber-400 text-amber-400 scale-105' : 'text-slate-300 hover:text-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Your Review</h3>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course..."
              className="w-full min-h-[200px] p-4 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitReviewMutation.isPending} className="flex items-center gap-2 font-bold">
              <Send className="h-4 w-4" />
              Submit Review
            </Button>
          </div>
        </form>
    </div>
  );
}
