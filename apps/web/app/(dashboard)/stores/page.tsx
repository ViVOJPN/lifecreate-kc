import { Topbar } from '@/components/topbar';
import { cn } from '@/lib/utils';

export default function StoresPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'Intelligence' }, { label: '店舗マップ' }]}
        actions={
          <>
            <button className="btn hidden sm:inline-flex">全て</button>
            <button className="btn hidden md:inline-flex">要注意のみ</button>
            <button className="btn btn-primary">地図表示</button>
          </>
        }
      />

      <div className="page">
        <header className="mb-6 md:mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-subtle">
            Store Health · 17 stores
          </div>
          <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[40px]">
            <em className="not-italic italic text-accent">ヘルススコア</em>で、店舗の今を一望する。
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-muted md:text-[14px]">
            売上・属人化・会員化・口コミを合成した
            <strong className="text-foreground">AIヘルススコア</strong>
            と、店舗ごとのアラート件数を一覧化。クリックで詳細分析に遷移します。
          </p>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-3 md:mb-10 md:gap-4 lg:grid-cols-4">
          <SummaryCard label="直営店" value="14" unit="店" tone="default" />
          <SummaryCard label="FC加盟店" value="3" unit="店" tone="accent" />
          <SummaryCard label="ヘルス 60未満" value="3" unit="店" tone="critical" />
          <SummaryCard label="今日のアラート" value="7" unit="件" tone="warning" />
        </div>

        <div className="section-head">
          <div className="section-title">店舗ヘルス指標</div>
          <div className="section-meta">AI-scored · 更新 07:42</div>
        </div>

        <div className="table-scroll rounded-lg border border-line bg-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-elevated font-mono text-[10px] uppercase tracking-widest text-subtle">
                <th className="px-4 py-3 text-left md:px-5">店舗</th>
                <th className="px-4 py-3 text-left md:px-5">ヘルス</th>
                <th className="px-4 py-3 text-right md:px-5">売上(前月)</th>
                <th className="px-4 py-3 text-left md:px-5">査定属人化</th>
                <th className="px-4 py-3 text-right md:px-5">会員化率</th>
                <th className="px-4 py-3 text-left md:px-5">アラート</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {stores.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3.5 md:px-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground">{s.name}</span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest',
                          s.type === 'direct'
                            ? 'bg-surface-hover text-muted'
                            : 'bg-accent-soft text-accent',
                        )}
                      >
                        {s.typeLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 md:px-5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 font-mono tabular-nums text-foreground">
                        {s.health}
                      </span>
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-elevated">
                        <div
                          className={cn(
                            'h-full',
                            s.health >= 75
                              ? 'bg-positive'
                              : s.health >= 60
                                ? 'bg-warning'
                                : 'bg-accent',
                          )}
                          style={{ width: `${s.health}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted md:px-5">
                    {s.revenue}
                  </td>
                  <td className="px-4 py-3.5 md:px-5">
                    <div className="flex items-center gap-2">
                      <StaffDots ratio={s.concentration} />
                      <span
                        className={cn(
                          'font-mono text-[11px]',
                          s.concentration >= 70
                            ? 'text-accent'
                            : s.concentration >= 60
                              ? 'text-warning'
                              : 'text-positive',
                        )}
                      >
                        {s.concentration}%
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3.5 text-right font-mono tabular-nums md:px-5',
                      s.memberRate < 1
                        ? 'text-accent'
                        : s.memberRate >= 10
                          ? 'text-positive'
                          : 'text-foreground',
                    )}
                  >
                    {s.memberRate.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 text-[11px] md:px-5">
                    {s.alert ? (
                      <span
                        className={cn(
                          s.alertSeverity === 'critical'
                            ? 'text-accent'
                            : s.alertSeverity === 'warning'
                              ? 'text-warning'
                              : 'text-subtle',
                        )}
                      >
                        {s.alert}
                      </span>
                    ) : (
                      <span className="text-subtle">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[10px] text-subtle">
          * ヘルススコア = 売上成長率 × 粗利率 × 属人化逆指数 × 会員化率 × 口コミ平均 (重み付き合成、0-100)
        </p>
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: 'default' | 'accent' | 'critical' | 'warning';
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 md:p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
        {label}
      </div>
      <div
        className={cn(
          'mt-3 font-mono text-[26px] font-medium leading-none tabular-nums md:text-[30px]',
          tone === 'accent'
            ? 'text-accent'
            : tone === 'critical'
              ? 'text-accent'
              : tone === 'warning'
                ? 'text-warning'
                : 'text-foreground',
        )}
      >
        {value}
        <span className="ml-1 text-[13px] text-muted md:text-[14px]">{unit}</span>
      </div>
    </div>
  );
}

function StaffDots({ ratio }: { ratio: number }) {
  const active = Math.round((ratio / 100) * 5);
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            i < active ? 'bg-warning' : 'bg-line-strong',
          )}
        />
      ))}
    </span>
  );
}

const stores = [
  {
    id: 1,
    name: 'ハンズクラフト 福岡インター店',
    type: 'direct',
    typeLabel: '直営',
    health: 48,
    revenue: '¥7,200K',
    concentration: 74,
    memberRate: 0.0,
    alert: '⚠ 2件',
    alertSeverity: 'critical',
  },
  {
    id: 2,
    name: 'ハンズクラフト 北九州本店',
    type: 'direct',
    typeLabel: '直営',
    health: 76,
    revenue: '¥11,800K',
    concentration: 52,
    memberRate: 11.8,
    alert: null,
    alertSeverity: null,
  },
  {
    id: 3,
    name: 'ハンズクラフト 島根出雲店',
    type: 'fc',
    typeLabel: 'FC1号店',
    health: 62,
    revenue: '¥4,100K',
    concentration: 68,
    memberRate: 4.2,
    alert: '◎ FC初期警戒',
    alertSeverity: 'warning',
  },
  {
    id: 4,
    name: 'エコプラス 小倉本店',
    type: 'direct',
    typeLabel: '直営',
    health: 82,
    revenue: '¥18,400K',
    concentration: 44,
    memberRate: 14.6,
    alert: null,
    alertSeverity: null,
  },
  {
    id: 5,
    name: 'ハンズクラフト 宮崎店',
    type: 'direct',
    typeLabel: '直営・新規',
    health: 55,
    revenue: '¥3,800K',
    concentration: 61,
    memberRate: 6.1,
    alert: '◎ 立ち上げ期',
    alertSeverity: 'warning',
  },
  {
    id: 6,
    name: 'ハンズクラフト 豊見城店',
    type: 'direct',
    typeLabel: '直営・新規',
    health: 70,
    revenue: '¥5,900K',
    concentration: 49,
    memberRate: 9.3,
    alert: null,
    alertSeverity: null,
  },
  {
    id: 7,
    name: 'エコプラス 天神店',
    type: 'direct',
    typeLabel: '直営',
    health: 78,
    revenue: '¥14,200K',
    concentration: 51,
    memberRate: 13.1,
    alert: null,
    alertSeverity: null,
  },
  {
    id: 8,
    name: 'ライフサポート 北九州拠点',
    type: 'direct',
    typeLabel: '直営',
    health: 74,
    revenue: '¥6,800K',
    concentration: 38,
    memberRate: 8.4,
    alert: null,
    alertSeverity: null,
  },
] as const;
