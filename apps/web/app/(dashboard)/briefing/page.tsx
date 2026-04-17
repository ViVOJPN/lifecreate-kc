import { Topbar } from '@/components/topbar';
import { SignalCard } from '@/components/ui/signal-card';
import { Kpi } from '@/components/ui/kpi';

export default function BriefingPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'Intelligence' }, { label: '朝の3つの示唆' }]}
        actions={
          <>
            <button className="btn hidden sm:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                <path d="M12 3v18M3 12h18" />
              </svg>
              追加の問い
            </button>
            <button className="btn hidden md:inline-flex">PDFで書き出し</button>
            <button className="btn btn-primary">経営会議用</button>
          </>
        }
      />

      <div className="page">
        <header className="mb-8 md:mb-10">
          <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[44px]">
            おはようございます、<em className="not-italic italic text-accent">有冨さん</em>。
          </h1>
          <p className="mt-2 text-[13px] text-muted md:text-[14px]">
            本日、注視すべき3つのシグナルを整理しました。
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-subtle md:ml-3 md:mt-0 md:inline">
              2026.04.17 / Fri / 07:42 JST
            </span>
          </p>
        </header>

        {/* AI Morning Brief */}
        <section className="mb-8 rounded-lg border border-line bg-gradient-to-br from-surface to-elevated p-5 md:mb-10 md:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              AI Morning Brief
            </span>
            <span className="font-mono text-[9px] text-subtle md:text-[10px]">
              Analyzed 347,182 records · 23 signals · 3 prioritized
            </span>
          </div>
          <h2 className="font-serif text-[18px] font-medium leading-snug text-foreground md:text-[22px]">
            御用聞きビジョンに対する重要な警告が1件あります。
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-muted md:text-[14px]">
            2024年4月以降、
            <strong className="text-foreground">福岡インター店の会員データ取得が実質的に停止</strong>
            しています（月次会員化率が12%台から0%に断絶）。
            <mark className="bg-critical-soft px-1 text-accent">
              「日本一の御用聞き会社」ビジョンの根幹である顧客識別が崩れている
            </mark>
            可能性があります。他店舗でも同様の事象が発生しているか至急確認すべきです。並行して、
            <strong className="text-foreground">買取の属人化（PAUDEL氏・久芳氏で74%）</strong>
            は想定より深刻で、FC展開前に査定AIの学習データ化を進言します。売上・粗利は
            <strong className="text-positive">前年比+18.9%で好調</strong>
            、構造問題は表面に出ていませんが、今のうちに手を打つべき局面です。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn btn-primary">詳細を確認</button>
            <button className="btn">AIに質問</button>
            <button className="btn hidden sm:inline-flex">経営メンバーに共有</button>
          </div>
        </section>

        {/* Insight cards */}
        <div className="section-head">
          <div className="section-title">注視すべきシグナル</div>
          <div className="section-meta">AI優先度順 · 3 items</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SignalCard
            severity="critical"
            category="CRM / 御用聞き"
            title={
              <>
                会員データ取得が
                <br />
                2024年4月に断絶
              </>
            }
            metric="0.0"
            metricUnit="%"
            delta={{ label: '12.4pt / YoY', trend: 'down' }}
            body="2024年3月まで月次9〜14%で推移していた会員紐付け率が、4月を境にほぼゼロ化。運用レベルでの意思決定が背景と推察。"
            actions={['詳細を聞く', '他店舗も確認', '議題に追加']}
            chart={<MemberRateChart />}
          />
          <SignalCard
            severity="warning"
            category="属人化 / FC"
            title={
              <>
                買取担当2名で
                <br />
                利益の74%が集中
              </>
            }
            metric="73.9"
            metricUnit="%"
            delta={{ label: '上位2名' }}
            body="PAUDEL氏46.8%、久芳氏27.1%で買取金額の約74%。FC島根出雲店オープン後、この暗黙知の移植が最大の論点。"
            actions={['査定AI学習化を提案', '他店と比較']}
            chart={<StaffConcentrationChart />}
          />
          <SignalCard
            severity="positive"
            category="在庫 / 資本効率"
            title={
              <>
                滞留在庫 1,260 点
                <br />
                簿価 12.3M 円が露出
              </>
            }
            metric="¥12.3"
            metricUnit="M"
            delta={{ label: '180日+ 未販売' }}
            body="在庫日数が長いほど粗利率は高いが、キャッシュ拘束は増大。値下げタイミングAIで最大3.8M円の現金化が可能と推定。"
            actions={['値下げ案を生成', '業者売り候補']}
            chart={<AgingChart />}
          />
        </div>

        {/* KPI strip */}
        <div className="section-head">
          <div className="section-title">
            全社KPI
            <span className="ml-2 font-sans text-[12px] font-normal text-subtle">
              · ライフクリエイト連結
            </span>
          </div>
          <div className="section-meta">2025年12月期実績 vs. 2026年通期予想</div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
          <Kpi label="売上高" value="2,409" unit="M円" change="+18.9% YoY" trend="up" />
          <Kpi label="営業利益" value="103" unit="M円" change="+699% YoY" trend="up" />
          <Kpi label="リユース事業" value="2,337" unit="M円" change="+18.8% YoY" trend="up" />
          <Kpi label="期末在庫" value="652" unit="M円" change="回転率 3.7回" trend="down" />
          <Kpi label="店舗数" value="17" unit="店" change="+3店 / FC 1店" trend="up" />
        </div>
      </div>
    </>
  );
}

function MemberRateChart() {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-10 w-full">
      <path
        d="M0,10 L15,8 L30,12 L45,9 L60,11 L75,10 L90,13 L105,8 L120,9 L135,10 L150,9 L165,6 L180,10 L195,7"
        stroke="#88A569"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M0,12 L15,13 L30,10 L45,38 L60,39 L75,40 L90,40 L105,40 L120,40 L135,40 L150,40 L165,40 L180,40 L195,40"
        stroke="#EB031C"
        strokeWidth="1.8"
        fill="none"
      />
      <line x1="50" y1="0" x2="50" y2="40" stroke="#EB031C" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
      <text x="52" y="10" fill="#EB031C" fontSize="7" fontFamily="monospace">
        2024.04
      </text>
    </svg>
  );
}

function StaffConcentrationChart() {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-10 w-full">
      <rect x="0" y="5" width="90" height="30" fill="#D4A34B" opacity="0.85" />
      <rect x="92" y="10" width="54" height="25" fill="#D4A34B" opacity="0.6" />
      <rect x="148" y="18" width="20" height="17" fill="#D4A34B" opacity="0.4" />
      <rect x="170" y="22" width="18" height="13" fill="#D4A34B" opacity="0.3" />
      <rect x="190" y="28" width="10" height="7" fill="#D4A34B" opacity="0.18" />
      <text x="2" y="22" fill="#1a1a1a" fontSize="7" fontFamily="monospace" fontWeight="600">
        PAUDEL 47%
      </text>
      <text x="94" y="25" fill="#1a1a1a" fontSize="7" fontFamily="monospace" fontWeight="600">
        久芳 27%
      </text>
    </svg>
  );
}

function AgingChart() {
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-10 w-full">
      <rect x="0" y="30" width="38" height="10" fill="#88A569" opacity="0.75" />
      <rect x="40" y="25" width="38" height="15" fill="#88A569" opacity="0.85" />
      <rect x="80" y="15" width="38" height="25" fill="#D4A34B" opacity="0.85" />
      <rect x="120" y="8" width="38" height="32" fill="#EB031C" opacity="0.75" />
      <rect x="160" y="18" width="38" height="22" fill="#EB031C" opacity="0.5" />
      <text x="2" y="10" fill="#A0A0A0" fontSize="6" fontFamily="monospace">
        〜30日
      </text>
      <text x="125" y="5" fill="#EB031C" fontSize="6" fontFamily="monospace">
        180日+
      </text>
    </svg>
  );
}
