import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { reviewApi } from '../../api/endpoints';
import { Star, MessageSquare, Users, Award, Loader2 } from 'lucide-react';

// Interface data asli dari API
interface ReviewItem {
    review_id: number;
    user_id: number;
    class_id: number;
    rating: number;
    comment: string;
    user?: {
        name: string;
        email: string;
    };
    class?: {
        user_id: number; // ID Mentor pemilik kelas
        title: string;
    };
}

export default function ReviewListPage() {
    const { user } = useAuthStore();

    const { data: allReviews, isLoading: isLoadingReviews } = useQuery({
        queryKey: ['allReviews'],
        queryFn: reviewApi.getAll,
    });

    // Menggunakan useMemo agar proses filter & kalkulasi statistik hanya berjalan saat data berubah
    const { mentorReviews, totalReviews, averageRating, ratingDistribution } = useMemo(() => {
        let rawReviewsArray: ReviewItem[] = [];

        // 1. Parsing data dari API (mengantisipasi variasi bentuk response wrapper)
        if (Array.isArray(allReviews)) {
            rawReviewsArray = allReviews;
        } else if (allReviews && typeof allReviews === 'object') {
            if (Array.isArray((allReviews as any).data)) {
                rawReviewsArray = (allReviews as any).data;
            } else if (Array.isArray((allReviews as any).reviews)) {
                rawReviewsArray = (allReviews as any).reviews;
            }
        }

        // 2. Filter utama berdasarkan ID mentor yang sedang login
        const loggedInMentorId = user?.user_id;
        const filtered = rawReviewsArray.filter((rev) => {
            const classOwnerId = rev.class?.user_id;
            if (!classOwnerId || !loggedInMentorId) return false;
            return Number(classOwnerId) === Number(loggedInMentorId);
        });

        // 3. Hitung Statistik Berdasarkan Hasil Filter
        const total = filtered.length;
        const avg = total > 0
            ? (filtered.reduce((sum, rev) => sum + rev.rating, 0) / total).toFixed(1)
            : '0.0';

        // 4. Hitung Distribusi Rating (5 s.d 1)
        const distribution = [5, 4, 3, 2, 1].map(stars => {
            const count = filtered.filter(r => Math.round(r.rating) === stars).length;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return { stars, count, percentage };
        });

        return {
            mentorReviews: filtered,
            totalReviews: total,
            averageRating: avg,
            ratingDistribution: distribution
        };
    }, [allReviews, user?.user_id]);

    if (isLoadingReviews) {
        return (
            <div className="w-full text-slate-400 text-sm text-center py-24 flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                Aggregating student feedback...
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8 p-6 md:p-10">

            {/* Header */}
            <div className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-bold text-slate-900">
                    Student Reviews
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Monitor course ratings and feedback from your students.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Average Rating */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Average Rating
                    </span>

                    <div className="mt-3 flex items-end gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                            {averageRating}
                        </span>

                        <span className="text-slate-500">
                            / 5.0
                        </span>
                    </div>

                    <div className="mt-4 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.round(Number(averageRating))
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                    }`}
                            />
                        ))}
                    </div>

                    <Award className="absolute right-5 top-5 h-10 w-10 text-indigo-100" />

                </div>

                {/* Total Review */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Reviews
                    </span>

                    <h2 className="mt-3 text-4xl font-bold text-slate-900">
                        {totalReviews}
                    </h2>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-indigo-600" />
                        Active student feedback
                    </div>

                    <MessageSquare className="absolute right-5 top-5 h-10 w-10 text-indigo-100" />

                </div>

                {/* Rating Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-700">
                        Rating Breakdown
                    </h3>

                    <div className="space-y-3">

                        {ratingDistribution.map((dist) => (

                            <div
                                key={dist.stars}
                                className="flex items-center gap-3"
                            >

                                <span className="w-3 text-sm font-semibold text-slate-700">
                                    {dist.stars}
                                </span>

                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">

                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                                        style={{
                                            width: `${dist.percentage}%`,
                                        }}
                                    />

                                </div>

                                <span className="w-8 text-right text-sm text-slate-500">
                                    {dist.count}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            {/* Review List */}
            <div className="space-y-5">

                <h2 className="text-lg font-semibold text-slate-900">
                    Student Feedback
                </h2>

                {mentorReviews.length === 0 ? (

                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20">

                        <MessageSquare className="mb-3 h-10 w-10 text-slate-400" />

                        <p className="text-slate-600">
                            No reviews yet.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {mentorReviews.map((review) => (

                            <div
                                key={review.review_id}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg"
                            >

                                <div className="flex flex-wrap items-start justify-between gap-3">

                                    <div>

                                        <h3 className="font-semibold text-slate-900">
                                            {review.user?.name || `Student #${review.user_id}`}
                                        </h3>

                                        <p className="mt-1 text-sm text-indigo-600">
                                            {review.class?.title || "Unknown Course"}
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5">

                                        {[...Array(5)].map((_, i) => (

                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-slate-300"
                                                    }`}
                                            />

                                        ))}

                                        <span className="ml-2 text-sm font-semibold text-slate-700">
                                            {review.rating}.0
                                        </span>

                                    </div>

                                </div>

                                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                                    <p className="leading-relaxed text-slate-700">
                                        "{review.comment}"
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}