import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PATHS, mentorClassEditPath } from '../../../routes/paths';
import { useAuthStore } from '../../../store/authStore';
import { kelasApi } from '../../../api/class';
import { Plus, BookOpen, Users, Star, Edit, Loader2 } from 'lucide-react';

export default function ClassListPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // 1. Ambil data kelas berdasarkan user ID
    const { data: allClasses, isLoading } = useQuery({
        queryKey: ['allClasses'],
        queryFn: kelasApi.getAll,
    });

    // 🛠️ FIX BUG: Ekstrak properti .data jika respon backend dibungkus objek Axios/Custom
    const rawClasses = Array.isArray(allClasses)
        ? allClasses
        : (allClasses as any)?.data || [];

    // 2. Filter kelas milik mentor yang sedang login
    const classList = Array.isArray(rawClasses)
        ? rawClasses.filter((cls: any) => cls.user_id === user?.user_id)
        : [];

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-10">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Class List
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Manage your created classes and monitor student progress.
                    </p>
                </div>

                <button
                    onClick={() => navigate(PATHS.MENTOR_CLASS_CREATE)}
                    className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" />
                    Create New Class
                </button>
            </div>

            {isLoading ? (
                <div className="flex h-[40vh] flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
                    <p className="text-sm text-slate-600">
                        Loading classes...
                    </p>
                </div>
            ) : classList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                    <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-400" />
                    <p className="font-medium text-slate-600">
                        You haven't created any classes yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {classList.map((cls: any) => {
                        const totalStudents = Array.isArray(cls.enrollment)
                            ? cls.enrollment.length
                            : 0;

                        let averageRating = "0.0";

                        if (Array.isArray(cls.reviews) && cls.reviews.length > 0) {
                            const totalRating = cls.reviews.reduce(
                                (sum: number, rev: any) => sum + (rev.rating || 0),
                                0
                            );

                            averageRating = (
                                totalRating / cls.reviews.length
                            ).toFixed(1);
                        }

                        return (
                            <div
                                key={cls.class_id}
                                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                            >
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-100 p-2">
                                            <BookOpen className="h-5 w-5 text-blue-700" />
                                        </div>

                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {cls.category?.categories ||
                                                cls.category?.category_name ||
                                                "Active Course"}
                                        </span>
                                    </div>

                                    <h3 className="line-clamp-2 text-xl font-bold text-slate-900">
                                        {cls.title}
                                    </h3>

                                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                                        {cls.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">

                                    <div className="flex items-center gap-5">

                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Users className="h-4 w-4 text-blue-700" />
                                            <span>
                                                <strong className="text-slate-900">
                                                    {totalStudents}
                                                </strong>{" "}
                                                Students
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                            {averageRating}
                                        </div>

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                mentorClassEditPath(cls.class_id)
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}