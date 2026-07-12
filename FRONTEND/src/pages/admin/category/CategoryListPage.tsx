import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Tambahkan ini
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PATHS } from '../../../routes/paths';
import { categoryApi } from '../../../api/endpoints'; // Sesuaikan file path categoryApi kamu
import { kelasApi } from '../../../api/class';

export default function CategoryListPage() {
  const queryClient = useQueryClient();

  // Tambahkan ini: Ambil semua data kelas untuk dihitung jumlahnya
  const { data: classes = [] } = useQuery({
    queryKey: ['adminClassesListAll'],
    queryFn: kelasApi.getAll,
  });

  // 1. Ambil data asli dari backend menggunakan useQuery
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['adminCategoriesList'],
    queryFn: categoryApi.getAll,
  });

  // 💡 Opsional: Mutasi untuk menghapus kategori jika nanti kamu butuhkan
  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryApi.delete(id),
    onSuccess: () => {
      // Refresh list kategori otomatis setelah sukses menghapus
      queryClient.invalidateQueries({ queryKey: ['adminCategoriesList'] });
      alert('Kategori berhasil dihapus!');
    },
    onError: () => {
      alert('Gagal menghapus kategori.');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Memuat data kategori...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500 font-medium">Gagal mengambil data dari database backend.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Categories</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage course categories
            </p>
          </div>
          <Link to={PATHS.ADMIN_CATEGORY_CREATE}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-sm">
                      Belum ada data kategori di database.
                    </td>
                  </tr>
                ) : (
                  categories.map((category: any) => {
                    // Ambil ID secara aman sesuai database (category_id)
                    const currentId = category.category_id;

                    // ✨ Hitung berapa banyak kelas yang memiliki category_id sama dengan kategori ini
                    const totalCourses = classes.filter((cls: any) => Number(cls.category_id) === Number(currentId)).length;

                    return (
                      <tr key={currentId} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          {/* ✨ Menggunakan .categories sesuai kolom phpMyAdmin */}
                          <div className="text-sm font-semibold text-slate-900">
                            {category.categories}
                          </div>
                        </td>
                        {/* Kolom jumlah courses yang sudah dinamis */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600 font-medium">
                            {totalCourses} courses
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">

                            {/* Tombol Edit - Hubungkan ke rute edit kategori kelompokmu */}
                            <Link
                              to={`/admin/categories/${currentId}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Category"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>

                            {/* Tombol Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Apakah kamu yakin ingin menghapus kategori "${category.categories}"?`)) {
                                  deleteMutation.mutate(currentId);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}