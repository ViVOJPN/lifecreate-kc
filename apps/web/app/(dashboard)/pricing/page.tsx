import { Topbar } from '@/components/topbar';
import { Kpi } from '@/components/ui/kpi';
import { SeverityBadge } from '@/components/ui/severity-badge';

/**
 * Phase 2b: 値下げタイミング最適化 (Pricing Optimizer)
 * 設計書 §3 pricing-optimizer エージェント。
 * 在庫日数 × 粗利率のバランスから最適な値下げ・業者売りタイミングを推奨。
 */
export default function PricingPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'AIエージェント' }, { label: '値下げタイミング' }]}
        actions={
          <>
            <button className="btn">対象期間</button>
            <button className="btn">店舗フィルタ</button>
            <button className="btn btn-primary">推奨をCSV出力</button>
          </>
        }
      />

      <div className="px-8 py-10">
        <header className="mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-mute">
            Pricing Optimizer · Phase 2b
          </div>
          <h1 className="font-serif text-[40px] font-medium leading-tight tracking-tight text-foreground">
            <em className="not-italic italic text-accent">キャッシュ</em>と<em className="not-italic italic text-accent">粗利</em>
            のジレンマを、AIが解く。
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-text-dim">
            在庫日数と粗利率の関係を学習し、滞留在庫1,260点の中から
            <strong className="text-foreground">今週値下げすべき 47 点</strong>
            と、<strong className="text-foreground">業者売り推奨 18 点</strong>
            をAIが選定しました。
          </p>
        </header>

        {/* KPIサマリ */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Kpi label="滞留在庫" value="1,260" unit="点" change="180日+ / 簿価 ¥12.3M" trend="down" />
          <Kpi label="値下げ推奨" value="47" unit="点" change="¥2.1M 現金化見込" trend="up" />
          <Kpi label="業者売り推奨" value="18" unit="点" change="¥1.7M 即時回収" trend="up" />
          <Kpi label="期待キャッシュ改善" value="¥3.8" unit="M" change="向こう30日" trend="up" />
        </div>

        {/* 在庫日数 × 粗利率 チャート */}
        <div className="section-head">
          <div className="section-title">在庫日数 × 粗利率</div>
          <div className="section-meta">福岡インター店 · 2024年 · 5,561件</div>
        </div>

        <div className="relative mb-10 rounded-lg border border-border bg-surface p-6">
          <svg
            viewBox="0 0 1000 220"
            preserveAspectRatio="none"
            className="h-[220px] w-full overflow-visible"
          >
            {[50, 100, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#2A2A2A" strokeWidth="0.5" />
            ))}

            {/* ボリューム (bar) */}
            <rect x="40" y="40" width="120" height="140" fill="#EB031C" opacity="0.15" />
            <rect x="200" y="30" width="120" height="150" fill="#EB031C" opacity="0.18" />
            <rect x="360" y="50" width="120" height="130" fill="#EB031C" opacity="0.22" />
            <rect x="520" y="100" width="120" height="80" fill="#EB031C" opacity="0.3" />
            <rect x="680" y="145" width="120" height="35" fill="#EB031C" opacity="0.4" />
            <rect x="840" y="175" width="120" height="5" fill="#EB031C" opacity="0.5" />

            {/* 粗利率ライン */}
            <polyline
              points="100,80 260,74 420,55 580,52 740,47 900,45"
              stroke="#EB031C"
              strokeWidth="2.5"
              fill="none"
            />
            {[
              [100, 80],
              [260, 74],
              [420, 55],
              [580, 52],
              [740, 47],
              [900, 45],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="4" fill="#EB031C" />
            ))}

            {/* 判定ライン (120日) */}
            <line x1="515" y1="0" x2="515" y2="200" stroke="#D4A34B" strokeWidth="0.8" strokeDasharray="4,3" />
            <text x="520" y="15" fill="#D4A34B" fontSize="10" fontFamily="monospace">
              120日: 業者売り推奨ライン
            </text>

            {[
              ['0-7日', 100],
              ['8-30日', 260],
              ['31-90日', 420],
              ['91-180日', 580],
              ['181-365日', 740],
              ['366日+', 900],
            ].map(([label, x]) => (
              <text
                key={label}
                x={x as number}
                y="215"
                fill="#6A6A6A"
                fontSize="10"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {label}
              </text>
            ))}

            <text x="100" y="70" fill="#EB031C" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="600">
              46.7%
            </text>
            <text x="900" y="35" fill="#EB031C" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="600">
              54.7%
            </text>
          </svg>

          {/* AI annotation */}
          <div className="absolute right-[10%] top-[18%] max-w-[220px] rounded border border-accent/40 bg-bg-elevated/95 p-3 shadow-card backdrop-blur">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-accent">
              AI 示唆
            </div>
            <div className="text-[12px] leading-relaxed text-text-dim">
              滞留するほど粗利率は
              <span className="font-mono text-positive">+8pt</span>
              改善するが、キャッシュ効率と天秤に。
              <div className="mt-2 text-accent">→ 120日で業者売りが最適</div>
            </div>
          </div>
        </div>

        {/* 推奨テーブル */}
        <div className="section-head">
          <div className="section-title">AI 推奨アクション</div>
          <div className="section-meta">重み: 滞留日数 × キャッシュ拘束 × 粗利機会損失 · Top 8</div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-elevated font-mono text-[10px] uppercase tracking-widest text-text-mute">
                <th className="px-5 py-3 text-left">商品</th>
                <th className="px-5 py-3 text-right">簿価</th>
                <th className="px-5 py-3 text-right">滞留</th>
                <th className="px-5 py-3 text-right">現在価格</th>
                <th className="px-5 py-3 text-right">推奨価格</th>
                <th className="px-5 py-3 text-right">メルカリ中央値</th>
                <th className="px-5 py-3 text-left">アクション</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {recommendations.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                  <td className="px-5 py-3.5">
                    <div className="text-foreground">{r.name}</div>
                    <div className="font-mono text-[10px] text-text-mute">{r.sku}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-dim">
                    {r.bookValue}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums">
                    <span className={r.days >= 180 ? 'text-accent' : r.days >= 120 ? 'text-warning' : 'text-positive'}>
                      {r.days}日
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-dim line-through">
                    {r.currentPrice}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-accent-strong">
                    {r.recommendedPrice}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-dim">
                    {r.marketMedian}
                  </td>
                  <td className="px-5 py-3.5">
                    {r.action === 'markdown' ? (
                      <SeverityBadge severity="warning" label="値下げ" />
                    ) : r.action === 'wholesale' ? (
                      <SeverityBadge severity="critical" label="業者売り" />
                    ) : (
                      <SeverityBadge severity="positive" label="継続" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[10px] text-text-mute">
          * 相場中央値は オークファン / ヤフオク / メルカリ 直近30日を加重平均（Market Reference
          Service 経由）。信頼度 85% 未満は推奨から除外。
        </p>
      </div>
    </>
  );
}

const recommendations = [
  {
    id: 1,
    name: 'Makita 集塵丸ノコ KS5000FX',
    sku: 'SKU-HC-24081-002',
    bookValue: '¥18,400',
    days: 213,
    currentPrice: '¥32,800',
    recommendedPrice: '¥24,800',
    marketMedian: '¥25,200',
    action: 'markdown',
  },
  {
    id: 2,
    name: 'HiKOKI 充電式インパクト WH18DDL2',
    sku: 'SKU-HC-23112-047',
    bookValue: '¥12,200',
    days: 189,
    currentPrice: '¥22,500',
    recommendedPrice: '¥17,900',
    marketMedian: '¥18,100',
    action: 'markdown',
  },
  {
    id: 3,
    name: 'TORNOS 自動旋盤部品一式',
    sku: 'SKU-HC-22031-218',
    bookValue: '¥38,500',
    days: 421,
    currentPrice: '¥89,000',
    recommendedPrice: '¥42,000',
    marketMedian: '¥38,000',
    action: 'wholesale',
  },
  {
    id: 4,
    name: 'RIDGID パイプレンチ 14インチ',
    sku: 'SKU-HC-23065-080',
    bookValue: '¥4,800',
    days: 167,
    currentPrice: '¥9,800',
    recommendedPrice: '¥7,400',
    marketMedian: '¥7,600',
    action: 'markdown',
  },
  {
    id: 5,
    name: 'ROLEX デイトジャスト 16234 (中古A)',
    sku: 'SKU-EP-24010-003',
    bookValue: '¥480,000',
    days: 72,
    currentPrice: '¥720,000',
    recommendedPrice: '¥720,000',
    marketMedian: '¥735,000',
    action: 'hold',
  },
  {
    id: 6,
    name: 'エルメス バーキン 30 エトゥープ',
    sku: 'SKU-EP-23098-011',
    bookValue: '¥1,180,000',
    days: 324,
    currentPrice: '¥1,480,000',
    recommendedPrice: '¥1,280,000',
    marketMedian: '¥1,310,000',
    action: 'wholesale',
  },
  {
    id: 7,
    name: 'SONY α7 III ILCE-7M3 ボディ',
    sku: 'SKU-HC-23047-122',
    bookValue: '¥68,000',
    days: 51,
    currentPrice: '¥148,000',
    recommendedPrice: '¥148,000',
    marketMedian: '¥149,500',
    action: 'hold',
  },
  {
    id: 8,
    name: 'BOSCH マルチツール GOP 40-30',
    sku: 'SKU-HC-22211-068',
    bookValue: '¥7,300',
    days: 258,
    currentPrice: '¥14,500',
    recommendedPrice: '¥8,900',
    marketMedian: '¥8,700',
    action: 'wholesale',
  },
] as const;
