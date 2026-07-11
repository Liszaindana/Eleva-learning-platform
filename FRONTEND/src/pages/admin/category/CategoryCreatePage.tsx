import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Tambahkan ini
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PATHS } from '../../../routes/paths';
import { categoryApi } from '../../../api/endpoints';

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  // 1. Buat fungsi mutasi untuk menembak API POST ke backend
  const createMutation = useMutation({
    mutationFn: (newCategoryName: string) => {
      // Kita kirimkan key 'categories' sesuai nama kolom database di phpMyAdmin
      return categoryApi.create({ categories: newCategoryName });
    },
    onSuccess: () => {
      // Beritahu React Query untuk me-refresh data di halaman list kategori agar data baru langsung muncul
      queryClient.invalidateQueries({ queryKey: ['adminCategoriesList'] });
      alert('Kategori baru berhasil ditambahkan!');
      navigate(PATHS.ADMIN_CATEGORY_LIST); // Kembali ke halaman utama list kategori
    },
    onError: (error: any) => {
      console.error(error);
      alert('Gagal menambahkan kategori baru. Silakan coba lagi.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // 2. Jalankan proses kirim data
    createMutation.mutate(name);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={PATHS.ADMIN_CATEGORY_LIST} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Category</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Add a new course category to your database
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
                placeholder="e.g. Cyber Security"
                disabled={createMutation.isPending} // Kunci input jika sedang loading kirim data
                required
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              {/* Ubah status tombol menjadi Loading jika request sedang berjalan */}
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving...' : 'Create Category'}
              </Button>
              <Link to={PATHS.ADMIN_CATEGORY_LIST}>
                <Button variant="ghost" disabled={createMutation.isPending}>Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}