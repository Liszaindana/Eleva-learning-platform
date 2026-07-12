import { CheckCircle2, Circle } from 'lucide-react';

interface Milestone {
  id: number;
  label: string;
  isCompleted: boolean;
}

interface MilestoneCardProps {
  title: string;
  milestones: Milestone[];
}

export default function MilestoneCard({ title, milestones }: MilestoneCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="flex items-center gap-3">
            {milestone.isCompleted ? (
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-4.5 w-4.5 text-slate-300 shrink-0" />
            )}
            <span className={`text-xs font-semibold ${milestone.isCompleted ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
              {milestone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
