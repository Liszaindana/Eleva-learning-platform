import type { Kriteria } from '../../types/recommendation';
import Badge from '../ui/Badge';

interface WeightInputProps {
  kriteriaList: Kriteria[];
  weights: Record<number, number>;
  onChange: (id_kriteria: number, value: number) => void;
}

export default function WeightInput({ kriteriaList, weights, onChange }: WeightInputProps) {
  const total = kriteriaList.reduce((sum, k) => sum + (weights[k.id_kriteria] ?? k.bobot), 0);

  return (
    <div className="space-y-3">
      {kriteriaList.map((k) => (
        <div
          key={k.id_kriteria}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-800">{k.nama}</p>
              <Badge variant={k.tipe === 'benefit' ? 'success' : 'warning'}>{k.tipe}</Badge>
            </div>
            <p className="text-xs text-slate-400">{k.kode}</p>
          </div>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={weights[k.id_kriteria] ?? k.bobot}
            onChange={(e) => onChange(k.id_kriteria, Number(e.target.value))}
            className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      ))}
      <p className={`text-xs ${Math.abs(total - 1) < 0.01 ? 'text-emerald-600' : 'text-amber-600'}`}>
        Total bobot: {total.toFixed(2)}{' '}
        {Math.abs(total - 1) < 0.01 ? '✓ pas 1.00' : '(akan dinormalisasi otomatis oleh sistem)'}
      </p>
    </div>
  );
}