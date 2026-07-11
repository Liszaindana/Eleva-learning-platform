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
        <div className="w-full p-6 md:p-10 max-w-5xl mx-auto space-y-8 text-slate-100">
            {/* Header */}
            <div className="border-b border-slate-900 pb-6">
                <h1 className="text-2xl font-black text-white tracking-tight">Student Reviews</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Monitor performance metrics, course ratings, and detailed textual feedback from your students.
                </p>
            </div>

            {/* Ringkasan Dashboard Rating */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rata-rata Rating */}
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white tracking-tight">{averageRating}</span>
                            <span className="text-sm text-slate-500">/ 5.0</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`h-5 w-5 ${i < Math.round(Number(averageRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                            />
                        ))}
                    </div>
                    <Award className="absolute right-4 top-4 h-12 w-12 text-slate-800/40 group-hover:text-indigo-500/10 transition-colors" />
                </div>

                {/* Total Ulasan */}
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Feedback</span>
                        <h2 className="text-4xl font-black text-white tracking-tight">{totalReviews}</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-indigo-400" /> Active student responses
                    </p>
                    <MessageSquare className="absolute right-4 top-4 h-12 w-12 text-slate-800/40 group-hover:text-indigo-500/10 transition-colors" />
                </div>

                {/* Progress Bar Sebaran Bintang */}
                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rating Breakdown</span>
                    <div className="space-y-1.5 pt-1">
                        {ratingDistribution.map((dist) => (
                            <div key={dist.stars} className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="w-3 font-semibold text-slate-300 text-right">{dist.stars}</span>
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" 
                                        style={{ width: `${dist.percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-slate-500 text-right font-medium">{dist.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Review Masuk */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Detailed Feedbacks</h3>
                
                {mentorReviews.length === 0 ? (
                    <div className="text-slate-500 text-sm text-center py-20 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-900/10">
                        <MessageSquare className="h-8 w-8 text-slate-600" />
                        <p>No student reviews received yet for your courses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {mentorReviews.map((review) => (
                            <div 
                                key={review.review_id} 
                                className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-700/60 transition-colors"
                            >
                                {/* Atas: Info Siswa & Bintang */}
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">
                                            {review.user?.name || `Student #${review.user_id}`}
                                        </h4>
                                        <p className="text-[11px] text-indigo-400 font-semibold mt-0.5">
                                            Course: <span className="text-slate-300 font-medium">{review.class?.title || 'Unknown Course'}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-0.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-3 w-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'}`} 
                                            />
                                        ))}
                                        <span className="text-xs font-bold text-white ml-1.5">{review.rating}.0</span>
                                    </div>
                                </div>

                                {/* Tengah: Isi Komentar */}
                                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 border border-slate-900 rounded-xl">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}