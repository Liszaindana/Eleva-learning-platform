import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { kelasApi } from '../../../api/class';
import { userApi } from '../../../api/endpoints';
import { categoryApi } from '../../../api/endpoints';

export default function ClassEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State untuk form input
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | string>('');
  const [userId, setUserId] = useState<number | string>('');

  // 1. Ambil detail kelas yang sedang diedit
  const { data: course, isLoading, isError } = useQuery({
    queryKey: ['adminClassDetail', id],
    queryFn: () => kelasApi.getById(Number(id)),
    enabled: !!id,
  });

  // 2. Ambil semua kategori dari database ril
  const { data: categories = [] } = useQuery({
    queryKey: ['allCategories'],
    queryFn: categoryApi.getAll,
  });

  // 3. Ambil semua user/mentor dari database, lalu filter yang rolenya = 2
  const { data: mentors = [] } = useQuery({
    queryKey: ['allMentors'],
    queryFn: userApi.getAll,
    // ✨ Fungsi select untuk memfilter data sebelum masuk ke komponen
    select: (allUsers: any[]) => {
      // Sesuaikan nama properti rolenya (apakah men.role_id === 2 atau men.role === '2' atau men.role === 2)
      return allUsers.filter((user: any) => Number(user.role_id || user.role) === 2);
    }
  });

  // ✨ PERBAIKAN UTAMA: Sinkronisasi data dari backend ke dalam form state
  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setDescription(course.description || '');
      // Sesuaikan nama properti di bawah dengan objek Class dari backend-mu (misal: category_id atau categoryId)
      setCategoryId(course.category_id || '');
      setUserId(course.user_id || '');
    }
  }, [course]);

  // Fungsi untuk menangani proses submit edit data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Mengirimkan perubahan:', {
      title,
      description,
      category_id: Number(categoryId),
      user_id: Number(userId),
    });

    // Nanti di sini tinggal jalankan mutation.mutate() untuk save ke backend
    navigate('/admin/classes');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Memuat detail data kelas...</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500 font-medium">Gagal memuat data kelas. Data tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/admin/classes" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Course</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Update course details for ID: {id}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
                Course Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                placeholder="e.g. Advanced UI Design Systems"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                placeholder="Course description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {/* ✨ PERBAIKAN: Menggunakan properti .categories sesuai isi phpMyAdmin */}
                  {categories.map((cat: any) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.categories}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mentor" className="block text-sm font-semibold text-slate-900 mb-2">
                  Mentor / Lecturer
                </label>
                <select
                  id="mentor"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select Mentor</option>
                  {/* ✨ LOOPING DATA MENTOR RIL DARI BACKEND */}
                  {mentors.map((men: any) => (
                    <option key={men.user_id} value={men.user_id}>
                      {men.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit">Update Course</Button>
              <Link to="/admin/classes">
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}