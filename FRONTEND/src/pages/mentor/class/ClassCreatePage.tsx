import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PATHS } from '../../../routes/paths';
import { ArrowLeft, Save, FileText, LayoutGrid, Calendar, ShieldAlert } from 'lucide-react';
import { categoryApi, levelApi, periodeApi } from '../../../api/endpoints';
import { kelasApi } from '../../../api/class';

export default function ClassCreatePage() {
    const navigate = useNavigate();

    // 1. Fetch data Kategori
    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: categoryApi.getAll,
    });

    // 2. Fetch data Level
    const { data: levels = [], isLoading: isLoadingLevels } = useQuery({
        queryKey: ['allLevels'],
        queryFn: levelApi.getAll,
    });

    // 3. Fetch data Periode
    const { data: periodes = [], isLoading: isLoadingPeriodes } = useQuery({
        queryKey: ['allPeriodes'],
        queryFn: periodeApi.getAll,
    });

    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        periodeId: '',
        levelId: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const createClassMutation = useMutation({
        mutationFn: (payload: any) => kelasApi.create(payload),
        onSuccess: () => {
            navigate(PATHS.MENTOR_CLASS_LIST);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || 'Gagal membuat kelas';
            alert(`Gagal membuat kelas: ${errorMessage}`);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Ambil dari key yang benar: 'eleva-auth-storage'
        const authString = localStorage.getItem('eleva-auth-storage');
        const authData = authString ? JSON.parse(authString) : null;

        // 2. Masuk ke dalam properti .state lalu ambil .user
        const user = authData?.state?.user;

        // 3. Ambil user_id (nilainya 41 berdasarkan log kamu)
        const currentUserId = user?.user_id;

        if (!currentUserId) {
            alert("Sesi kamu telah berakhir, silakan login kembali.");
            return;
        }

        // 4. Kirimkan semua data ke mutation
        createClassMutation.mutate({
            title: formData.title,
            category_id: Number(formData.categoryId),
            periode_id: Number(formData.periodeId),
            level_id: Number(formData.levelId),
            description: formData.description,
            user_id: Number(currentUserId), // Nilainya akan otomatis 41
        });
    };

    const isLoadingDropdowns = isLoadingCategories || isLoadingLevels || isLoadingPeriodes;
    const isMutating = createClassMutation.isPending;

    return (
        <div className="w-full p-6 md:p-10 max-w-4xl mx-auto space-y-8 text-slate-900">

            {/* Back Button & Header */}
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6">
                <button
                    type="button"
                    onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                    disabled={isMutating}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors bg-transparent border-none cursor-pointer self-start disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Class List
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Class</h1>
                    <p className="text-slate-500 text-sm mt-1">Fill in the details below to launch your new learning program.</p>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

                {/* Class Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Class Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Advanced UI Design Systems"
                        required
                        disabled={isMutating}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                    />
                </div>

                {/* Grid Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <LayoutGrid className="h-4 w-4 text-blue-700" />
                            Category
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            disabled={isLoadingDropdowns || isMutating}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isLoadingCategories ? (
                                <option value="">Loading...</option>
                            ) : (
                                <>
                                    <option value="">Select Category</option>
                                    {Array.isArray(categories) && categories.map((cat: any) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.categories}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    {/* Level */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <ShieldAlert className="h-4 w-4 text-blue-700" />
                            Level
                        </label>
                        <select
                            name="levelId"
                            value={formData.levelId}
                            onChange={handleChange}
                            required
                            disabled={isLoadingDropdowns || isMutating}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isLoadingLevels ? (
                                <option value="">Loading...</option>
                            ) : (
                                <>
                                    <option value="">Select Level</option>
                                    {Array.isArray(levels) && levels.map((lvl: any) => (
                                        <option key={lvl.level_id} value={lvl.level_id}>
                                            {lvl.level_info}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    {/* Periode */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            Periode
                        </label>
                        <select
                            name="periodeId"
                            value={formData.periodeId}
                            onChange={handleChange}
                            required
                            disabled={isLoadingDropdowns || isMutating}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isLoadingPeriodes ? (
                                <option value="">Loading...</option>
                            ) : (
                                <>
                                    <option value="">Select Periode</option>
                                    {Array.isArray(periodes) && periodes.map((p: any) => (
                                        <option key={p.periode_id} value={p.periode_id}>
                                            {p.periode_name || p.name || p.year}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-blue-700" />
                        Class Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe what students will learn in this class..."
                        required
                        disabled={isMutating}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none disabled:opacity-50"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                        disabled={isMutating}
                        className="px-5 py-2.5 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isMutating || isLoadingDropdowns}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isMutating ? 'Publishing...' : 'Publish Class'}
                    </button>
                </div>

            </form>
        </div>
    );
}