import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PATHS } from '../../../routes/paths';
import { categoryApi } from '../../../api/endpoints';

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');

  // 1. Ambil data kategori yang sebenarnya dari backend berdasarkan ID di URL
  const { data: category, isLoading, isError } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => categoryApi.getById(categoryId),
    enabled: !isNaN(categoryId),
  });

  // 2. Begitu data asli datang, isi form dengan nilai aslinya (bukan hardcode lagi)
  useEffect(() => {
    if (category) {
      setName(category.categories ?? '');
    }
  }, [category]);

  // 3. Mutasi buat kirim PUT ke backend
  const updateMutation = useMutation({
    mutationFn: (newName: string) => categoryApi.update(categoryId, { categories: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategoriesList'] });
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      alert('Kategori berhasil diperbarui!');
      navigate(PATHS.ADMIN_CATEGORY_LIST);
    },
    onError: (error: any) => {
      console.error(error);
      alert('Gagal memperbarui kategori. Silakan coba lagi.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateMutation.mutate(name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Memuat data kategori...</p>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-bold text-lg mb-2">Kategori tidak ditemukan</p>
        <Link to={PATHS.ADMIN_CATEGORY_LIST}>
          <Button variant="secondary">Kembali ke Daftar Kategori</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={PATHS.ADMIN_CATEGORY_LIST} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Category</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Update category details
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Category Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                placeholder="e.g. Programming"
                disabled={updateMutation.isPending}
                required
              />
            </div>

            {updateMutation.isError && (
              <p className="text-sm text-red-600">
                {(updateMutation.error as any)?.response?.data?.message ?? 'Terjadi kesalahan saat menyimpan.'}
              </p>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Update Category'}
              </Button>
              <Link to={PATHS.ADMIN_CATEGORY_LIST}>
                <Button variant="ghost" disabled={updateMutation.isPending}>Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}