import { Topbar } from '@/components/topbar';
import { Kpi } from '@/components/ui/kpi';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { cn } from '@/lib/utils';

/**
 * Phase 2a: 広告ROI最適化 (ad-roi-optimizer)
 * 設計書 §3.6 参照。
 * Google Ads / Yahoo広告 の費用データ × POS売上 × GA4流入を紐付けて
 * キャンペーン別ROASを算出、予算再配分を示唆する。
 */
export default function AdsPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'AIエージェント' }, { label: '広告ROI' }]}
        actions={
          <>
            <button className="btn">期間: 直近30日</button>
            <button className="btn">媒体フィルタ</button>
            <button className="btn btn-primary">再配分案を提示</button>
          </>
        }
      />

      <div className="px-8 py-10">
        <header className="mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-mute">
            Ad ROI Optimizer · Phase 2a
          </div>
          <h1 className="font-serif text-[40px] font-medium leading-tight tracking-tight text-foreground">
            広告費が<em className="not-italic italic text-accent">来店</em>と<em className="not-italic italic text-accent">買取</em>
            にいくら繋がったか。
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-text-dim">
            Google Ads · Yahoo広告の費用を、GA4流入 × POS売上 × 会員紐付けと突合。
            AI が<strong className="text-foreground">予算再配分で +¥430K の増収</strong>
            を見込める組み合わせを検出しました。
          </p>
        </header>

        {/* KPIサマリ */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Kpi label="広告費 / 30日" value="1,180" unit="K円" change="予算内 (1,200K)" trend="up" />
          <Kpi label="紐付け売上" value="4,820" unit="K円" change="YoY +42%" trend="up" />
          <Kpi label="ROAS (全体)" value="4.08" unit="x" change="業界平均 3.5x" trend="up" />
          <Kpi label="CPA (新規会員)" value="1,240" unit="円" change="-18% MoM" trend="up" />
        </div>

        {/* キャンペーン別ROASテーブル */}
        <div className="section-head">
          <div className="section-title">キャンペーン別 ROAS</div>
          <div className="section-meta">Google Ads · Yahoo広告 · 直近30日</div>
        </div>

        <div className="mb-10 overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-elevated font-mono text-[10px] uppercase tracking-widest text-text-mute">
                <th className="px-5 py-3 text-left">キャンペーン</th>
                <th className="px-5 py-3 text-left">媒体</th>
                <th className="px-5 py-3 text-right">費用</th>
                <th className="px-5 py-3 text-right">Clicks</th>
                <th className="px-5 py-3 text-right">来店</th>
                <th className="px-5 py-3 text-right">紐付け売上</th>
                <th className="px-5 py-3 text-right">ROAS</th>
                <th className="px-5 py-3 text-left">AI判定</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                  <td className="px-5 py-3.5">
                    <div className="text-foreground">{c.name}</div>
                    <div className="font-mono text-[10px] text-text-mute">{c.target}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'rounded border px-1.5 py-0.5 font-mono text-[10px]',
                        c.platform === 'Google'
                          ? 'border-positive/40 bg-positive-soft text-positive'
                          : c.platform === 'Yahoo'
                            ? 'border-info/40 bg-[rgba(107,140,176,0.1)] text-info'
                            : 'border-border bg-surface-hover text-text-dim',
                      )}
                    >
                      {c.platform}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-dim">
                    {c.cost}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-dim">
                    {c.clicks}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-dim">
                    {c.visits}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-foreground">
                    {c.revenue}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums font-semibold">
                    <span
                      className={cn(
                        c.roas >= 5
                          ? 'text-positive'
                          : c.roas >= 2
                            ? 'text-foreground'
                            : 'text-accent',
                      )}
                    >
                      {c.roas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {c.decision === 'increase' ? (
                      <SeverityBadge severity="positive" label="増額" />
                    ) : c.decision === 'decrease' ? (
                      <SeverityBadge severity="critical" label="減額" />
                    ) : (
                      <SeverityBadge severity="warning" label="維持" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI再配分示唆 */}
        <div className="section-head">
          <div className="section-title">AI 予算再配分プラン</div>
          <div className="section-meta">期待増収 +¥430K / 30日 · 追加投資なし</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-accent/40 bg-critical-soft p-6">
            <div className="mb-3 flex items-center gap-2">
              <SeverityBadge severity="critical" label="削減" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
                -¥180K
              </span>
            </div>
            <h3 className="font-serif text-[17px] font-medium text-foreground">
              「ハンズクラフト 工具 買取」Yahoo検索
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-text-dim">
              ROAS 1.3x（業界平均 3.5x 未達）。Clicks 1,420 に対し来店 11件のみ。
              キーワードマッチタイプが広すぎる可能性。一旦停止を推奨。
            </p>
          </div>
          <div className="rounded-lg border border-positive/40 bg-positive-soft p-6">
            <div className="mb-3 flex items-center gap-2">
              <SeverityBadge severity="positive" label="増額" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
                +¥180K (シフト)
              </span>
            </div>
            <h3 className="font-serif text-[17px] font-medium text-foreground">
              「エコプラス 貴金属 高価買取」Google検索
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-text-dim">
              ROAS 8.7x。同キーワードで小倉本店の 30 代女性来店が集中。
              予算 +50% で CPA 悪化せず増収が見込めると予測（信頼度 89%）。
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
            制約事項
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-text-dim">
            ROAS 算出には POS「会員ID」との紐付けが必要。2024年4月以降の福岡インター店分は
            <span className="text-accent">会員データ断絶</span>
            により一部推計（GA4 来店イベント × 平均客単価）。代理店運用の場合、キャンペーン名の命名規則を統一すると精度が向上します。
          </p>
        </div>
      </div>
    </>
  );
}

const campaigns = [
  {
    id: 1,
    name: 'エコプラス 貴金属 高価買取',
    target: '小倉本店 30代女性',
    platform: 'Google',
    cost: '¥218K',
    clicks: '2,840',
    visits: '184',
    revenue: '¥1,890K',
    roas: 8.7,
    decision: 'increase',
  },
  {
    id: 2,
    name: 'ハンズクラフト 工具 ブランド検索',
    target: '九州圏',
    platform: 'Google',
    cost: '¥156K',
    clicks: '1,920',
    visits: '96',
    revenue: '¥724K',
    roas: 4.6,
    decision: 'hold',
  },
  {
    id: 3,
    name: 'FC島根出雲店 オープニング',
    target: '島根県',
    platform: 'Yahoo',
    cost: '¥98K',
    clicks: '1,180',
    visits: '62',
    revenue: '¥410K',
    roas: 4.2,
    decision: 'hold',
  },
  {
    id: 4,
    name: 'ハンズクラフト 工具 買取',
    target: '全国 / 広域',
    platform: 'Yahoo',
    cost: '¥180K',
    clicks: '1,420',
    visits: '11',
    revenue: '¥238K',
    roas: 1.3,
    decision: 'decrease',
  },
  {
    id: 5,
    name: 'ROLEX デイトジャスト 買取',
    target: '福岡 / 北九州',
    platform: 'Google',
    cost: '¥142K',
    clicks: '980',
    visits: '48',
    revenue: '¥820K',
    roas: 5.8,
    decision: 'increase',
  },
  {
    id: 6,
    name: 'ライフサポート 遺品整理',
    target: '九州圏 50代+',
    platform: 'Google',
    cost: '¥96K',
    clicks: '612',
    visits: '38',
    revenue: '¥420K',
    roas: 4.4,
    decision: 'hold',
  },
  {
    id: 7,
    name: 'リマーケティング (POS来店会員)',
    target: '既存会員',
    platform: 'Google',
    cost: '¥84K',
    clicks: '2,180',
    visits: '120',
    revenue: '¥680K',
    roas: 8.1,
    decision: 'increase',
  },
  {
    id: 8,
    name: 'Yahoo DSP 認知獲得',
    target: '九州圏',
    platform: 'Yahoo',
    cost: '¥206K',
    clicks: '4,820',
    visits: '14',
    revenue: '¥180K',
    roas: 0.9,
    decision: 'decrease',
  },
] as const;
