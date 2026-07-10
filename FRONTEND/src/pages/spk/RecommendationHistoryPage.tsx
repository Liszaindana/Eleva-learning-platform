import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Eye, History } from 'lucide-react';
import Container from '../../components/ui/Container';
import SectionHeader from '../../components/ui/SectionHeader';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { recommendationApi } from '../../api/recommendation';
import { formatDate } from '../../lib/utils';
import { recommendationDetailPath } from '../../routes/paths';

export default function RecommendationHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['recommendation-history'],
    queryFn: recommendationApi.getHistory,
  });

  const history = data?.data ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Container className="py-10">
        <SectionHeader
          title="Riwayat Rekomendasi"
          subtitle="Daftar perhitungan rekomendasi mentor yang pernah kamu buat"
        />

        {isLoading ? (
          <LoadingState text="Memuat riwayat..." />
        ) : history.length === 0 ? (
          <EmptyState
            icon={<History className="h-7 w-7" />}
            title="Belum ada riwayat"
            description="Kamu belum pernah membuat perhitungan rekomendasi mentor."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Periode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Metode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Top Mentor</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((req) => {
                  const top = req.results?.find((r) => r.ranking === 1);
                  return (
                    <tr key={req.id_recomen} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{req.category?.categories ?? '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.periode?.year ?? '-'}</td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{req.method}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(req.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{top?.user?.name ?? '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={recommendationDetailPath(req.id_recomen)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </div>
  );
}