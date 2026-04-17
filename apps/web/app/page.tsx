export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12">
          <div className="mb-2 text-sm font-medium text-brand-500">
            LIFECREATE INTELLIGENCE
          </div>
          <h1 className="text-4xl font-bold text-neutral-800">
            AI経営ダッシュボード
          </h1>
          <p className="mt-3 text-neutral-600">
            株式会社ライフクリエイト — 日本一の御用聞き会社になる。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <a href="/briefing" className="card hover:border-brand-500 transition-colors">
            <div className="text-sm font-medium text-brand-500">MVP</div>
            <h2 className="mt-2 text-lg font-bold text-neutral-800">
              朝の3つの示唆
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              経営陣向けの日次AIブリーフ。
            </p>
          </a>

          <div className="card opacity-60">
            <div className="text-sm font-medium text-neutral-500">Phase 2</div>
            <h2 className="mt-2 text-lg font-bold text-neutral-800">対話分析</h2>
            <p className="mt-2 text-sm text-neutral-600">
              自然言語でBIを深掘り。
            </p>
          </div>

          <div className="card opacity-60">
            <div className="text-sm font-medium text-neutral-500">Phase 3</div>
            <h2 className="mt-2 text-lg font-bold text-neutral-800">
              査定アシスタント
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              工具/ブランド品の価格査定。
            </p>
          </div>
        </div>

        <footer className="mt-16 border-t border-border pt-6 text-xs text-neutral-500">
          © 株式会社ライフクリエイト / ViVO × シーズグローバルコネクト
        </footer>
      </div>
    </main>
  );
}
