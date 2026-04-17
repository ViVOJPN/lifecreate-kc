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
    <div className="sticky top-0 z-20 border-b border-line bg-canvas/80 px-4 py-3 backdrop-blur md:px-8 lg:top-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-subtle md:text-[11px]">
          {crumbs.map((c, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2">
              {i > 0 ? <span className="text-subtle/60">/</span> : null}
              <span
                className={
                  i === crumbs.length - 1 ? 'text-foreground' : 'text-muted'
                }
              >
                {c.label}
              </span>
            </span>
          ))}
        </div>
        {actions ? (
          <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5 pt-0.5 scrollbar-hide">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
