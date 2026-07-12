import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { PATHS } from '../../../routes/paths';
import { kelasApi } from '../../../api/kelas'; // Sesuaikan folder path kelasApi kamu

export default function ClassListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  // 1. Ambil data asli dari endpoint /class
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['adminClassesList'],
    queryFn: kelasApi.getAll,
  });

  // 2. Fungsi Mutasi untuk Menghapus Kelas
  const deleteMutation = useMutation({
    mutationFn: (classId: string | number) => {
      // Pastikan fungsi ini tersedia di kelasApi kamu (misal kelasApi.delete atau kelasApi.remove)
      // Jika namanya berbeda di backend, silakan ganti panggilannya di sini
      return kelasApi.delete(classId);
    },
    onSuccess: () => {
      alert('Kelas berhasil dihapus!');
      // Memicu queryClient untuk mengambil data baru agar tabel otomatis ter-update
      queryClient.invalidateQueries({ queryKey: ['adminClassesList'] });
    },
    onError: (error: any) => {
      console.error('Gagal menghapus kelas:', error);
      alert(error?.response?.data?.message || 'Gagal menghapus kelas dari database.');
    },
  });

  // 3. Logika Pagination Frontend
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Memuat data kelas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500 font-medium">Gagal memuat daftar kelas dari database.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Courses</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage all courses on the platform ({courses.length} total courses)
            </p>
          </div>
          <Link to={PATHS.ADMIN_CLASS_CREATE}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mentor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-500 text-sm">
                      Belum ada data kelas di database.
                    </td>
                  </tr>
                ) : (
                  currentCourses.map((course: any) => {
                    const currentClassId = course.class_id || course.id;

                    return (
                      <tr key={currentClassId} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-slate-900">{course.title || course.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{course.category?.categories || 'Uncategorized'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{course.mentor?.name || 'No Mentor Assigned'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{course.students ?? course._count?.students ?? 0}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{course.rating ? Number(course.rating).toFixed(1) : '0.0'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={course.status?.toLowerCase() === 'active' ? 'success' : 'default'}>
                            {course.status || 'Active'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">

                            {/* 1. Tombol View */}
                            <Link
                              to={`/class/${currentClassId}`}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Class"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            {/* 2. Tombol Edit */}
                            <Link
                              to={`/admin/classes/${currentClassId}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Class"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>

                            {/* 3. Tombol Delete (Sudah Diperbaiki) */}
                            <button
                              onClick={() => {
                                if (confirm(`Apakah kamu yakin ingin menghapus kelas "${course.title || course.name}"?`)) {
                                  deleteMutation.mutate(currentClassId);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Class"
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

          {/* Navigasi Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, courses.length)} of {courses.length} courses
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-900 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}