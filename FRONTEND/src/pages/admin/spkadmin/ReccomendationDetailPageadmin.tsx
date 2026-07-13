import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User } from 'lucide-react'; 
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import { recommendationApi } from '../../../api/recommendation';
import { formatDate } from '../../../lib/utils';
import { PATHS } from '../../../routes/paths';
import RankingList from '../../../components/recommendation/RangkingList';

export default function AdminRecommendationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const idNum = Number(id);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-recommendation-detail', idNum],
        queryFn: () => recommendationApi.getDetail(idNum), 
        enabled: !isNaN(idNum),
    });

    // 1. Diberikan 'as any' untuk menghindari masalah type checking pada properti .user
    const detail = data?.data as any; 

    return (
        // 2. Gunakan pembungkus div standar agar lebarnya pas dengan dashboard admin kamu
        <div className="w-full space-y-6 p-6">
            <div className="flex items-center justify-between">
                <Link
                    to={PATHS.ADMIN_RECOMMENDATION_ALL} 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke daftar rekomendasi
                </Link>
            </div>

            {isLoading ? (
                <LoadingState text="Memuat detail rekomendasi..." />
            ) : !detail ? (
                <EmptyState title="Data tidak ditemukan" description="Rekomendasi ini mungkin sudah dihapus." />
            ) : (
                <div className="grid gap-6 lg:grid-cols-5">
                    <div className="space-y-4 lg:col-span-2">

                        {/* Kartu Informasi Siswa yang meminta rekomendasi */}
                        {detail.user && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{detail.user.name}</h4>
                                        <p className="text-xs text-slate-500">{detail.user.email}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-between text-xs">
                                    <span className="text-slate-500">Role Pemohon</span>
                                    <span className="font-semibold text-slate-700 capitalize">{detail.user.role || 'Siswa'}</span>
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">Ringkasan Analisis</h3>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <div className="text-slate-500">Kategori</div>
                                    <div className="font-medium text-slate-900">{detail.category?.categories}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-slate-500">Periode</div>
                                    <div className="font-medium text-slate-900">{detail.periode?.year}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-slate-500">Metode SPK</div>
                                    <div><Badge variant="info">{detail.method}</Badge></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-slate-500">Tanggal Request</div>
                                    <div className="font-medium text-slate-900">{formatDate(detail.created_at)}</div>
                                </div>
                            </dl>
                        </div>

                        {detail.weights && detail.weights.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">Bobot Preferensi Input</h3>
                                <ul className="mt-4 space-y-2">
                                    {detail.weights.map((w: any) => (
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
                            <h3 className="mb-5 text-lg font-bold text-slate-900">Hasil Perhitungan & Ranking Mentor</h3>
                            {detail.results && detail.results.length > 0 ? (
                                <RankingList results={detail.results} />
                            ) : (
                                <EmptyState title="Tidak ada hasil peringkat" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}