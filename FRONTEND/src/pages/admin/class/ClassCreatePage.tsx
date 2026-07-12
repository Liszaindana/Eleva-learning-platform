import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { PATHS } from '../../../routes/paths';
import { kelasApi } from '../../../api/kelas';
import { userApi, categoryApi, levelApi, periodeApi } from '../../../api/endpoints';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ClassCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [mentor, setMentor] = useState('');
  const [periode, setPeriode] = useState('');
  const [level, setLevel] = useState('');
  // 1. Ambil data Kategori
  const { data: categories = [] } = useQuery({
    queryKey: ['allCategories'],
    queryFn: categoryApi.getAll,
  });

  // 2. Ambil data Mentor (Filter role_id === 2)
  const { data: mentors = [] } = useQuery({
    queryKey: ['allMentors'],
    queryFn: userApi.getAll,
    select: (allUsers: any[]) => {
      return allUsers.filter((user: any) => Number(user.role_id || user.role) === 2);
    }
  });

  // 3. ✨ Ambil data Periode (Asumsi endpoint-nya tersedia, jika belum buat dummy select sementara)
  const { data: periodes = [] } = useQuery({
    queryKey: ['allPeriodes'],
    queryFn: () => periodeApi.getAll?.() || Promise.resolve([]), // Fallback jika belum di-define di api
  });

  // 4. ✨ Ambil data Level
  const { data: levels = [] } = useQuery({
    queryKey: ['allLevels'],
    queryFn: () => levelApi.getAll?.() || Promise.resolve([]),   // Fallback jika belum di-define di api
  });

  // Mutasi untuk Create Kelas
  const createClassMutation = useMutation({
    // Type-safety payload disesuaikan dengan req.body backend kamu
    mutationFn: (newClass: {
      title: string;
      description: string;
      category_id: number;
      periode_id: number;
      level_id: number;
      user_id: number;
    }) => kelasApi.create(newClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminClassesList'] }); // Sesuaikan dengan key list kelas kamu
      navigate(PATHS.ADMIN_CLASS_LIST);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 💥 Payload SEKARANG MATANG, Sesuai dengan validasi req.body backend!
    createClassMutation.mutate({
      title,
      description,
      category_id: Number(category),
      periode_id: Number(periode),  // Didapat dari backend prisma
      level_id: Number(level),      // Didapat dari backend prisma
      user_id: Number(mentor),      // Backend mintanya user_id, bukan mentor_id
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={PATHS.ADMIN_CLASS_LIST} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Course</h1>
          <p className="text-slate-600 mt-1 text-sm">Add a new course to the platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {createClassMutation.isError && (
              <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 p-2.5 rounded-xl">
                {(createClassMutation.error as any)?.response?.data?.message ||
                  (createClassMutation.error as any)?.message ||
                  'Gagal membuat kelas baru.'}
              </p>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">Course Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                placeholder="e.g. Advanced UI Design Systems"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                placeholder="Course description"
                required
              />
            </div>

            {/* Grid Opsi Pilihan Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dropdown Kategori */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.categories || cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Dropdown Mentor */}
              <div>
                <label htmlFor="mentor" className="block text-sm font-semibold text-slate-900 mb-2">Mentor</label>
                <select
                  id="mentor"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select Mentor</option>
                  {mentors.map((men: any) => (
                    <option key={men.user_id} value={men.user_id}>{men.name}</option>
                  ))}
                </select>
              </div>

              {/* ✨ Dropdown Periode */}
              <div>
                <label htmlFor="periode" className="block text-sm font-semibold text-slate-900 mb-2">Periode</label>
                <select
                  id="periode"
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select Periode</option>
                  {periodes.map((p: any) => (
                    <option key={p.periode_id} value={p.periode_id}>
                      {p.year}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✨ Dropdown Level */}
              {/* 📝 Sesuaikan bagian mapping Level di return JSX kamu: */}
              <div>
                <label htmlFor="level" className="block text-sm font-semibold text-slate-900 mb-2">Course Level</label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map((l: any) => (
                    // ✨ l.level_id sebagai value, dan l.level_info untuk menampilkan teks 'Beginner', 'Intermediate', dst.
                    <option key={l.level_id} value={l.level_id}>
                      {l.level_info}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" isLoading={createClassMutation.isPending}>
                Create Course
              </Button>
              <Link to={PATHS.ADMIN_CLASS_LIST}>
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}