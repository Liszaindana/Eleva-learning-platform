import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { PATHS } from '../../../routes/paths';
import { kelasApi } from '../../../api/class';
import { ArrowLeft, PlusCircle, Loader2, Video, FileText } from 'lucide-react';

interface MaterialCreateFormValues {
    title: string;
    content: string;
    video_url: string;
}

export default function MateriCreatePage() {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm<MaterialCreateFormValues>();

    // 1. Ambil data kelas saat ini untuk mendapatkan list materi yang sudah ada
    const { data: classData, isLoading: isLoadingClass } = useQuery({
        queryKey: ['classDetail', classId],
        queryFn: () => kelasApi.getById(Number(classId)),
        enabled: !!classId,
    });

    // 2. Setup Mutation untuk menambahkan materi baru ke dalam kelas
    const createMutation = useMutation({
        mutationFn: (newMateriForm: MaterialCreateFormValues) => {
            const oldMateris = Array.isArray(classData?.materis) ? classData.materis : [];

            // Membuat ID tiruan berbasis timestamp agar unik di front-end sementara waktu
            const mockMateriId = Math.floor(Date.now() + Math.random());

            const newMateriPayload = {
                materi_id: mockMateriId,
                class_id: Number(classId),
                ...newMateriForm
            };

            // Gabungkan materi lama dengan materi yang baru dibuat
            const updatedMateris = [...oldMateris, newMateriPayload];

            // Kirim seluruh payload kelas yang diperbarui ke backend
            return kelasApi.update(Number(classId), {
                ...classData,
                materis: updatedMateris
            });
        },
        onSuccess: () => {
            // Segarkan cache data kelas agar halaman list materi menampilkan data terbaru
            queryClient.invalidateQueries({ queryKey: ['classDetail', classId] });
            alert('New learning material created successfully!');
            navigate(PATHS.MENTOR_MATERIAL_LIST);
        },
        onError: (error) => {
            console.error(error);
            alert('Failed to create material. Please try again.');
        }
    });

    const onSubmit = (data: MaterialCreateFormValues) => {
        createMutation.mutate(data);
    };

    if (isLoadingClass) {
        return (
            <div className="text-slate-400 text-sm text-center py-12 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                Loading class configuration...
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
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Creation Mode</span>
                    <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">Add New Material</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Adding module into course: <span className="text-slate-300 font-medium">{classData?.title}</span>
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
                        placeholder="e.g., Chapter 1: Advanced Middleware Implementation"
                        {...register('title', { required: 'Material title is required' })}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Text Content / Study Materials</label>
                    <textarea
                        rows={8}
                        placeholder="Provide detailed description, reading guidelines, or code snippets for this material..."
                        {...register('content', { required: 'Content study material is required' })}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                    {errors.content && <p className="text-rose-400 text-xs mt-1">{errors.content.message}</p>}
                </div>

                {/* Video URL */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Video className="h-3.5 w-3.5 text-rose-400" /> Video URL Attachment (Optional)
                    </label>
                    <input
                        type="url"
                        placeholder="e.g., https://youtube.com/watch?v=..."
                        {...register('video_url')}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Action Buttons */}
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
                        disabled={createMutation.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deploying...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="h-4 w-4" />
                                Add Material
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}