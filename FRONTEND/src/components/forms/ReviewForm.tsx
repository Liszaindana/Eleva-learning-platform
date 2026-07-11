import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Send } from 'lucide-react';
import Button from '../ui/Button';
import { reviewApi } from '../../api/endpoints';

interface ReviewFormProps {
  classId: number;
}

export default function ReviewForm({ classId }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
      setRating(0);
      setComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;
    mutation.mutate({ class_id: classId, rating, comment: comment.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Tulis Ulasan</h3>

      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  starValue <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-300'
                }`}
              />
            </button>
          );
        })}
        {rating > 0 && <span className="ml-2 text-sm text-slate-500">{rating}/5</span>}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bagaimana pengalaman belajarmu di kelas ini?"
        rows={3}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {mutation.isError && (
        <p className="mt-2 text-sm text-red-600">{(mutation.error as Error).message}</p>
      )}

      <div className="mt-3 flex justify-end">
        <Button
          type="submit"
          size="sm"
          isLoading={mutation.isPending}
          disabled={rating === 0 || !comment.trim()}
        >
          <Send className="h-3.5 w-3.5" />
          Kirim Ulasan
        </Button>
      </div>
    </form>
  );
}