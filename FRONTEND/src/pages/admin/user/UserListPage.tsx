import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ChevronLeft, ChevronRight, Plus, Save, X, Pencil } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { adminApi } from '../../../api/admin';
import { apiClient } from '../../../api/client';

interface Role {
  role_id: number;
  role_text: string;
}

const roleBadgeVariant = (roleText?: string) => {
  const r = roleText?.toLowerCase();
  if (r === 'admin') return 'info';
  if (r === 'mentor') return 'success';
  return 'default';
};

export default function UserListPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role_id: '' });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', email: '', password: '', role_id: '' });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: adminApi.getUsers,
  });

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => apiClient.get<Role[]>('/role').then((res) => res.data),
  });

  const users = Array.isArray(data) ? data : (data?.data || data?.users || []);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });

  const createMutation = useMutation({
    mutationFn: (payload: typeof newForm) =>
      apiClient.post('/admin-create', { ...payload, role_id: Number(payload.role_id) }),
    onSuccess: () => {
      invalidate();
      setShowAddForm(false);
      setNewForm({ name: '', email: '', password: '', role_id: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      apiClient.put(`/users/${id}`, payload),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/users/${id}`),
    onSuccess: invalidate,
  });

  const startEdit = (user: any) => {
    setEditingId(user.user_id);
    setEditForm({ name: user.name, email: user.email, role_id: String(user.role_id) });
  };

  const saveEdit = (id: number) => {
    if (!editForm.name.trim() || !editForm.email.trim()) return;
    updateMutation.mutate({
      id,
      payload: { name: editForm.name, email: editForm.email, role_id: Number(editForm.role_id) },
    });
  };

  const handleCreate = () => {
    if (!newForm.name.trim() || !newForm.email.trim() || !newForm.password.trim() || !newForm.role_id) return;
    createMutation.mutate(newForm);
  };

  const handleDelete = (user: any) => {
    if (confirm(`Hapus user "${user.name}"? Aksi ini tidak bisa dibatalkan.`)) {
      deleteMutation.mutate(user.user_id);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 font-medium">Memuat data user...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-500 font-bold text-lg mb-2">Gagal Memuat Data User!</p>
        <p className="text-slate-500 text-sm max-w-md bg-red-50 border border-red-200 p-3 rounded-xl">
          {error instanceof Error ? error.message : 'Unknown Error'}
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
          <Button size="sm" onClick={() => setShowAddForm((s) => !s)}>
            <Plus className="h-4 w-4" />
            Tambah User
          </Button>
        </div>

        {showAddForm && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <input
                type="text"
                placeholder="Nama"
                value={newForm.name}
                onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="email"
                placeholder="Email"
                value={newForm.email}
                onChange={(e) => setNewForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="password"
                placeholder="Password"
                value={newForm.password}
                onChange={(e) => setNewForm((f) => ({ ...f, password: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <select
                value={newForm.role_id}
                onChange={(e) => setNewForm((f) => ({ ...f, role_id: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Pilih role</option>
                {roles?.map((r) => (
                  <option key={r.role_id} value={r.role_id}>{r.role_text}</option>
                ))}
              </select>
            </div>

            {createMutation.isError && (
              <p className="mt-3 text-sm text-red-600">
                {(createMutation.error as any)?.response?.data?.message ?? 'Gagal membuat user.'}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setShowAddForm(false)}>Batal</Button>
              <Button size="sm" onClick={handleCreate} isLoading={createMutation.isPending}>
                <Save className="h-3.5 w-3.5" />
                Simpan
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-sm">
                      Tidak ada user terdeteksi.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user: any) => (
                    <tr key={user.user_id} className="hover:bg-slate-50">
                      {editingId === user.user_id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                              autoFocus
                              className="w-full rounded-lg border border-blue-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                              className="w-full rounded-lg border border-blue-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editForm.role_id}
                              onChange={(e) => setEditForm((f) => ({ ...f, role_id: e.target.value }))}
                              className="rounded-lg border border-blue-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            >
                              {roles?.map((r) => (
                                <option key={r.role_id} value={r.role_id}>{r.role_text}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button size="sm" onClick={() => saveEdit(user.user_id)} isLoading={updateMutation.isPending}>
                                <Save className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600">{user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={roleBadgeVariant(user.role?.role_text)}>
                              {user.role?.role_text ?? 'unknown'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => startEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
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