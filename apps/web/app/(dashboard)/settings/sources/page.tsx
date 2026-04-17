import { Topbar } from '@/components/topbar';
import { cn } from '@/lib/utils';

export default function SourcesPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: '設定' }, { label: 'データソース' }]}
        actions={
          <>
            <button className="btn hidden sm:inline-flex">同期ログ</button>
            <button className="btn btn-primary">手動同期</button>
          </>
        }
      />

      <div className="page">
        <header className="mb-6 md:mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-subtle">
            Data Sources · Integration Layer
          </div>
          <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[40px]">
            接続している<em className="not-italic italic text-accent">データの肌理</em>
            を、一覧で把握する。
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-muted md:text-[14px]">
            3群の外部ソース（内部運用・市場相場・環境）の接続状態・同期頻度・
            最終取得時刻・エラー率を監視します。障害があれば即時に影響範囲を表示。
          </p>
        </header>

        {groups.map((group) => (
          <div key={group.label} className="mb-8 md:mb-10">
            <div className="section-head">
              <div className="section-title">{group.label}</div>
              <div className="section-meta">{group.meta}</div>
            </div>
            <div className="table-scroll rounded-lg border border-line bg-surface">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line bg-elevated font-mono text-[10px] uppercase tracking-widest text-subtle">
                    <th className="px-4 py-3 text-left md:px-5">ソース</th>
                    <th className="px-4 py-3 text-left md:px-5">接続</th>
                    <th className="px-4 py-3 text-left md:px-5">同期頻度</th>
                    <th className="px-4 py-3 text-left md:px-5">最終同期</th>
                    <th className="px-4 py-3 text-right md:px-5">エラー率 / 30日</th>
                    <th className="px-4 py-3 text-left md:px-5">Phase</th>
                  </tr>
                </thead>
                <tbody className="text-[12px]">
                  {group.sources.map((s) => (
                    <tr key={s.name} className="border-b border-line last:border-0 hover:bg-surface-hover">
                      <td className="px-4 py-3.5 md:px-5">
                        <div className="text-foreground">{s.name}</div>
                        <div className="font-mono text-[10px] text-subtle">{s.kind}</div>
                      </td>
                      <td className="px-4 py-3.5 md:px-5">
                        <StatusPill status={s.status} />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-muted md:px-5">
                        {s.schedule}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-muted md:px-5">
                        {s.lastSync}
                      </td>
                      <td
                        className={cn(
                          'px-4 py-3.5 text-right font-mono tabular-nums md:px-5',
                          s.errorRate >= 5
                            ? 'text-accent'
                            : s.errorRate >= 1
                              ? 'text-warning'
                              : 'text-muted',
                        )}
                      >
                        {s.errorRate.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[10px] uppercase tracking-widest text-muted md:px-5">
                        {s.phase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
            ガバナンス
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            法的リスクソース（メルカリ・ジモティー・競合買取サイト等）は
            <strong className="text-foreground">Integration Layer で隔離</strong>
            されており、ToS変更・法務判断により該当ソースのみ即時停止可能な設計です。
            スクレイピングは robots.txt 遵守、1リクエスト/3秒を下限、
            UserAgent で識別可能な実装としています。
          </p>
        </div>
      </div>
    </>
  );
}

type Status = 'ok' | 'warning' | 'error' | 'disabled';
function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    ok: {
      label: 'OK',
      cls: 'border-positive/40 bg-positive-soft text-positive',
    },
    warning: {
      label: 'WARN',
      cls: 'border-warning/40 bg-warning-soft text-warning',
    },
    error: {
      label: 'ERROR',
      cls: 'border-accent/40 bg-critical-soft text-accent',
    },
    disabled: {
      label: 'DISABLED',
      cls: 'border-line bg-surface-hover text-subtle',
    },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest',
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}

const groups = [
  {
    label: 'A群: 内部運用データ',
    meta: 'POS · TKC · GA4 · 広告 · Google Business',
    sources: [
      {
        name: 'タロスPOS',
        kind: 'CSV export (CP932)',
        status: 'ok' as Status,
        schedule: '日次 01:00',
        lastSync: '04-17 01:02',
        errorRate: 0.0,
        phase: 'Phase 1a',
      },
      {
        name: 'TKC 会計',
        kind: 'API / CSV',
        status: 'disabled' as Status,
        schedule: '月次',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 1a',
      },
      {
        name: 'Google Business Profile',
        kind: 'Google API',
        status: 'ok' as Status,
        schedule: '6時間毎',
        lastSync: '04-17 06:01',
        errorRate: 0.4,
        phase: 'Phase 1b',
      },
      {
        name: 'Google Analytics 4',
        kind: 'GA4 Data API',
        status: 'disabled' as Status,
        schedule: '日次 03:00',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 2a',
      },
      {
        name: 'Google Ads',
        kind: 'Google Ads API',
        status: 'disabled' as Status,
        schedule: '日次 03:00',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 2a',
      },
      {
        name: 'Yahoo広告',
        kind: 'Yahoo API',
        status: 'disabled' as Status,
        schedule: '日次 03:00',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 2a',
      },
    ],
  },
  {
    label: 'B群: 市場相場',
    meta: 'Market Reference Service · 複数ソース統合',
    sources: [
      {
        name: 'オークファン',
        kind: '公式API',
        status: 'ok' as Status,
        schedule: '日次 04:00',
        lastSync: '04-17 04:01',
        errorRate: 1.2,
        phase: 'Phase 1b',
      },
      {
        name: 'ヤフオク',
        kind: '公式API (契約審査)',
        status: 'disabled' as Status,
        schedule: '日次',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 2b',
      },
      {
        name: 'Amazon PA-API',
        kind: 'Amazon Product Advertising API',
        status: 'disabled' as Status,
        schedule: '日次',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 2b',
      },
      {
        name: 'メルカリ',
        kind: '非公式 (法務確認待ち)',
        status: 'warning' as Status,
        schedule: '停止中',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 2c',
      },
    ],
  },
  {
    label: 'C群: 環境・商圏',
    meta: 'Weather · Events · 人口 · 競合決算',
    sources: [
      {
        name: 'OpenWeather',
        kind: '1h毎',
        status: 'ok' as Status,
        schedule: '3時間毎',
        lastSync: '04-17 07:00',
        errorRate: 0.1,
        phase: 'Phase 1b',
      },
      {
        name: '地域イベント',
        kind: '手動キュレーション + LLM',
        status: 'ok' as Status,
        schedule: '週次',
        lastSync: '04-15 10:00',
        errorRate: 0.0,
        phase: 'Phase 2b',
      },
      {
        name: '国勢調査',
        kind: 'オープンデータ',
        status: 'disabled' as Status,
        schedule: '年次',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 4',
      },
      {
        name: 'EDINET 競合決算',
        kind: 'EDINET API',
        status: 'disabled' as Status,
        schedule: '四半期',
        lastSync: '—',
        errorRate: 0.0,
        phase: 'Phase 3b',
      },
    ],
  },
];
