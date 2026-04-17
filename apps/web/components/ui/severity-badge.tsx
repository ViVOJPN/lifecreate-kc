import { cn } from '@/lib/utils';

export type Severity = 'critical' | 'warning' | 'positive';

const styleMap: Record<Severity, string> = {
  critical: 'bg-critical-soft text-accent border border-accent/40',
  warning: 'bg-warning-soft text-warning border border-warning/40',
  positive: 'bg-positive-soft text-positive border border-positive/40',
};

const labelMap: Record<Severity, string> = {
  critical: 'CRITICAL',
  warning: 'WATCH',
  positive: 'OPPORTUNITY',
};

export function SeverityBadge({
  severity,
  label,
  className,
}: {
  severity: Severity;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest whitespace-nowrap',
        styleMap[severity],
        className,
      )}
    >
      {label ?? labelMap[severity]}
    </span>
  );
}
