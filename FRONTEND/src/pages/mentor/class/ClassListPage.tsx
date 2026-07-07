import { useNavigate } from 'react-router-dom';
import { PATHS, mentorClassEditPath } from '../../../routes/paths';
import { useAuthStore } from '../../../store/authStore';
import { Plus, BookOpen, Users, Star, Edit } from 'lucide-react';

export default function ClassListPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Mock data singkat untuk ngetes kelancaran render komponen & fungsi navigasi
    const mockClasses = [
        {
            id: 1,
            title: 'Advanced UI Design Systems',
            students: 342,
            rating: 4.9,
        },
        {
            id: 2,
            title: 'Product Management 101',
            students: 215,
            rating: 4.8,
        },
    ];

    // ✨ WAJIB ditambahkan kata kunci 'return'
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

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 group"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-semibold text-slate-500">Active Course</span>
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {cls.title}
                            </h3>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-indigo-400" />
                                    <strong>{cls.students}</strong> Students
                                </span>
                                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                    <Star className="h-4 w-4 fill-amber-400" />
                                    {cls.rating}
                                </span>
                            </div>

                            <button
                                onClick={() => navigate(mentorClassEditPath(cls.id))}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
                            >
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}