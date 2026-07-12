import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PATHS, mentorClassEditPath } from '../../../routes/paths';
import { useAuthStore } from '../../../store/authStore';
import { kelasApi } from '../../../api/class';
import { Plus, BookOpen, Users, Star, Edit } from 'lucide-react';

export default function ClassListPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // 1. Ambil data kelas berdasarkan user ID
    const { data: allClasses, isLoading } = useQuery({
        queryKey: ['allClasses'],
        queryFn: kelasApi.getAll,
    });

    // 2. Normalisasi data: bungkus jadi array jika backend mengembalikan satu objek tunggal
    const classList = Array.isArray(allClasses)
        ? allClasses.filter((cls: any) => cls.user_id === user?.user_id)
        : [];

    return (
        <div className="w-full p-6 md:p-10 max-w-7xl mx-auto space-y-8 text-slate-100">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">My Class List</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage your created classes and monitor student progress.
                    </p>
                </div>
                <button
                    onClick={() => navigate(PATHS.MENTOR_CLASS_CREATE)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                    <Plus className="h-4 w-4" />
                    Create New Class
                </button>
            </div>

            {/* Grid List & Status Loading / Empty */}
            {isLoading ? (
                <div className="text-slate-400 text-sm text-center py-12">Loading classes...</div>
            ) : classList.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                    You haven't created any classes yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classList.map((cls: any) => {
                        // Hitung jumlah siswa dari array enrollment
                        const totalStudents = Array.isArray(cls.enrollment) ? cls.enrollment.length : 0;

                        // Hitung rata-rata rating dari array reviews
                        let averageRating = "0.0";
                        if (Array.isArray(cls.reviews) && cls.reviews.length > 0) {
                            const totalRating = cls.reviews.reduce((sum: number, rev: any) => sum + (rev.rating || 0), 0);
                            averageRating = (totalRating / cls.reviews.length).toFixed(1);
                        }

                        return (
                            <div
                                key={cls.class_id}
                                className="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 group"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">
                                            {cls.category?.categories || 'Active Course'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                                        {cls.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                                        {cls.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-indigo-400" />
                                            <strong>{totalStudents}</strong> Students
                                        </span>
                                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                            <Star className="h-4 w-4 fill-amber-400" />
                                            {averageRating}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => navigate(mentorClassEditPath(cls.class_id))}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
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