import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Star, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import Container from '../../components/ui/Container';
import SectionHeader from '../../components/ui/SectionHeader';
import Badge from '../../components/ui/Badge';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import { classApi } from '../../api/endpoints';
import { kelasDetailPath } from '../../routes/paths';
import { truncate, averageRating } from '../../lib/utils';
import type { Class } from '../../types/learning';

export default function KelasListPage() {
  const [search, setSearch] = useState('');
  const { data: classes, isLoading, isError } = useQuery({
    queryKey: ['classes'],
    queryFn: classApi.getAll,
  });

  const filtered = (classes ?? []).filter((c: Class) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeader
          title="Jelajahi Kelas"
          subtitle="Temukan kelas yang sesuai dengan minat dan kebutuhanmu"
        />

        {/* Search bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingState text="Memuat daftar kelas..." />
        ) : isError ? (
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="Gagal Memuat Data"
            description="Terjadi kesalahan saat mengambil data kelas. Pastikan server backend aktif."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="Tidak Ada Kelas Ditemukan"
            description={search ? `Tidak ada kelas dengan kata kunci "${search}"` : 'Belum ada kelas yang tersedia saat ini.'}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((kelas: Class) => {
              const rating = averageRating(kelas.reviews?.map((r) => r.rating) ?? []);
              const studentCount = kelas.enrollment?.filter((e) => e.role_in_class === 'siswa').length ?? 0;

              return (
                <Link
                  key={kelas.class_id}
                  to={kelasDetailPath(kelas.class_id)}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
                >
                  {/* Gradient header */}
                  <div className="h-36 bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-purple-600/10 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-indigo-400/50 group-hover:text-indigo-400/70 transition-colors" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {kelas.category && <Badge variant="info">{kelas.category.categories}</Badge>}
                      {kelas.level && <Badge>{kelas.level.level_info}</Badge>}
                    </div>

                    <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {kelas.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {truncate(kelas.description, 100)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {studentCount} siswa
                      </span>
                      {rating > 0 && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          {rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
