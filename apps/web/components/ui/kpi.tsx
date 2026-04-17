import { cn } from '@/lib/utils';

export function Kpi({
  label,
  value,
  unit,
  change,
  trend,
}: {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
        {label}
      </div>
      <div className="mt-3 font-mono text-[30px] font-medium tabular-nums tracking-tight text-foreground">
        {value}
        {unit ? (
          <span className="ml-1 text-[14px] text-text-dim">{unit}</span>
        ) : null}
      </div>
      {change ? (
        <div
          className={cn(
            'mt-2 font-mono text-[11px]',
            trend === 'up'
              ? 'text-positive'
              : trend === 'down'
                ? 'text-accent'
                : 'text-text-dim',
          )}
        >
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {change}
        </div>
      ) : null}
    </div>
  );
}
