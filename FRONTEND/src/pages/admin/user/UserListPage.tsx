import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { adminApi } from '../../../api/admin'; // Pastikan path ini mengarah ke file adminApi kamu

export default function UserListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data murni menggunakan satu-satunya API yang kamu punya
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: adminApi.getUsers,
  });

  // DEBUGGING: Mari kita intip isi respon dari backend di console browser (F12)
  console.log('RESONSE DATA:', data);
  console.log('ERROR DETAIL:', error);

  /* 
    Antisipasi Struktur Response: 
    Kadang backend membungkus datanya lagi di dalam objek (misal: data.data atau data.users).
    Kita amankan agar program tidak crash jika data belum berupa array langsung.
  */
  const users = Array.isArray(data) ? data : (data?.data || data?.users || []);

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Connecting to backend...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-bold text-lg mb-2">Gagal Memuat Data User!</p>
        <p className="text-slate-500 text-sm max-w-md bg-red-50 border border-red-200 p-3 rounded-xl">
          Error Message: {error instanceof Error ? error.message : 'Unknown Error'}
        </p>
        <p className="text-xs text-slate-400 mt-4">
          Cek tab Inspeksi (F12) bagian <b>Console</b> atau <b>Network</b> untuk melihat URL asli yang ditembak.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Users</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage users on the platform ({users.length} total users)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                      Tidak ada user terdeteksi.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user: any) => (
                    <tr key={user.id || user.user_id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role?.toLowerCase() === 'admin' ? 'info' : user.role?.toLowerCase() === 'mentor' ? 'success' : 'default'}>
                          {user.role || 'Student'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">{user.status || 'Active'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Eye className="h-4 w-4" /></button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="h-4 w-4" /></button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} users
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