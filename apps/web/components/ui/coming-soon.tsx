import Link from 'next/link';
import { PhaseBanner, type PhaseStatus } from './phase-banner';

export function ComingSoon({
  phase,
  status = 'planned',
  title,
  summary,
  features,
  dependencies,
}: {
  phase: string;
  status?: PhaseStatus;
  title: string;
  summary: string;
  features: { label: string; description: string }[];
  dependencies?: string[];
}) {
  return (
    <div className="page">
      <PhaseBanner phase={phase} status={status} />

      <h1 className="mt-4 font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[40px]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted md:text-[14px]">
        {summary}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.label}
            className="rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong"
          >
            <div className="font-serif text-[15px] font-medium text-foreground md:text-[16px]">
              {f.label}
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-muted">
              {f.description}
            </div>
          </div>
        ))}
      </div>

      {dependencies && dependencies.length > 0 ? (
        <div className="mt-8 rounded-lg border border-line bg-surface p-5 md:mt-10">
          <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
            実装の前提
          </div>
          <ul className="mt-3 space-y-2 text-[12px] text-muted">
            {dependencies.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="shrink-0 text-accent">›</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
        <Link href="/briefing" className="btn">
          朝の3つの示唆へ
        </Link>
        <Link href="/chat" className="btn">
          AIに質問する
        </Link>
      </div>
    </div>
  );
}
