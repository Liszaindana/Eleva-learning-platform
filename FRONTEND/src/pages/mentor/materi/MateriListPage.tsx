import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { kelasApi } from '../../../api/kelas';
import { mentorMaterialCreatePath, mentorMaterialEditPath } from '../../../routes/paths';
import { Plus, Video, Edit, Trash2, BookOpen, Layers } from 'lucide-react';

export default function MateriListPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    // 1. Ambil semua kelas untuk difilter berdasarkan Mentor ID yang login
    const { data: allClasses, isLoading: isLoadingClasses } = useQuery({
        queryKey: ['allClasses'],
        queryFn: kelasApi.getAll,
    });

    const mentorClasses = Array.isArray(allClasses)
        ? allClasses.filter((cls: any) => cls.user_id === user?.user_id)
        : [];

    // Auto-select kelas pertama jika mentor punya kelas dan belum ada yang dipilih
    useEffect(() => {
        if (mentorClasses.length > 0 && !selectedClassId) {
            setSelectedClassId(mentorClasses[0].class_id);
        }
    }, [mentorClasses, selectedClassId]);

    // 2. Ambil detail kelas yang sedang dipilih (Hanya jalan jika selectedClassId benar-benar valid angka)
    const { data: currentClassData, isLoading: isLoadingMateri } = useQuery({
        queryKey: ['classDetail', selectedClassId],
        queryFn: () => {
            if (!selectedClassId) return null; // 🚀 AMAN: Cegah request jika ID masih null
            return kelasApi.getById(selectedClassId);
        },
        enabled: typeof selectedClassId === 'number' && selectedClassId > 0, // 🚀 AMAN: Validasi tipe data ketat
    });

    const materiList = Array.isArray(currentClassData?.materis) ? currentClassData.materis : [];

    const handleDelete = (materiId: number) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            console.log('Delete material ID:', materiId);
        }
    };

    return (
        <div className="w-full p-6 md:p-10 max-w-5xl mx-auto space-y-8 text-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Course Materials Management</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Select a course below to manage its modules and attachments.
                    </p>
                </div>
                {/* 🚀 AMAN: Hanya render tombol jika selectedClassId bernilai truthy (bukan null) */}
                {selectedClassId && (
                    <button
                        onClick={() => navigate(mentorMaterialCreatePath(selectedClassId))}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Material
                    </button>
                )}
            </div>

            {/* Selector Kelas */}
            <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-400" /> Choose Class To Manage
                </label>
                {isLoadingClasses ? (
                    <div className="text-sm text-slate-500 animate-pulse">Loading your courses...</div>
                ) : mentorClasses.length === 0 ? (
                    <div className="text-sm text-amber-400">You don't have any classes created yet. Please create a class first.</div>
                ) : (
                    <select
                        value={selectedClassId || ''}
                        onChange={(e) => setSelectedClassId(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                        {/* 🚀 AMAN: Berikan option kosong sebagai inisiasi awal jika data belum sinkron */}
                        {!selectedClassId && <option value="">-- Select a Class --</option>}
                        {mentorClasses.map((cls: any) => (
                            <option key={cls.class_id} value={cls.class_id}>
                                {cls.title}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* List Materi */}
            {isLoadingMateri ? (
                <div className="text-slate-400 text-sm text-center py-12">Loading course materials...</div>
            ) : !selectedClassId || materiList.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-16 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-900/10">
                    <BookOpen className="h-8 w-8 text-slate-600" />
                    <p>No learning materials added to this class yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {materiList.map((materi: any, index: number) => (
                        <div
                            key={materi.materi_id}
                            className="p-5 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700/80 transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-sm font-black text-slate-600 bg-slate-950 border border-slate-800 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        {materi.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">
                                        {materi.content}
                                    </p>
                                    {materi.video_url && (
                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-400 bg-rose-500/5 border border-rose-500/10 px-2 py-0.5 rounded-md mt-2 w-max">
                                            <Video className="h-3 w-3" />
                                            <span>Video Attachment Linked</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center border-t border-slate-800/40 sm:border-none pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                                <button
                                    onClick={() => selectedClassId && navigate(mentorMaterialEditPath(selectedClassId, materi.materi_id))}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700/50 transition-colors cursor-pointer"
                                >
                                    <Edit className="h-3.5 w-3.5 text-indigo-400" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(materi.materi_id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-lg border border-slate-800 hover:border-rose-900/50 transition-colors cursor-pointer"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}