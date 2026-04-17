import { SeverityBadge, type Severity } from './severity-badge';
import { cn } from '@/lib/utils';

export type SignalCardProps = {
  severity: Severity;
  category: string;
  title: React.ReactNode;
  metric: string;
  metricUnit?: string;
  delta?: { label: string; trend?: 'up' | 'down' };
  body: string;
  chart?: React.ReactNode;
  actions?: string[];
};

export function SignalCard(props: SignalCardProps) {
  return (
    <article className="group flex flex-col gap-3.5 rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-2">
        <SeverityBadge severity={props.severity} />
        <span className="truncate font-mono text-[10px] uppercase tracking-widest text-subtle">
          {props.category}
        </span>
      </div>

      <h3 className="font-serif text-[18px] font-medium leading-tight tracking-tight text-foreground md:text-[20px]">
        {props.title}
      </h3>

      <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
        <span
          className={cn(
            'font-mono text-[28px] font-medium leading-none tabular-nums md:text-[34px]',
            props.severity === 'critical'
              ? 'text-accent'
              : props.severity === 'warning'
                ? 'text-warning'
                : 'text-positive',
          )}
        >
          {props.metric}
          {props.metricUnit ? (
            <span className="ml-0.5 text-[13px] text-muted md:text-[14px]">
              {props.metricUnit}
            </span>
          ) : null}
        </span>
        {props.delta ? (
          <span
            className={cn(
              'rounded px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap',
              props.delta.trend === 'down'
                ? 'bg-critical-soft text-accent'
                : 'bg-positive-soft text-positive',
            )}
          >
            {props.delta.trend === 'down' ? '▼' : '▲'} {props.delta.label}
          </span>
        ) : null}
      </div>

      {props.chart ? <div>{props.chart}</div> : null}

      <p className="text-[13px] leading-relaxed text-muted">{props.body}</p>

      {props.actions && props.actions.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-3">
          {props.actions.map((a) => (
            <button
              key={a}
              className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:bg-surface-hover hover:text-accent"
            >
              {a}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
