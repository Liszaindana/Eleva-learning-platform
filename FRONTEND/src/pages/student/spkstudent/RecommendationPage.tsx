import { useState, type FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Sparkles, RotateCcw } from 'lucide-react';
import Container from '../../../components/ui/Container';
import SectionHeader from '../../../components/ui/SectionHeader';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import WeightInput from '../../../components/recommendation/WeightInput';
import RankingList from '../../../components/recommendation/RangkingList';
import { recommendationApi, kriteriaApi, referenceApi } from '../../../api/recommendation';
import type { RecommendationRequest } from '../../../types/recommendation';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PATHS } from '../../../routes/paths';

const METHODS = [
  { value: 'SAW', label: 'SAW', desc: 'Simple Additive Weighting' },
  { value: 'WP', label: 'WP', desc: 'Weighted Product' },
  { value: 'TOPSIS', label: 'TOPSIS', desc: 'Technique for Order Preference' },
] as const;

export default function RecommendationPage() {
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [periodeId, setPeriodeId] = useState<number | ''>('');
  const [method, setMethod] = useState<'SAW' | 'WP' | 'TOPSIS'>('SAW');
  const [weights, setWeights] = useState<Record<number, number>>({});
  const [result, setResult] = useState<RecommendationRequest | null>(null);

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: referenceApi.getCategories,
  });

  const { data: periodes, isLoading: loadingPeriodes } = useQuery({
    queryKey: ['periodes'],
    queryFn: referenceApi.getPeriodes,
  });

  const { data: kriteriaList, isLoading: loadingKriteria } = useQuery({
    queryKey: ['kriteria'],
    queryFn: kriteriaApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: recommendationApi.create,
    onSuccess: (res) => setResult(res.data),
  });

  const handleWeightChange = (id_kriteria: number, value: number) => {
    setWeights((prev) => ({ ...prev, [id_kriteria]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    const weightPayload =
      kriteriaList && Object.keys(weights).length > 0
        ? kriteriaList.map((k) => ({
            kriteria_id: k.id_kriteria,
            bobot: weights[k.id_kriteria] ?? k.bobot,
          }))
        : undefined;

    mutation.mutate({
      category_id: Number(categoryId),
      periode_id: periodeId ? Number(periodeId) : undefined,
      method,
      weights: weightPayload,
    });
  };

  const handleReset = () => {
    setResult(null);
    mutation.reset();
  };

  const isLoadingReference = loadingCategories || loadingPeriodes || loadingKriteria;

  return (
    <div className="min-h-screen bg-slate-50">
      <Container className="py-10">
        <Link
            to={PATHS.STUDENT_DASHBOARD}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
        <SectionHeader
          title="Rekomendasi Mentor Terbaik"
          subtitle="Hitung ranking mentor otomatis menggunakan metode SAW, Weighted Product, atau TOPSIS"
        />

        {isLoadingReference ? (
          <LoadingState text="Memuat data referensi..." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700">Kategori</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories?.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.categories}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Periode <span className="text-slate-400">(opsional, default periode terbaru)</span>
                </label>
                <select
                  value={periodeId}
                  onChange={(e) => setPeriodeId(e.target.value ? Number(e.target.value) : '')}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Periode terbaru</option>
                  {periodes?.map((p) => (
                    <option key={p.periode_id} value={p.periode_id}>
                      {p.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Metode</label>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => (
                    <button
                      type="button"
                      key={m.value}
                      onClick={() => setMethod(m.value)}
                      title={m.desc}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        method === m.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-500 hover:border-blue-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bobot Kriteria <span className="text-slate-400">(opsional override)</span>
                </label>
                {kriteriaList && kriteriaList.length > 0 ? (
                  <WeightInput kriteriaList={kriteriaList} weights={weights} onChange={handleWeightChange} />
                ) : (
                  <p className="text-xs text-slate-400">Belum ada kriteria terdaftar di sistem.</p>
                )}
              </div>

              {mutation.isError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {(mutation.error as Error).message}
                </p>
              )}

              <div className="flex gap-2">
                <Button type="submit" isLoading={mutation.isPending} className="flex-1">
                  <Sparkles className="h-4 w-4" />
                  Hitung Rekomendasi
                </Button>
                {result && (
                  <Button type="button" variant="secondary" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            {/* HASIL */}
            <div className="lg:col-span-3">
              {mutation.isPending ? (
                <LoadingState text="Menghitung rekomendasi..." />
              ) : result ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Hasil Ranking — Metode {result.method}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {result.category?.categories} · Periode {result.periode?.year}
                    </p>
                  </div>
                  {result.results && result.results.length > 0 ? (
                    <RankingList results={result.results} />
                  ) : (
                    <EmptyState title="Tidak ada hasil" description="Tidak ada mentor yang bisa dirangking." />
                  )}
                </div>
              ) : (
                <EmptyState
                  title="Belum ada hasil"
                  description="Pilih kategori dan metode, lalu klik 'Hitung Rekomendasi' untuk melihat ranking mentor terbaik."
                />
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}