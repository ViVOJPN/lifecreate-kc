import { Topbar } from '@/components/topbar';
import { Kpi } from '@/components/ui/kpi';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { cn } from '@/lib/utils';

/**
 * Phase 2b: 需要予測 (demand-forecast)
 * 設計書 §3.7 参照。
 * 天候予報 × 過去販売履歴 × イベント情報で店舗別・カテゴリ別の需要を予測。
 * 予想乖離が大きいものをアラート化（例: 台風接近で売上-30%予測）。
 */
export default function ForecastPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'AIエージェント' }, { label: '需要予測' }]}
        actions={
          <>
            <button className="btn">店舗: 全17店</button>
            <button className="btn">期間: 今週</button>
            <button className="btn btn-primary">スタッフシフトに連携</button>
          </>
        }
      />

      <div className="px-8 py-10">
        <header className="mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-text-mute">
            Demand Forecast · Phase 2b
          </div>
          <h1 className="font-serif text-[40px] font-medium leading-tight tracking-tight text-foreground">
            <em className="not-italic italic text-accent">天気</em>と<em className="not-italic italic text-accent">イベント</em>
            が、今週の売上を動かす。
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] text-text-dim">
            OpenWeather 7日予報 × 過去3年販売実績 × 地域イベントカレンダーを統合。
            現時点で
            <strong className="text-foreground">3件の乖離アラート</strong>
            、うち
            <strong className="text-accent">1件は台風接近による -34% 予測</strong>
            （信頼度 91%）。
          </p>
        </header>

        {/* アラート (上部) */}
        <div className="section-head">
          <div className="section-title">乖離アラート</div>
          <div className="section-meta">基準: 予測 vs 直近4週平均 · ±20%超</div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <AlertCard
            severity="critical"
            date="04-19 Sat"
            icon="🌀"
            store="ハンズクラフト 宮崎店"
            delta="-34%"
            cause="台風18号 九州南部接近 / 最大風速 35m/s"
            action="営業時間短縮 or 臨時休業の判断を"
            confidence={91}
          />
          <AlertCard
            severity="warning"
            date="04-20 Sun"
            icon="☀️"
            store="エコプラス 小倉本店"
            delta="+28%"
            cause="西日本陶器まつり（小倉北区） / 予想来街 48万人"
            action="貴金属査定スタッフ +2名 / 買取予算を厚めに"
            confidence={84}
          />
          <AlertCard
            severity="positive"
            date="04-21 Mon"
            icon="⚾"
            store="ハンズクラフト 福岡インター店"
            delta="+19%"
            cause="ソフトバンクホークス ホーム開幕戦 / PayPayドーム"
            action="試合帰り動線の駐車場誘導強化"
            confidence={78}
          />
        </div>

        {/* KPIサマリ */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Kpi label="今週予測売上" value="142.8" unit="M円" change="vs 基準線 +3.1%" trend="up" />
          <Kpi label="買取予算必要額" value="28.4" unit="M円" change="+¥4.2M (イベント)" trend="up" />
          <Kpi label="要追加シフト" value="8" unit="名" change="土日 3店舗" trend="flat" />
          <Kpi label="平均信頼度" value="86" unit="%" change="過去4週実績 ±3pt" trend="up" />
        </div>

        {/* 週次予報ヒートマップ */}
        <div className="section-head">
          <div className="section-title">店舗 × 曜日 需要ヒートマップ</div>
          <div className="section-meta">色: 基準日比 · 赤=下振れ / 緑=上振れ</div>
        </div>

        <div className="mb-10 overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-elevated font-mono text-[10px] uppercase tracking-widest text-text-mute">
                <th className="px-4 py-3 text-left">店舗</th>
                <th className="px-4 py-3 text-center">4/17 木</th>
                <th className="px-4 py-3 text-center">4/18 金</th>
                <th className="px-4 py-3 text-center">4/19 土</th>
                <th className="px-4 py-3 text-center">4/20 日</th>
                <th className="px-4 py-3 text-center">4/21 月</th>
                <th className="px-4 py-3 text-center">4/22 火</th>
                <th className="px-4 py-3 text-center">4/23 水</th>
                <th className="px-4 py-3 text-right">週合計</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[11px] tabular-nums">
              {heatmapRows.map((row) => (
                <tr key={row.store} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-sans text-[12px] text-foreground">{row.store}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="px-4 py-2 text-center">
                      <span
                        className={cn(
                          'inline-block w-14 rounded py-1.5 text-[10px] font-semibold',
                          heatColor(v),
                        )}
                      >
                        {v > 0 ? '+' : ''}
                        {v}%
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right text-foreground">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 週次天気+イベント */}
        <div className="section-head">
          <div className="section-title">7日間 天候 × イベント</div>
          <div className="section-meta">OpenWeather + 地域キュレーション</div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {weekForecast.map((d) => (
            <div
              key={d.date}
              className={cn(
                'rounded-lg border p-4',
                d.alert ? 'border-accent/40 bg-critical-soft' : 'border-border bg-surface',
              )}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
                {d.date}
              </div>
              <div className="my-3 text-[32px]">{d.icon}</div>
              <div className="font-mono text-[14px] text-foreground">
                {d.tempMax}° / {d.tempMin}°
              </div>
              <div className="mt-1 font-mono text-[10px] text-text-dim">
                降水 {d.rain}%
              </div>
              {d.event ? (
                <div className="mt-3 border-t border-border pt-3 text-[11px] leading-tight text-text-dim">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-accent">
                    EVENT
                  </div>
                  {d.event}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AlertCard({
  severity,
  date,
  icon,
  store,
  delta,
  cause,
  action,
  confidence,
}: {
  severity: 'critical' | 'warning' | 'positive';
  date: string;
  icon: string;
  store: string;
  delta: string;
  cause: string;
  action: string;
  confidence: number;
}) {
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-5',
        severity === 'critical'
          ? 'border-accent/40 bg-critical-soft'
          : severity === 'warning'
            ? 'border-warning/40 bg-warning-soft'
            : 'border-positive/40 bg-positive-soft',
      )}
    >
      <div className="flex items-center justify-between">
        <SeverityBadge severity={severity} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-mute">
          {date}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[32px] leading-none">{icon}</span>
        <div>
          <div className="text-[13px] text-foreground">{store}</div>
          <div
            className={cn(
              'font-mono text-[26px] font-medium leading-tight tabular-nums',
              severity === 'critical'
                ? 'text-accent'
                : severity === 'warning'
                  ? 'text-warning'
                  : 'text-positive',
            )}
          >
            {delta}
          </div>
        </div>
      </div>
      <p className="text-[12px] leading-relaxed text-text-dim">{cause}</p>
      <div className="rounded border border-border bg-bg-elevated/60 p-3">
        <div className="font-mono text-[9px] uppercase tracking-widest text-text-mute">
          推奨アクション
        </div>
        <p className="mt-1 text-[12px] text-foreground">{action}</p>
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] text-text-mute">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-elevated">
          <div
            className="h-full bg-accent"
            style={{ width: `${confidence}%` }}
          />
        </div>
        信頼度 {confidence}%
      </div>
    </article>
  );
}

function heatColor(v: number): string {
  if (v <= -20) return 'bg-accent/80 text-white';
  if (v <= -10) return 'bg-critical-soft text-accent';
  if (v <= -5) return 'bg-warning-soft text-warning';
  if (v < 5) return 'bg-surface-hover text-text-dim';
  if (v < 15) return 'bg-positive-soft text-positive';
  return 'bg-positive/80 text-[#0A0A0A]';
}

const heatmapRows = [
  {
    store: 'ハンズクラフト 福岡インター店',
    values: [2, 5, 8, 12, 19, -2, 0],
    total: '¥51.2M',
  },
  {
    store: 'ハンズクラフト 北九州本店',
    values: [1, 3, 10, 14, 4, 1, -1],
    total: '¥62.8M',
  },
  {
    store: 'ハンズクラフト 宮崎店',
    values: [-3, -8, -34, -22, 3, 5, 2],
    total: '¥24.1M',
  },
  {
    store: 'エコプラス 小倉本店',
    values: [0, 4, 18, 28, 2, -1, 0],
    total: '¥86.4M',
  },
  {
    store: 'ハンズクラフト 豊見城店',
    values: [3, 2, 6, 9, 4, 0, -2],
    total: '¥28.9M',
  },
  {
    store: 'ハンズクラフト 島根出雲店 (FC)',
    values: [-1, 2, 4, 6, 3, 0, 1],
    total: '¥19.5M',
  },
];

const weekForecast = [
  { date: '4/17 木', icon: '⛅', tempMax: 21, tempMin: 12, rain: 20, event: null, alert: false },
  { date: '4/18 金', icon: '🌤', tempMax: 23, tempMin: 13, rain: 10, event: null, alert: false },
  {
    date: '4/19 土',
    icon: '🌀',
    tempMax: 19,
    tempMin: 15,
    rain: 95,
    event: '台風18号 九州南部接近',
    alert: true,
  },
  {
    date: '4/20 日',
    icon: '☀️',
    tempMax: 26,
    tempMin: 14,
    rain: 0,
    event: '西日本陶器まつり / 小倉',
    alert: false,
  },
  {
    date: '4/21 月',
    icon: '☀️',
    tempMax: 25,
    tempMin: 13,
    rain: 0,
    event: 'SBホークス ホーム開幕',
    alert: false,
  },
  { date: '4/22 火', icon: '⛅', tempMax: 22, tempMin: 12, rain: 30, event: null, alert: false },
  { date: '4/23 水', icon: '🌧', tempMax: 18, tempMin: 11, rain: 80, event: null, alert: false },
];
