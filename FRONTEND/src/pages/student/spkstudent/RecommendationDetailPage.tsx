import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Container from '../../../components/ui/Container';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import { recommendationApi } from '../../../api/recommendation';
import { formatDate } from '../../../lib/utils';
import { PATHS } from '../../../routes/paths';
import RankingList from '../../../components/recommendation/RangkingList';

export default function RecommendationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const idNum = Number(id);

  const { data, isLoading } = useQuery({
    queryKey: ['recommendation-detail', idNum],
    queryFn: () => recommendationApi.getDetail(idNum),
    enabled: !isNaN(idNum),
  });

  const detail = data?.data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Container className="py-10">
        <Link
          to={PATHS.RECOMMENDATION_HISTORY}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke riwayat
        </Link>

        {isLoading ? (
          <LoadingState text="Memuat detail..." />
        ) : !detail ? (
          <EmptyState title="Data tidak ditemukan" description="Rekomendasi ini mungkin sudah dihapus." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Ringkasan</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Kategori</dt>
                    <dd className="font-medium text-slate-900">{detail.category?.categories}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Periode</dt>
                    <dd className="font-medium text-slate-900">{detail.periode?.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Metode</dt>
                    <dd><Badge variant="info">{detail.method}</Badge></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Tanggal</dt>
                    <dd className="font-medium text-slate-900">{formatDate(detail.created_at)}</dd>
                  </div>
                </dl>
              </div>

              {detail.weights && detail.weights.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Bobot yang Dipakai</h3>
                  <ul className="mt-4 space-y-2">
                    {detail.weights.map((w) => (
                      <li key={w.id_bobot} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{w.kriteria?.nama ?? `Kriteria #${w.id_kriteria}`}</span>
                        <span className="font-semibold text-slate-900">{(w.bobot_req * 100).toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-bold text-slate-900">Hasil Ranking Mentor</h3>
                {detail.results && detail.results.length > 0 ? (
                  <RankingList results={detail.results} />
                ) : (
                  <EmptyState title="Tidak ada hasil" />
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}