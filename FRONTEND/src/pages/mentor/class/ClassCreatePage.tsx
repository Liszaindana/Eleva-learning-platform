import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Pastikan import ini sesuai setup projectmu
import { PATHS } from '../../../routes/paths';
import { ArrowLeft, Save, FileText, LayoutGrid, DollarSign } from 'lucide-react';
import { categoryApi } from '../../../api/endpoints';

export default function ClassCreatePage() {
    const navigate = useNavigate();

    // 1. Ganti fetch manual dengan TanStack Query yang kamu berikan
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: categoryApi.getAll,
    });

    const categories = categoriesResponse || categoriesResponse || [];

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        price: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Selesaikan implementasi API POST kelas di sini sesuai arsitektur timmu
            const response = await fetch('/class', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    category_id: Number(formData.categoryId),
                    price: Number(formData.price),
                    description: formData.description,
                }),
            });

            if (response.ok) {
                navigate(PATHS.MENTOR_CLASS_LIST);
            } else {
                alert('Gagal membuat kelas');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full p-6 md:p-10 max-w-4xl mx-auto space-y-8 text-slate-100">

            {/* Back Button & Header */}
            <div className="flex flex-col gap-3 border-b border-slate-900 pb-6">
                <button
                    type="button"
                    onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer self-start"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Class List
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Create New Class</h1>
                    <p className="text-slate-400 text-sm mt-1">Fill in the details below to launch your new learning program.</p>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">

                {/* Class Title */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-indigo-400" />
                        Class Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Advanced UI Design Systems"
                        required
                        disabled={isSubmitting}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                    />
                </div>

                {/* Row Category & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Dropdown (Memakai data dari useQuery) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <LayoutGrid className="h-4 w-4 text-indigo-400" />
                            Category
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            disabled={isLoadingCategories || isSubmitting}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            {isLoadingCategories ? (
                                <option value="">Loading categories...</option>
                            ) : (
                                <>
                                    <option value="">Select a category</option>
                                    {/* Ubah cat.id -> cat.category_id & cat.name -> cat.categories */}
                                    {Array.isArray(categories) && categories.map((cat: any) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.categories}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-indigo-400" />
                            Price (IDR)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g. 150000"
                            required
                            disabled={isSubmitting}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-indigo-400" />
                        Class Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe what students will learn in this class..."
                        required
                        disabled={isSubmitting}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none disabled:opacity-50"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/60">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-semibold rounded-xl transition-all border border-transparent hover:border-slate-700/50 cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? 'Publishing...' : 'Publish Class'}
                    </button>
                </div>

            </form>
        </div>
    );
}