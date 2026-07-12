import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { PATHS } from '../../../routes/paths';
import { kelasApi } from '../../../api/class';
import { ArrowLeft, Save, Loader2, Video, FileText } from 'lucide-react';

interface MateriFormValues {
    title: string;
    content: string;
    video_url: string;
}

export default function MateriEditPage() {
    const { classId, materiId } = useParams<{ classId: string; materiId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<MateriFormValues>();

    // 1. Ambil data detail kelas untuk mencari objek materi yang mau diedit
    const { data: classData, isLoading: isLoadingClass } = useQuery({
        queryKey: ['classDetail', classId],
        queryFn: () => kelasApi.getById(Number(classId)),
        enabled: !!classId,
    });

    // Cari materi spesifik di dalam array "materis"
    const currentMateri = classData?.materis?.find((m: any) => m.materi_id === Number(materiId));

    // 2. Set default value ke form setelah data materi ditemukan
    useEffect(() => {
        if (currentMateri) {
            setValue('title', currentMateri.title);
            setValue('content', currentMateri.content || '');
            setValue('video_url', currentMateri.video_url || '');
        }
    }, [currentMateri, setValue]);

    // 3. Setup Mutation untuk Update Data
    // Catatan: Karena endpoint parsial materi belum ada di backend, kita menggunakan kelasApi.update
    const updateMutation = useMutation({
        mutationFn: (updatedForm: MateriFormValues) => {
            // 🚀 Solusi: Berikan fallback || [] agar TypeScript tahu ini pasti sebuah Array
            const oldMateris = Array.isArray(classData?.materis) ? classData.materis : [];

            const updatedMateris = oldMateris.map((m: any) =>
                m.materi_id === Number(materiId) ? { ...m, ...updatedForm } : m
            );

            // Kirim seluruh payload kelas kembali ke backend
            return kelasApi.update(Number(classId), {
                ...classData,
                materis: updatedMateris
            });
        },
        onSuccess: () => {
            // Reset cache query agar data di halaman list otomatis ter-update terbaru
            queryClient.invalidateQueries({ queryKey: ['classDetail', classId] }); // 👈 Pastikan key ini menggunakan classId dari useParams
            alert('Material updated successfully!');
            navigate(PATHS.MENTOR_MATERIAL_LIST);
        },
        onError: (error) => {
            console.error(error);
            alert('Failed to update material. Please try again.');
        }
    });

    const onSubmit = (data: MateriFormValues) => {
        updateMutation.mutate(data);
    };

    if (isLoadingClass) {
        return (
            <div className="text-slate-400 text-sm text-center py-12 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                Loading material data...
            </div>
        );
    }

    if (!currentMateri) {
        return (
            <div className="text-rose-400 text-sm text-center py-12">
                Material not found or has been removed.
            </div>
        );
    }

    return (
        <div className="w-full p-6 md:p-10 max-w-3xl mx-auto space-y-8 text-slate-100">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-900 pb-6">
                <button
                    type="button"
                    onClick={() => navigate(PATHS.MENTOR_MATERIAL_LIST)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer self-start"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Materials
                </button>
                <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Editor Mode</span>
                    <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Edit Learning Material</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Course: <span className="text-slate-300 font-medium">{classData?.title}</span>
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-indigo-400" /> Material Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Introduction to JSON Data Types"
                        {...register('title', { required: 'Title is required' })}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text Content / Description</label>
                    <textarea
                        rows={8}
                        placeholder="Write down details explanation, instructions, or reading materials here..."
                        {...register('content', { required: 'Content description is required' })}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                    {errors.content && <p className="text-rose-400 text-xs mt-1">{errors.content.message}</p>}
                </div>

                {/* Video URL */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-rose-400" /> Video Link (Optional)
                    </label>
                    <input
                        type="url"
                        placeholder="e.g., https://youtube.com/watch?v=..."
                        {...register('video_url')}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-900 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.MENTOR_MATERIAL_LIST)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-semibold rounded-xl border border-slate-800 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}