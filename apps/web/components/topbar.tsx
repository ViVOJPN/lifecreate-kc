export type Breadcrumb = {
  label: string;
  href?: string;
};

export function Topbar({
  crumbs,
  actions,
}: {
  crumbs: Breadcrumb[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg/80 px-8 py-3 backdrop-blur">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-mute">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 ? <span className="text-text-mute/60">/</span> : null}
            <span
              className={
                i === crumbs.length - 1 ? 'text-foreground' : 'text-text-dim'
              }
            >
              {c.label}
            </span>
          </span>
        ))}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
