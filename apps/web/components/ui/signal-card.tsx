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
    <article className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between">
        <SeverityBadge severity={props.severity} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
          {props.category}
        </span>
      </div>

      <h3 className="font-serif text-[20px] font-medium leading-tight tracking-tight text-foreground">
        {props.title}
      </h3>

      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            'font-mono text-[34px] font-medium leading-none tabular-nums',
            props.severity === 'critical'
              ? 'text-accent'
              : props.severity === 'warning'
                ? 'text-warning'
                : 'text-positive',
          )}
        >
          {props.metric}
          {props.metricUnit ? (
            <span className="ml-0.5 text-[14px] text-text-dim">
              {props.metricUnit}
            </span>
          ) : null}
        </span>
        {props.delta ? (
          <span
            className={cn(
              'rounded px-1.5 py-0.5 font-mono text-[10px] font-medium',
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

      <p className="text-[13px] leading-relaxed text-text-dim">{props.body}</p>

      {props.actions && props.actions.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
          {props.actions.map((a) => (
            <button
              key={a}
              className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-text-dim transition-colors hover:bg-surface-hover hover:text-accent"
            >
              {a}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
