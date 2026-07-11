import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Save, X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { kriteriaApi, updateKriteriaBobot } from '../../../api/recommendation';
import type { Kriteria } from '../../../types/recommendation';
import { Link } from 'react-router-dom'; 
import { ListTree } from 'lucide-react';
import { kriteriaValueDetailPath } from '../../../routes/paths';

export default function KriteriaListPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data: kriteriaList, isLoading } = useQuery({
    queryKey: ['kriteria'],
    queryFn: kriteriaApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: ({ id, bobot }: { id: number; bobot: number }) => updateKriteriaBobot(id, bobot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kriteria'] });
      setEditingId(null);
    },
  });

  const startEdit = (k: Kriteria) => {
    setEditingId(k.id_kriteria);
    setEditValue(String(k.bobot));
  };

  const saveEdit = (id: number) => {
    const bobot = Number(editValue);
    if (isNaN(bobot) || bobot < 0) return;
    mutation.mutate({ id, bobot });
  };

  const totalBobot = kriteriaList?.reduce((sum, k) => sum + k.bobot, 0) ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Kriteria SPK</h1>
          <p className="mt-1 text-sm text-slate-600">
            Atur bobot default tiap kriteria yang dipakai untuk menghitung rekomendasi mentor terbaik
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-md">
            Memuat kriteria...
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kode</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Bobot Default</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kriteriaList?.map((k) => (
                    <tr key={k.id_kriteria} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">{k.kode}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{k.nama}</td>
                      <td className="px-6 py-4">
                        <Badge variant={k.tipe === 'benefit' ? 'success' : 'warning'}>{k.tipe}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === k.id_kriteria ? (
                          <input
                            type="number"
                            min={0}
                            max={1}
                            step={0.05}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            className="w-24 rounded-lg border border-blue-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <span className="text-sm text-slate-700">{k.bobot.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === k.id_kriteria ? (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" onClick={() => saveEdit(k.id_kriteria)} isLoading={mutation.isPending}>
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <Link
                              to={kriteriaValueDetailPath(k.id_kriteria)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                              <ListTree className="h-3.5 w-3.5" />
                              Skala Nilai
                            </Link>
                            <button
                              onClick={() => startEdit(k)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className={`mt-4 text-sm ${Math.abs(totalBobot - 1) < 0.01 ? 'text-emerald-600' : 'text-amber-600'}`}>
          Total bobot default: {totalBobot.toFixed(2)}{' '}
          {Math.abs(totalBobot - 1) < 0.01 ? '✓ pas 1.00' : '(sebaiknya dijumlahkan sama dengan 1.00)'}
        </p>
      </div>
    </div>
  );
}