import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8', className)}>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
