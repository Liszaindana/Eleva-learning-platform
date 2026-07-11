import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { reviewApi } from '../../../api/endpoints';

export default function ReviewListPage() {
  // 1. Ambil data review asli dari database lewat backend
  const { data: review = [], isLoading, isError } = useQuery({
    queryKey: ['adminReviewsList'],
    queryFn: reviewApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Memuat data review...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500 font-medium">Gagal mengambil data review dari database.</p>
      </div>
    );
  }

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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {review.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm">
                      Belum ada data review di database.
                    </td>
                  </tr>
                ) : (
                  review.map((review: any) => {
                    // Cari properti ID uniknya (bisa review_id atau id tergantung DB kalian)
                    const currentId = review.review_id || review.id;

                    return (
                      <tr key={currentId} className="hover:bg-slate-50">
                        {/* 1. Nama User */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-slate-900">
                            {review.user?.name || review.user_name || 'Anonymous'}
                          </div>
                        </td>

                        {/* 2. Nama Kelas/Course */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">
                            {review.class?.title || 'Unknown Course'}
                          </div>
                        </td>

                        {/* 3. Rating Bintang */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Number(review.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                  }`}
                              />
                            ))}
                          </div>
                        </td>

                        {/* 4. Komentar */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600 max-w-xs truncate" title={review.comment}>
                            {review.comment || '-'}
                          </div>
                        </td>

                        {/* 5. Status Review */}
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              review.status?.toLowerCase() === 'approved' || review.status === '1'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {review.status || 'Approved'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}