import { FileText, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface AssignmentCardProps {
  id: number;
  title: string;
  courseTitle: string;
  minScore: number;
  score?: number;
  isPassed?: boolean;
  onTakeClick?: () => void;
}

export default function AssignmentCard({
  title,
  courseTitle,
  minScore,
  score,
  isPassed,
  onTakeClick,
}: AssignmentCardProps) {
  const hasTaken = score !== undefined;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
          <FileText className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-500 font-medium">{courseTitle}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Min Score: {minScore}</span>
            {hasTaken && (
              <Badge variant={isPassed ? 'success' : 'danger'} className="text-[9px] px-2 py-0.5 font-bold uppercase">
                {isPassed ? `Passed: ${score}` : `Failed: ${score}`}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-end">
        {hasTaken ? (
          <Button variant="secondary" size="sm" disabled className="text-xs">
            Completed
          </Button>
        ) : (
          <Button size="sm" className="text-xs font-semibold flex items-center gap-1" onClick={onTakeClick}>
            Take Exam
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
