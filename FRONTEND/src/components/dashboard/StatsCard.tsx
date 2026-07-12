import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50 border-blue-100/50',
    iconBg: 'bg-blue-500 text-white',
    text: 'text-blue-700',
  },
  amber: {
    bg: 'bg-amber-50 border-amber-100/50',
    iconBg: 'bg-amber-500 text-white',
    text: 'text-amber-700',
  },
  emerald: {
    bg: 'bg-emerald-50 border-emerald-100/50',
    iconBg: 'bg-emerald-500 text-white',
    text: 'text-emerald-700',
  },
  purple: {
    bg: 'bg-purple-50 border-purple-100/50',
    iconBg: 'bg-purple-500 text-white',
    text: 'text-purple-700',
  },
  rose: {
    bg: 'bg-rose-50 border-rose-100/50',
    iconBg: 'bg-rose-500 text-white',
    text: 'text-rose-700',
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
}: StatsCardProps) {
  const styles = colorMap[color];

  return (
    <div className={`p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between gap-4 ${styles.bg}`}>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
      </div>
      <div className={`p-3.5 rounded-xl shrink-0 ${styles.iconBg} shadow-inner`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
