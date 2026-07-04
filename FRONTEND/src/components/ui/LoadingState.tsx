import { cn } from '../../lib/utils';

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export default function LoadingState({ text = 'Memuat...', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-20',
        className
      )}
    >
      {/* Animated spinner */}
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-500 animate-pulse">{text}</p>
    </div>
  );
}
