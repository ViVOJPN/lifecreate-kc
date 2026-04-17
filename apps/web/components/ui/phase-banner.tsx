import { cn } from '@/lib/utils';

export type PhaseStatus = 'planned' | 'in-progress' | 'live';

const statusStyle: Record<PhaseStatus, string> = {
  planned: 'border-line bg-surface text-muted',
  'in-progress': 'border-warning/40 bg-warning-soft text-warning',
  live: 'border-positive/40 bg-positive-soft text-positive',
};

const statusLabel: Record<PhaseStatus, string> = {
  planned: 'PLANNED',
  'in-progress': 'IN PROGRESS',
  live: 'LIVE',
};

export function PhaseBanner({
  phase,
  status,
  className,
}: {
  phase: string;
  status: PhaseStatus;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest',
        statusStyle[status],
        className,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'live'
            ? 'bg-positive'
            : status === 'in-progress'
              ? 'bg-warning'
              : 'bg-subtle',
        )}
      />
      <span>{phase}</span>
      <span className="text-subtle">·</span>
      <span>{statusLabel[status]}</span>
    </div>
  );
}
