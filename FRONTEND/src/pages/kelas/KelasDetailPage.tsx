import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Star, Play, ArrowLeft, Clock, Award, FileText } from 'lucide-react';
import Container from '../../components/ui/Container';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import { classApi } from '../../api/endpoints';
import { PATHS } from '../../routes/paths';
import { averageRating } from '../../lib/utils';

export default function KelasDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classId = Number(id);

  const { data: kelas, isLoading, isError } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => classApi.getById(classId),
    enabled: !isNaN(classId),
  });

  if (isLoading) return <LoadingState text="Memuat detail kelas..." />;
  if (isError || !kelas) {
    return (
      <Container className="py-20">
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="Kelas Tidak Ditemukan"
          description="Kelas yang kamu cari tidak ada atau telah dihapus."
          action={<Link to={PATHS.KELAS}><Button variant="secondary">Kembali ke Daftar Kelas</Button></Link>}
        />
      </Container>
    );
  }

  const rating = averageRating(kelas.reviews?.map((r) => r.rating) ?? []);
  const studentCount = kelas.enrollment?.filter((e) => e.role_in_class === 'siswa').length ?? 0;
  const materiCount = kelas.materis?.length ?? 0;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        {/* Back link */}
        <Link to={PATHS.KELAS} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Kelas
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {kelas.category && <Badge variant="info">{kelas.category.categories}</Badge>}
                {kelas.level && <Badge>{kelas.level.level_info}</Badge>}
                {kelas.is_active ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Nonaktif</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{kelas.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{studentCount} siswa</span>
                <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" />{materiCount} materi</span>
                {rating > 0 && <span className="flex items-center gap-1.5 text-amber-400"><Star className="h-4 w-4 fill-amber-400" />{rating.toFixed(1)}</span>}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Tentang Kelas</h2>
              <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{kelas.description}</p>
            </div>

            {/* Materi list */}
            {materiCount > 0 && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Daftar Materi</h2>
                <div className="space-y-2">
                  {kelas.materis!.map((m, i) => (
                    <div key={m.materi_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{m.title}</p>
                      </div>
                      <Play className="h-4 w-4 text-slate-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {(kelas.reviews?.length ?? 0) > 0 && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Ulasan</h2>
                <div className="space-y-4">
                  {kelas.reviews!.map((r) => (
                    <div key={r.review_id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-200">{r.user?.name ?? 'Anonim'}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 space-y-5">
              <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-purple-600/10 flex items-center justify-center">
                <BookOpen className="h-14 w-14 text-indigo-400/60" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><Clock className="h-4 w-4" />Periode</span>
                  <span className="text-white font-medium">{kelas.periode?.year ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><Award className="h-4 w-4" />Level</span>
                  <span className="text-white font-medium">{kelas.level?.level_info ?? '-'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5"><FileText className="h-4 w-4" />Materi</span>
                  <span className="text-white font-medium">{materiCount} modul</span>
                </div>
              </div>

              <Button className="w-full" size="lg">Daftar Kelas</Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
