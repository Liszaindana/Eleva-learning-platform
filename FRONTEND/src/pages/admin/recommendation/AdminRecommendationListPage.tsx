import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Trash2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { recommendationApi } from '../../../api/recommendation';
import { formatDate } from '../../../lib/utils';
import { recommendationDetailPath } from '../../../routes/paths';

export default function AdminRecommendationListPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['recommendation-all-admin'],
    queryFn: recommendationApi.getAllAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => recommendationApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation-all-admin'] });
    },
  });

  const handleDelete = (id: number, categoryName: string) => {
    if (confirm(`Hapus data rekomendasi untuk kategori "${categoryName}"? Aksi ini tidak bisa dibatalkan.`)) {
      deleteMutation.mutate(id);
    }
  };

  const list = data?.data ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Semua Rekomendasi</h1>
          <p className="mt-1 text-sm text-slate-600">
            Riwayat perhitungan rekomendasi mentor dari seluruh pengguna
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-md">
            Memuat data...
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
            <p className="text-sm font-medium text-slate-700">Belum ada data</p>
            <p className="mt-1 text-sm text-slate-500">Belum ada rekomendasi yang dibuat oleh siapapun.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Dibuat oleh</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Periode</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Metode</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Top Mentor</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {list.map((req) => (
                    <tr key={req.id_recomen} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{(req as any).user?.name ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.category?.categories ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.periode?.year ?? '-'}</td>
                      <td className="px-6 py-4"><Badge variant="info">{req.method}</Badge></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(req.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{req.results?.[0]?.user?.name ?? '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={recommendationDetailPath(req.id_recomen)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                            Detail
                          </Link>
                          <button
                            onClick={() => handleDelete(req.id_recomen, req.category?.categories ?? '-')}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}