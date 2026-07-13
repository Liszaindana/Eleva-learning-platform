import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { kelasApi } from '../../../api/class';
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
        <div className="mx-auto w-full max-w-5xl space-y-8 p-6 md:p-10">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Course Materials
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Select one of your classes to manage learning materials.
                    </p>
                </div>

                {selectedClassId && (
                    <button
                        onClick={() =>
                            navigate(mentorMaterialCreatePath(selectedClassId))
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Material
                    </button>
                )}
            </div>

            {/* Class Selector */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    Choose Class
                </label>

                {isLoadingClasses ? (
                    <p className="text-sm text-slate-500">
                        Loading your classes...
                    </p>
                ) : mentorClasses.length === 0 ? (
                    <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                        You don't have any classes yet. Create a class first.
                    </div>
                ) : (
                    <select
                        value={selectedClassId || ""}
                        onChange={(e) =>
                            setSelectedClassId(Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                        {!selectedClassId && (
                            <option value="">Select a Class</option>
                        )}

                        {mentorClasses.map((cls: any) => (
                            <option
                                key={cls.class_id}
                                value={cls.class_id}
                            >
                                {cls.title}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Material List */}
            {isLoadingMateri ? (
                <div className="flex justify-center py-20">
                    <p className="text-slate-500">
                        Loading course materials...
                    </p>
                </div>
            ) : !selectedClassId || materiList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                    <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-400" />

                    <p className="font-medium text-slate-600">
                        No learning materials added yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {materiList.map((materi: any, index: number) => (
                        <div
                            key={materi.materi_id}
                            className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl sm:flex-row sm:items-center"
                        >
                            <div className="flex items-start gap-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                <div>

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {materi.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                        {materi.content}
                                    </p>

                                    {materi.video_url && (
                                        <div className="mt-3 flex w-max items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                            <Video className="h-3.5 w-3.5" />
                                            Video Attached
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() =>
                                        selectedClassId &&
                                        navigate(
                                            mentorMaterialEditPath(
                                                selectedClassId,
                                                materi.materi_id
                                            )
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(materi.materi_id)
                                    }
                                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                >
                                    <Trash2 className="h-4 w-4" />
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