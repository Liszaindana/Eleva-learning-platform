import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import {
    ArrowLeft,
    Save,
    FileText,
    LayoutGrid,
    DollarSign,
    Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kelasApi } from '../../../api/class';
import { categoryApi } from '../../../api/endpoints';

export default function ClassEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        category_id: '',
        price: '',
        description: '',
    });

    const { data: classResponse, isLoading: isLoadingClass } = useQuery({
        queryKey: ['classDetails', id],
        queryFn: () => kelasApi.getById(Number(id)),
        enabled: !!id,
    });

    const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: categoryApi.getAll,
    });

    useEffect(() => {
        const classData = (classResponse as any)?.data || classResponse;

        if (classData) {
            setFormData({
                title: classData.title || '',
                category_id:
                    classData.category_id?.toString() ||
                    classData.id_category?.toString() ||
                    classData.category?.toString() ||
                    '',
                price: classData.price?.toString() || '0',
                description: classData.description || '',
            });
        }
    }, [classResponse]);

    const updateClassMutation = useMutation({
        mutationFn: (updatedData: any) =>
            kelasApi.update(Number(id), updatedData),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allenrollment'] });
            queryClient.invalidateQueries({ queryKey: ['classDetails', id] });

            alert('Perubahan data kelas berhasil disimpan!');
            navigate(PATHS.MENTOR_CLASS_LIST);
        },

        onError: (error) => {
            console.error(error);
            alert('Waduh, gagal mengupdate data kelas.');
        },
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateClassMutation.mutate({
            title: formData.title,
            category_id: Number(formData.category_id),
            price: Number(formData.price),
            description: formData.description,
        });
    };

    const categoryList = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : (categoriesResponse as any)?.data || [];

    if (isLoadingClass || isLoadingCategories) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm text-slate-600">
                    Loading class details...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10">
            {/* Header */}
            <div className="border-b border-slate-200 pb-6">
                <button
                    onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                    className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Class List
                </button>

                <h1 className="text-3xl font-bold text-slate-900">
                    Edit Class Details
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Modify your class information below. Editing ID:{' '}
                    <span className="font-semibold text-indigo-600">
                        #{id}
                    </span>
                </p>
            </div>

            {/* Card */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
            >
                {/* Title */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        Class Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Advanced UI Design Systems"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>

                {/* Category + Price */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <LayoutGrid className="h-4 w-4 text-indigo-600" />
                            Category
                        </label>

                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="">Select Category</option>

                            {categoryList.map((cat: any, index: number) => {
                                const catId =
                                    cat.category_id || cat.id || index;

                                return (
                                    <option key={catId} value={catId}>
                                        {cat.categories ||
                                            cat.category_name ||
                                            cat.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <DollarSign className="h-4 w-4 text-indigo-600" />
                            Price (IDR)
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            placeholder="150000"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        Class Description
                    </label>

                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe what students will learn in this class..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={updateClassMutation.isPending}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {updateClassMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}

                        {updateClassMutation.isPending
                            ? 'Saving...'
                            : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}