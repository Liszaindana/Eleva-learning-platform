import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { PATHS } from '../../../routes/paths';
import { kelasApi } from '../../../api/class';
import { ArrowLeft, PlusCircle, Loader2, Video, FileText } from 'lucide-react';
import { materiApi } from '../../../api/endpoints';

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
            return materiApi.create({
                class_id: Number(classId),
                title: newMateriForm.title,
                content: newMateriForm.content,
                video_url: newMateriForm.video_url || null, // Ubah string kosong jadi null
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
                <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                Loading class configuration...
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-8 p-6 md:p-10">

            {/* Header */}
            <div className="border-b border-slate-200 pb-6">
                <button
                    type="button"
                    onClick={() => navigate(PATHS.MENTOR_MATERIAL_LIST)}
                    className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Materials
                </button>

                <h1 className="text-3xl font-bold text-slate-900">
                    Add New Material
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Add learning material to
                    <span className="ml-1 font-semibold text-blue-700">
                        {classData?.title}
                    </span>
                </p>
            </div>

            {/* Form Card */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
            >

                {/* Title */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Material Title
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Chapter 1: Introduction"
                        {...register('title', {
                            required: 'Material title is required',
                        })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />

                    {errors.title && (
                        <p className="text-sm text-red-500">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Study Material
                    </label>

                    <textarea
                        rows={8}
                        placeholder="Write the learning material here..."
                        {...register('content', {
                            required: 'Content is required',
                        })}
                        className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />

                    {errors.content && (
                        <p className="text-sm text-red-500">
                            {errors.content.message}
                        </p>
                    )}
                </div>

                {/* Video */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Video className="h-4 w-4 text-red-500" />
                        Video URL (Optional)
                    </label>

                    <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        {...register('video_url')}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">

                    <button
                        type="button"
                        onClick={() => navigate(PATHS.MENTOR_MATERIAL_LIST)}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
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