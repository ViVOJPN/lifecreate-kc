/**
 * 朝の3つの示唆（MVP Phase 1b）
 * 現状はダミー表示。morning-brief エージェント実装後にシグナル連携する。
 */
export default function BriefingPage() {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <div className="text-sm text-neutral-600">{today}</div>
          <h1 className="mt-1 text-3xl font-bold text-neutral-800">
            朝の3つの示唆
          </h1>
        </div>

        <div className="space-y-4">
          {[
            {
              severity: 'critical',
              label: 'CRITICAL',
              title: '（実装予定）ブランド品カテゴリの滞留在庫が急増',
            },
            {
              severity: 'warning',
              label: 'WARNING',
              title: '（実装予定）福岡インター店の会員登録率が基準比-35%',
            },
            {
              severity: 'positive',
              label: 'POSITIVE',
              title: '（実装予定）Google口コミ評価が7日移動平均で+0.3pt',
            },
          ].map((signal, i) => (
            <article key={i} className="card">
              <div
                className={
                  signal.severity === 'critical'
                    ? 'text-xs font-bold text-brand-500'
                    : signal.severity === 'warning'
                      ? 'text-xs font-bold text-amber-600'
                      : 'text-xs font-bold text-emerald-600'
                }
              >
                {signal.label}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-neutral-800">
                {signal.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                morning-brief エージェント実装後、ai_signals テーブルから自動生成される。
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
