import { Star } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

const reviews = [
  { id: 1, user: 'Sarah Johnson', course: 'Advanced UI Design Systems', rating: 5, comment: 'Excellent course!', date: '2024-01-15', status: 'Approved' },
  { id: 2, user: 'John Doe', course: 'Product Management 101', rating: 4, comment: 'Great content.', date: '2024-01-12', status: 'Approved' },
];

export default function ReviewListPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reviews</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Manage course reviews
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{review.user}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{review.course}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                        />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{review.comment}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{review.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{review.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
