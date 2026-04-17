import { Topbar } from '@/components/topbar';
import { cn } from '@/lib/utils';

/**
 * Phase 3: 査定AIアシスタント (appraisal-tool / appraisal-luxury)
 * 設計書 §3.4 参照。写真 → JAN特定 → 市場相場 → 推奨買取価格。
 */
export default function AppraisalPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'AIエージェント' }, { label: '査定アシスタント' }]}
        actions={
          <>
            <button className="btn hidden sm:inline-flex">工具</button>
            <button className="btn hidden md:inline-flex">ブランド品</button>
            <button className="btn btn-primary">新規査定</button>
          </>
        }
      />

      <div className="page">
        <header className="mb-6 md:mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-subtle">
            Appraisal AI · Phase 3
          </div>
          <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[40px]">
            写真1枚で、<em className="not-italic italic text-accent">査定判断</em>
            を標準化する。
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-muted md:text-[14px]">
            Claude Vision で商品を特定、Market Reference Service で
            複数ソースの相場を並列照会、推奨買取価格・販売価格・粗利率を提示。
            PAUDEL氏・久芳氏の過去査定パターンを学習済み。
          </p>
        </header>

        {/* 現在の査定デモ */}
        <div className="section-head">
          <div className="section-title">現在の査定</div>
          <div className="section-meta">LIVE · 信頼度 94%</div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          {/* 画像プレビュー */}
          <div className="relative flex aspect-square min-h-[240px] flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-line bg-surface">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent-soft to-transparent opacity-30" />
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-80 animate-scan" />
            <svg
              className="relative h-24 w-24 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
            >
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
            <div className="relative font-mono text-[9px] uppercase tracking-[0.2em] text-subtle">
              IMG_2026_0417.jpg
            </div>
            <div className="relative text-[11px] text-muted">Makita 充電式インパクト</div>
          </div>

          {/* 査定結果 */}
          <div className="rounded-lg border border-line bg-surface p-5 md:p-6">
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              AI Appraisal · Confidence 94%
            </span>
            <h2 className="mt-3 font-serif text-[20px] font-medium text-foreground md:text-[24px]">
              Makita TD173DRGX インパクトドライバー 18V
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <PredictionBlock
                label="推奨買取価格"
                value="¥18,500"
                caption="94% 信頼"
                progress={94}
                emphasis
              />
              <PredictionBlock
                label="推奨販売価格"
                value="¥31,800"
                caption="粗利率 41.8% · 想定滞留 28日"
              />
            </div>

            <div className="mt-5 rounded border border-line bg-elevated p-4 text-[12px] leading-relaxed text-muted">
              この価格は、
              <Source>メルカリ直近30日</Source>
              の成約中央値
              <Num>¥32,400</Num>、
              <Source>ヤフオク</Source>
              平均
              <Num>¥30,800</Num>、自社
              <Source>過去3年・福岡インター</Source>
              の同型販売実績
              <Num>¥29,500〜¥33,200</Num>
              を加重平均した根拠です。バッテリー2本付属・付属品欠損なし・外装Bランクを前提。
              <strong className="text-accent">PAUDEL氏の過去査定パターン</strong>
              と照合した結果、通常より+¥1,500高く提示可能と判断（同型を
              <span className="font-mono">平均21日</span>
              で販売完了している実績）。
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button className="btn btn-primary">この価格で買取</button>
              <button className="btn">交渉シナリオ生成</button>
              <button className="btn hidden sm:inline-flex">値段を調整</button>
            </div>
          </div>
        </div>

        {/* 相場ソース詳細 */}
        <div className="section-head">
          <div className="section-title">相場ソース内訳</div>
          <div className="section-meta">Market Reference Service · 5 sources</div>
        </div>

        <div className="table-scroll mb-8 rounded-lg border border-line bg-surface md:mb-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-elevated font-mono text-[10px] uppercase tracking-widest text-subtle">
                <th className="px-4 py-3 text-left md:px-5">ソース</th>
                <th className="px-4 py-3 text-right md:px-5">中央値</th>
                <th className="px-4 py-3 text-right md:px-5">範囲</th>
                <th className="px-4 py-3 text-right md:px-5">サンプル数</th>
                <th className="px-4 py-3 text-left md:px-5">取得</th>
                <th className="px-4 py-3 text-right md:px-5">信頼度</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {sources.map((s) => (
                <tr key={s.name} className="border-b border-line last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3.5 md:px-5">
                    <div className="text-foreground">{s.name}</div>
                    <div className="font-mono text-[10px] text-subtle">{s.kind}</div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-foreground md:px-5">
                    {s.median}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted md:px-5">
                    {s.range}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted md:px-5">
                    {s.sample}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[10px] text-subtle md:px-5">
                    {s.fetchedAt}
                  </td>
                  <td className="px-4 py-3.5 text-right md:px-5">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-elevated">
                        <div
                          className={cn(
                            'h-full',
                            s.confidence >= 85
                              ? 'bg-positive'
                              : s.confidence >= 70
                                ? 'bg-warning'
                                : 'bg-accent',
                          )}
                          style={{ width: `${s.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-muted">{s.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 最近の査定 */}
        <div className="section-head">
          <div className="section-title">最近の査定</div>
          <div className="section-meta">直近24時間 · 全店合計</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recent.map((r) => (
            <div key={r.id} className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                  {r.time}
                </span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 font-mono text-[10px]',
                    r.type === 'tool'
                      ? 'bg-positive-soft text-positive'
                      : 'bg-accent-soft text-accent',
                  )}
                >
                  {r.type === 'tool' ? '工具' : 'ブランド'}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-[16px] font-medium leading-tight text-foreground">
                {r.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-[22px] font-medium tabular-nums text-accent-strong">
                  {r.recommended}
                </span>
                <span className="font-mono text-[10px] text-subtle">推奨</span>
              </div>
              <div className="mt-2 font-mono text-[11px] text-muted">
                実採用: {r.actual}
                <span
                  className={cn(
                    'ml-2',
                    r.diff > 0 ? 'text-positive' : r.diff < 0 ? 'text-accent' : 'text-muted',
                  )}
                >
                  ({r.diff > 0 ? '+' : ''}
                  {r.diff}%)
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11px] text-muted">
                <span>{r.store}</span>
                <span>·</span>
                <span>{r.appraiser}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PredictionBlock({
  label,
  value,
  caption,
  progress,
  emphasis,
}: {
  label: string;
  value: string;
  caption: string;
  progress?: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        emphasis ? 'border-accent/40 bg-critical-soft' : 'border-line bg-elevated',
      )}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
        {label}
      </div>
      <div
        className={cn(
          'mt-2 font-mono text-[28px] font-medium tabular-nums leading-none md:text-[32px]',
          emphasis ? 'text-accent-strong' : 'text-foreground',
        )}
      >
        {value}
      </div>
      {progress !== undefined ? (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-elevated">
          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <div className="mt-2 font-mono text-[11px] text-muted">{caption}</div>
    </div>
  );
}

function Source({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
      [{children}]
    </span>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 rounded bg-canvas px-1 font-mono text-[12px] text-foreground">
      {children}
    </span>
  );
}

const sources = [
  {
    name: 'メルカリ (成約済)',
    kind: 'marketplace',
    median: '¥32,400',
    range: '¥28,000〜¥36,500',
    sample: '127件',
    fetchedAt: '04-17 07:41',
    confidence: 92,
  },
  {
    name: 'ヤフオク',
    kind: 'auction',
    median: '¥30,800',
    range: '¥26,500〜¥34,200',
    sample: '89件',
    fetchedAt: '04-17 07:41',
    confidence: 88,
  },
  {
    name: 'Amazon 新品',
    kind: 'new_retail',
    median: '¥38,500',
    range: '¥36,000〜¥42,000',
    sample: '3件',
    fetchedAt: '04-17 07:41',
    confidence: 75,
  },
  {
    name: '自社 / 福岡インター 3年',
    kind: 'internal',
    median: '¥31,500',
    range: '¥29,500〜¥33,200',
    sample: '18件',
    fetchedAt: '04-17 07:42',
    confidence: 96,
  },
  {
    name: 'アクトツール (競合買取)',
    kind: 'competitor_buy',
    median: '¥17,000',
    range: '¥15,500〜¥18,500',
    sample: '1件',
    fetchedAt: '04-17 07:42',
    confidence: 68,
  },
];

const recent = [
  {
    id: 1,
    time: '07:18',
    type: 'tool',
    name: 'HiKOKI G3610DB 充電式ディスクグラインダー',
    recommended: '¥14,200',
    actual: '¥14,500',
    diff: 2,
    store: '福岡インター',
    appraiser: 'PAUDEL',
  },
  {
    id: 2,
    time: '06:52',
    type: 'luxury',
    name: 'OMEGA スピードマスター プロフェッショナル',
    recommended: '¥342,000',
    actual: '¥335,000',
    diff: -2,
    store: '小倉本店',
    appraiser: '小林',
  },
  {
    id: 3,
    time: '06:04',
    type: 'tool',
    name: 'Makita HR244DRGX 充電式ハンマドリル',
    recommended: '¥22,800',
    actual: '¥22,800',
    diff: 0,
    store: '北九州本店',
    appraiser: '久芳',
  },
  {
    id: 4,
    time: '05:31',
    type: 'luxury',
    name: 'LOUIS VUITTON ネバーフル MM モノグラム',
    recommended: '¥94,500',
    actual: '¥98,000',
    diff: 4,
    store: '天神店',
    appraiser: '高橋',
  },
  {
    id: 5,
    time: '04:17',
    type: 'tool',
    name: 'KTC 9.5sq ソケットセット TB3X15X',
    recommended: '¥8,400',
    actual: '¥8,000',
    diff: -5,
    store: '島根出雲 (FC)',
    appraiser: '浜田',
  },
  {
    id: 6,
    time: '03:42',
    type: 'luxury',
    name: 'CARTIER タンクフランセーズ SM',
    recommended: '¥287,000',
    actual: '¥290,000',
    diff: 1,
    store: '小倉本店',
    appraiser: '小林',
  },
] as const;
