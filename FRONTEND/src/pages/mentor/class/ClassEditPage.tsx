import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import {
    ArrowLeft,
    Save,
    FileText,
    LayoutGrid,
    Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kelasApi } from '../../../api/class';
import { categoryApi, levelApi, periodeApi } from '../../../api/endpoints'; // Pastikan levelApi dan periodeApi sudah di-import

export default function ClassEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        category_id: '',
        level_id: '',
        periode_id: '',
        description: '',
    });

    // 1. Fetch Detail Kelas
    const { data: classResponse, isLoading: isLoadingClass } = useQuery({
        queryKey: ['classDetails', id],
        queryFn: () => kelasApi.getById(Number(id)),
        enabled: !!id,
    });

    // 2. Fetch Opsi untuk Dropdown
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: categoryApi.getAll,
    });

    const { data: levelsResponse, isLoading: isLoadingLevels } = useQuery({
        queryKey: ['allLevels'],
        queryFn: levelApi.getAll,
    });

    const { data: periodesResponse, isLoading: isLoadingPeriodes } = useQuery({
        queryKey: ['allPeriodes'],
        queryFn: periodeApi.getAll,
    });

    // Sync data dari backend ke state formData saat komponen berhasil dimuat
    useEffect(() => {
        const classData = (classResponse as any)?.data || classResponse;

        if (classData) {
            setFormData({
                title: classData.title || '',

                category_id:
                    classData.category_id?.toString() ||
                    classData.id_category?.toString() ||
                    classData.category?.category_id?.toString() ||
                    classData.category?.id?.toString() ||
                    '',

                level_id:
                    classData.level_id?.toString() ||
                    classData.id_level?.toString() ||
                    classData.level?.level_id?.toString() ||
                    classData.level?.id?.toString() ||
                    classData.level?.toString() ||
                    '',

                periode_id:
                    classData.periode_id?.toString() ||
                    classData.id_periode?.toString() ||
                    classData.periode?.periode_id?.toString() ||
                    classData.periode?.id?.toString() ||
                    classData.periode?.toString() ||
                    '',

                description: classData.description || '',
            });
        }
    }, [classResponse]);

    // Mutation untuk update (Hanya mengirim title dan description)
    const updateClassMutation = useMutation({
        mutationFn: (updatedData: { title: string; description: string }) =>
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
            description: formData.description,
        });
    };

    // Ekstrak data array dari response API
    const categoryList = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : (categoriesResponse as any)?.data || [];

    const levelList = Array.isArray(levelsResponse)
        ? levelsResponse
        : (levelsResponse as any)?.data || [];

    const periodeList = Array.isArray(periodesResponse)
        ? periodesResponse
        : (periodesResponse as any)?.data || [];

    // Tampilkan loading spinner jika ada salah satu data yang masih dalam proses fetching
    const isPageLoading = isLoadingClass || isLoadingCategories || isLoadingLevels || isLoadingPeriodes;

    if (isPageLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
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
                    className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Class List
                </button>

                <h1 className="text-3xl font-bold text-slate-900">
                    Edit Class Details
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Modify your class information below. Editing ID:{' '}
                    <span className="font-semibold text-blue-700">
                        #{id}
                    </span>
                </p>
            </div>

            {/* Card */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
            >
                {/* Title (Bisa Diedit) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Class Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Advanced UI Design Systems"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Grid Metadata: Category, Level, dan Periode (Semua Tampil tapi Locked/Disabled) */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Category (Disabled) */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                            <LayoutGrid className="h-4 w-4" />
                            Category <span className="text-[10px] font-normal">(Locked)</span>
                        </label>

                        <select
                            name="category_id"
                            value={formData.category_id}
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-slate-400 outline-none"
                        >
                            <option value="">Select Category</option>
                            {categoryList.map((cat: any, index: number) => {
                                const catId = cat.category_id || cat.id || index;
                                return (
                                    <option key={catId} value={catId}>
                                        {cat.categories || cat.category_name || cat.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Level (Disabled) */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                            <LayoutGrid className="h-4 w-4" />
                            Level <span className="text-[10px] font-normal">(Locked)</span>
                        </label>

                        <select
                            name="level_id"
                            value={formData.level_id}
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-slate-400 outline-none"
                        >
                            <option value="">Select Level</option>
                            {levelList.map((lvl: any, index: number) => {
                                const lvlId = (lvl.level_id || lvl.id_level || lvl.id || index).toString();
                                return (
                                    <option key={lvlId} value={lvlId}>
                                        {lvl.level_info || lvl.level || lvl.level_name || lvl.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Periode (Disabled) */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                            <LayoutGrid className="h-4 w-4" />
                            Periode <span className="text-[10px] font-normal">(Locked)</span>
                        </label>

                        <select
                            name="periode_id"
                            value={formData.periode_id}
                            disabled
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-slate-400 outline-none"
                        >
                            <option value="">Select Periode</option>
                            {periodeList.map((prd: any, index: number) => {
                                const prdId = (prd.periode_id || prd.id_periode || prd.id || index).toString();
                                return (
                                    <option key={prdId} value={prdId}>
                                        {prd.year || prd.periode || prd.periode_name || prd.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Description (Bisa Diedit) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Class Description
                    </label>

                    <textarea
                        name="description"
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe what students will learn in this class..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98]"
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