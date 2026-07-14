import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { PATHS } from '../../../routes/paths';
import { kelasApi } from '../../../api/class';
import { ArrowLeft, Save, Loader2, Video, FileText } from 'lucide-react';
import { materiApi } from '../../../api/endpoints';

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

    const { data: classData, isLoading: isLoadingClass } = useQuery({
        queryKey: ['classDetail', classId],
        queryFn: () => kelasApi.getById(Number(classId)),
        enabled: !!classId,
    });

    const currentMateri = classData?.materis?.find((m: any) => m.materi_id === Number(materiId));

    useEffect(() => {
        if (currentMateri) {
            setValue('title', currentMateri.title);
            setValue('content', currentMateri.content || '');
            setValue('video_url', currentMateri.video_url || '');
        }
    }, [currentMateri, setValue]);

    const updateMutation = useMutation({
        mutationFn: (updatedForm: MateriFormValues) => {
            return materiApi.update(Number(materiId), {
                title: updatedForm.title,
                content: updatedForm.content,
                video_url: updatedForm.video_url || null, 
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classDetail', classId] }); 
            
            alert('Material updated successfully!');
            navigate(PATHS.MENTOR_MATERIAL_LIST);
        },
        onError: (error) => {
            console.error("Error updating material:", error);
            alert('Failed to update material. Please try again.');
        }
    });

    const onSubmit = (data: MateriFormValues) => {
        updateMutation.mutate(data);
    };

    if (isLoadingClass) {
        return (
            <div className="text-slate-400 text-sm text-center py-12 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
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
                    Edit Learning Material
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Editing material from
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

                {/* Material Title */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Material Title
                    </label>

                    <input
                        type="text"
                        placeholder="e.g. Introduction to JSON Data Types"
                        {...register('title', {
                            required: 'Title is required',
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
                        Material Content
                    </label>

                    <textarea
                        rows={8}
                        placeholder="Write learning material here..."
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

                {/* Video URL */}
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
                        disabled={updateMutation.isPending}
                        className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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