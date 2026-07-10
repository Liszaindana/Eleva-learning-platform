import { Trophy } from 'lucide-react';
import type { RecommendationResultItem } from '../../types/recommendation';
import Badge from '../ui/Badge';
import { cn } from '../../lib/utils';

interface RankingListProps {
  results: RecommendationResultItem[];
}

const medalStyles: Record<number, string> = {
  1: 'bg-amber-50 text-amber-700 border-amber-200',
  2: 'bg-slate-100 text-slate-700 border-slate-300',
  3: 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function RankingList({ results }: RankingListProps) {
  const maxScore = Math.max(...results.map((r) => r.score), 0.0001);

  return (
    <ol className="space-y-3">
      {results.map((r) => (
        <li
          key={r.id_hasil}
          className={cn(
            'flex items-center gap-4 rounded-2xl border p-4 transition-colors',
            r.ranking <= 3 ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-white'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
              medalStyles[r.ranking] ?? 'bg-slate-50 text-slate-500 border-slate-200'
            )}
          >
            {r.ranking <= 3 ? <Trophy className="h-4 w-4" /> : `#${r.ranking}`}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">
                {r.user?.name ?? `Mentor #${r.user_id}`}
              </p>
              <Badge variant={r.ranking === 1 ? 'success' : 'info'}>
                {(r.score * 100).toFixed(1)}%
              </Badge>
            </div>
            {r.user?.email && <p className="text-xs text-slate-500">{r.user.email}</p>}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-400 transition-all"
                style={{ width: `${(r.score / maxScore) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}