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
    <div className="rounded-lg border border-line bg-surface p-4 md:p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
        {label}
      </div>
      <div className="mt-2.5 font-mono text-[24px] font-medium tabular-nums leading-none tracking-tight text-foreground md:mt-3 md:text-[30px]">
        {value}
        {unit ? (
          <span className="ml-1 text-[13px] text-muted md:text-[14px]">{unit}</span>
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
                : 'text-muted',
          )}
        >
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {change}
        </div>
      ) : null}
    </div>
  );
}
