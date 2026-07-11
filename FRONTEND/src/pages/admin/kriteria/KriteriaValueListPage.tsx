import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { kriteriaApi, kriteriaValueApi } from '../../../api/recommendation';
import { PATHS } from '../../../routes/paths';
import type { KriteriaValue } from '../../../types/recommendation';

export default function KriteriaValueListPage() {
  const { id } = useParams<{ id: string }>();
  const idKriteria = Number(id);
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editScore, setEditScore] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newScore, setNewScore] = useState('');

  const { data: kriteriaList } = useQuery({
    queryKey: ['kriteria'],
    queryFn: kriteriaApi.getAll,
  });
  const kriteria = kriteriaList?.find((k) => k.id_kriteria === idKriteria);

  const { data: values, isLoading } = useQuery({
    queryKey: ['kriteria-value', idKriteria],
    queryFn: () => kriteriaValueApi.getByKriteria(idKriteria),
    enabled: !isNaN(idKriteria),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['kriteria-value', idKriteria] });

  const createMutation = useMutation({
    mutationFn: kriteriaValueApi.create,
    onSuccess: () => {
      invalidate();
      setShowAddForm(false);
      setNewLabel('');
      setNewScore('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id_value, value, score }: { id_value: number; value: string; score: number }) =>
      kriteriaValueApi.update(id_value, { value, score }),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: kriteriaValueApi.remove,
    onSuccess: invalidate,
  });

  const startEdit = (v: KriteriaValue) => {
    setEditingId(v.id_value);
    setEditLabel(v.value);
    setEditScore(String(v.score));
  };

  const saveEdit = (id_value: number) => {
    const score = Number(editScore);
    if (!editLabel.trim() || isNaN(score)) return;
    updateMutation.mutate({ id_value, value: editLabel, score });
  };

  const handleCreate = () => {
    const score = Number(newScore);
    if (!newLabel.trim() || isNaN(score)) return;
    createMutation.mutate({ id_kriteria: idKriteria, value: newLabel, score });
  };

  const handleDelete = (id_value: number) => {
    if (confirm('Hapus skala nilai ini?')) deleteMutation.mutate(id_value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl p-6 md:p-10">
        <Link
          to={PATHS.ADMIN_KRITERIA}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Kriteria
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Skala Nilai — {kriteria?.nama ?? `Kriteria #${idKriteria}`}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Label tampilan untuk kriteria <span className="font-mono">{kriteria?.kode}</span>.
              Catatan: label ini hanya untuk tampilan — perhitungan skor otomatis tetap pakai aturan yang di-hardcode di backend.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddForm((s) => !s)}>
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>

        {showAddForm && (
          <div className="mb-6 flex items-end gap-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="mis. 4,8 - 5,0"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="w-28">
              <label className="mb-1 block text-xs font-medium text-slate-600">Skor</label>
              <input
                type="number"
                min={1}
                max={5}
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                placeholder="1-5"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <Button size="sm" onClick={handleCreate} isLoading={createMutation.isPending}>
              <Save className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowAddForm(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-md">
            Memuat skala nilai...
          </div>
        ) : !values || values.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
            <p className="text-sm text-slate-500">Belum ada skala nilai untuk kriteria ini.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Label</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Skor</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[...values]
                  .sort((a, b) => b.score - a.score)
                  .map((v) => (
                    <tr key={v.id_value} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        {editingId === v.id_value ? (
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            autoFocus
                            className="w-full rounded-lg border border-blue-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-900">{v.value}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === v.id_value ? (
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={editScore}
                            onChange={(e) => setEditScore(e.target.value)}
                            className="w-20 rounded-lg border border-blue-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <span className="text-sm text-slate-700">{v.score}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === v.id_value ? (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" onClick={() => saveEdit(v.id_value)} isLoading={updateMutation.isPending}>
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => startEdit(v)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(v.id_value)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}