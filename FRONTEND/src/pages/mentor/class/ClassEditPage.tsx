import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../../routes/paths';
import { ArrowLeft, Save, FileText, LayoutGrid, DollarSign, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kelasApi } from '../../../api/kelas'; // Sesuaikan path import apiClient kamu
import { categoryApi } from '../../../api/endpoints'; // Sesuaikan path import apiClient kamu

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

    // 🔄 1. Ambil data kelas dari backend memakai kelasApi
    const { data: classResponse, isLoading: isLoadingClass } = useQuery({
        queryKey: ['classDetails', id],
        queryFn: () => kelasApi.getById(Number(id)),
        enabled: !!id,
    });

    // 🔄 2. Ambil semua daftar kategori untuk dropdown memakai categoryApi
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
        queryKey: ['allCategories'],
        queryFn: categoryApi.getAll,
    });

    // 🔄 3. Sinkronkan data kelas ke dalam form state
    useEffect(() => {
        // Antisipasi jika data dibungkus property .data dari backend
        const classData = (classResponse as any)?.data || classResponse;

        if (classData) {
            setFormData({
                title: classData.title || '',
                category_id: classData.category_id?.toString() || classData.category?.toString() || '',
                price: classData.price?.toString() || '0',
                description: classData.description || '',
            });
        }
    }, [classResponse]);

    // 🔄 4. Mutation untuk proses simpan (update) perubahan data kelas
    const updateClassMutation = useMutation({
        mutationFn: (updatedData: any) => kelasApi.update(Number(id), updatedData),
        onSuccess: () => {
            // Segarkan cache query dashboard/kelas agar infonya langsung sinkron
            queryClient.invalidateQueries({ queryKey: ['allenrollment'] });
            queryClient.invalidateQueries({ queryKey: ['classDetails', id] });
            alert('Perubahan data kelas berhasil disimpan!');
            navigate(PATHS.MENTOR_CLASS_LIST);
        },
        onError: (error) => {
            console.error('Failed to update class:', error);
            alert('Waduh, gagal mengupdate data kelas. Coba cek koneksi backend kamu.');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Buat payload yang sesuai dengan kebutuhan backend kamu
        const payload = {
            title: formData.title,
            category_id: Number(formData.category_id),
            price: Number(formData.price),
            description: formData.description,
        };

        updateClassMutation.mutate(payload);
    };

    // Ambil array list kategori asli (antisipasi jika dibungkus .data)
    const categoryList = Array.isArray(categoriesResponse)
        ? categoriesResponse
        : (categoriesResponse as any)?.data || [];

    // Tampilkan screen loading jika data kelas atau data kategori masih di-fetch
    if (isLoadingClass || isLoadingCategories) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Loading class details & categories...</p>
            </div>
        );
    }

    return (
        <div className="w-full p-6 md:p-10 max-w-4xl mx-auto space-y-8 text-slate-100">

            {/* Back Button & Header */}
            <div className="flex flex-col gap-3 border-b border-slate-900 pb-6">
                <button
                    onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer self-start"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Class List
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Edit Class Details</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Modify the fields below to update your class information (Editing ID: <span className="text-indigo-400 font-mono">#{id}</span>).
                    </p>
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
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                {/* Row Category & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Dropdown Dinamis */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <LayoutGrid className="h-4 w-4 text-indigo-400" />
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        >
                            <option value="">Select a category</option>
                            {categoryList.map((cat: any) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.categories || cat.category_name || cat.name}
                                </option>
                            ))}
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
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/60">
                    <button
                        type="button"
                        onClick={() => navigate(PATHS.MENTOR_CLASS_LIST)}
                        className="px-5 py-2.5 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-semibold rounded-xl transition-all border border-transparent hover:border-slate-700/50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={updateClassMutation.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateClassMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {updateClassMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
    );
}