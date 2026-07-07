import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../../routes/paths'; // Sesuaikan tingkat ../ kelompokmu jika beda
import { ArrowLeft, Save, FileText, LayoutGrid, DollarSign, Loader2 } from 'lucide-react';

export default function ClassEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // ✨ Menangkap ID kelas dari URL

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
    });

    // 🔄 Simulasi mengambil data kelas lama berdasarkan ID saat komponen dimuat
    useEffect(() => {
        const fetchClassData = async () => {
            setIsLoading(true);
            try {
                // Simulasi delay API network request selama 800ms
                await new Promise((resolve) => setTimeout(resolve, 800));

                // Data dummy yang seolah-olah didapat dari database berdasarkan ID
                const mockDatabase: Record<string, typeof formData> = {
                    '1': {
                        title: 'Advanced UI Design Systems',
                        category: 'ui-ux',
                        price: '350000',
                        description: 'Master the art of creating scalable design systems for modern applications. This course covers components, tokens, and documentation.',
                    },
                    '2': {
                        title: 'Product Management 101',
                        category: 'product',
                        price: '250000',
                        description: 'Essential skills for aspiring product managers in the digital era. Learn product lifecycle, user research, and roadmapping.',
                    },
                };

                // Jika ID ditemukan di mock database, pakai datanya. Jika tidak, pakai default kosong.
                const existingClass = mockDatabase[id || ''] || {
                    title: `Sample Class ID ${id}`,
                    category: 'programming',
                    price: '199000',
                    description: 'This is a sample description for fallback data routing test.',
                };

                setFormData(existingClass);
            } catch (error) {
                console.error('Failed to fetch class data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Dummy Update! Data Kelas ID ${id} Berhasil Diubah:\n${JSON.stringify(formData, null, 2)}`);
        // Setelah sukses update, arahkan kembali ke list kelas mentor
        navigate(PATHS.MENTOR_CLASS_LIST);
    };

    // State loading saat pura-pura mengambil data dari API
    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Loading class details...</p>
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
                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <LayoutGrid className="h-4 w-4 text-indigo-400" />
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                        >
                            <option value="">Select a category</option>
                            <option value="ui-ux">UI/UX Design</option>
                            <option value="programming">Programming & Development</option>
                            <option value="product">Product Management</option>
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                        <Save className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
}