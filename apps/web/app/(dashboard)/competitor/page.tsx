import { Topbar } from '@/components/topbar';
import { Kpi } from '@/components/ui/kpi';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { cn } from '@/lib/utils';

export default function CompetitorPage() {
  return (
    <>
      <Topbar
        crumbs={[{ label: 'AIエージェント' }, { label: '競合分析' }]}
        actions={
          <>
            <button className="btn hidden sm:inline-flex">FY2025 Q4</button>
            <button className="btn hidden md:inline-flex">全セグメント</button>
            <button className="btn btn-primary">経営会議レポート</button>
          </>
        }
      />

      <div className="page">
        <header className="mb-6 md:mb-8">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-subtle">
            Competitor Analysis · Phase 3b
          </div>
          <h1 className="font-serif text-[28px] font-medium leading-tight tracking-tight text-foreground md:text-[40px]">
            業界の<em className="not-italic italic text-accent">地殻変動</em>を、決算から先取りする。
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] text-muted md:text-[14px]">
            EDINET で上場6社（ハードオフ・コメ兵・バイセル・ゲオ・トレファク・SOU）を自動追跡。
            非上場8社はサイト・信用調査会社・現地調査で補完。
            <strong className="text-foreground">ハードオフHDはFC展開モデルの最良比較対象</strong>。
          </p>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-3 md:mb-10 md:gap-4 lg:grid-cols-4">
          <Kpi label="監視競合数" value="14" unit="社" change="上場6 / 非上場8" trend="flat" />
          <Kpi label="業界既存店成長率 (中央値)" value="+3.2" unit="%" change="自社 +5.8% が業界上回り" trend="up" />
          <Kpi label="価格競争力指数 (工具)" value="1.08" unit="x" change="アクトツール比 +8% 高値" trend="up" />
          <Kpi label="FC出店ペース差" value="-18" unit="%" change="vs ハードオフ 過去12ヶ月" trend="down" />
        </div>

        {/* 上場競合ベンチマーク */}
        <div className="section-head">
          <div className="section-title">上場競合ベンチマーク</div>
          <div className="section-meta">EDINET · 直近四半期 · 自動取得</div>
        </div>

        <div className="table-scroll mb-8 rounded-lg border border-line bg-surface md:mb-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-elevated font-mono text-[10px] uppercase tracking-widest text-subtle">
                <th className="px-4 py-3 text-left md:px-5">コード</th>
                <th className="px-4 py-3 text-left md:px-5">社名</th>
                <th className="px-4 py-3 text-left md:px-5">セグメント</th>
                <th className="px-4 py-3 text-right md:px-5">直近Q売上</th>
                <th className="px-4 py-3 text-right md:px-5">YoY</th>
                <th className="px-4 py-3 text-right md:px-5">既存店成長</th>
                <th className="px-4 py-3 text-right md:px-5">EBITDA率</th>
                <th className="px-4 py-3 text-left md:px-5">位置づけ</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {listedCompetitors.map((c) => (
                <tr key={c.code} className="border-b border-line last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3.5 font-mono tabular-nums text-muted md:px-5">{c.code}</td>
                  <td className="px-4 py-3.5 md:px-5">
                    <div className="text-foreground">{c.name}</div>
                    <div className="font-mono text-[10px] text-subtle">{c.subtitle}</div>
                  </td>
                  <td className="px-4 py-3.5 md:px-5">
                    <span className="rounded border border-line bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] text-muted whitespace-nowrap">
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-foreground md:px-5">
                    {c.revenue}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3.5 text-right font-mono tabular-nums md:px-5',
                      c.yoy >= 0 ? 'text-positive' : 'text-accent',
                    )}
                  >
                    {c.yoy >= 0 ? '+' : ''}
                    {c.yoy.toFixed(1)}%
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3.5 text-right font-mono tabular-nums md:px-5',
                      c.sss >= 0 ? 'text-positive' : 'text-accent',
                    )}
                  >
                    {c.sss >= 0 ? '+' : ''}
                    {c.sss.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted md:px-5">
                    {c.ebitda.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 md:px-5">
                    {c.role === 'fc-benchmark' ? (
                      <SeverityBadge severity="positive" label="FC比較対象" />
                    ) : c.role === 'price-source' ? (
                      <SeverityBadge severity="warning" label="価格ベンチ" />
                    ) : (
                      <SeverityBadge severity="critical" label="直接競合" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FC戦略ベンチマーク */}
        <div className="section-head">
          <div className="section-title">FC戦略ベンチマーク</div>
          <div className="section-meta">軸B: FC展開ガバナンス指標</div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:mb-10 md:grid-cols-3">
          {fcBenchmarks.map((fc) => (
            <div
              key={fc.name}
              className={cn(
                'rounded-lg border p-5 md:p-6',
                fc.isSelf
                  ? 'border-accent/40 bg-critical-soft'
                  : 'border-line bg-surface',
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[16px] font-medium text-foreground md:text-[17px]">
                    {fc.name}
                  </h3>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                    {fc.subtitle}
                  </div>
                </div>
                {fc.isSelf ? (
                  <SeverityBadge severity="critical" label="自社" />
                ) : (
                  <span className="font-mono text-[10px] text-subtle">{fc.code}</span>
                )}
              </div>
              <dl className="space-y-2 text-[12px]">
                {fc.metrics.map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between">
                    <dt className="text-muted">{m.label}</dt>
                    <dd className="font-mono tabular-nums text-foreground">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-line pt-3 text-[12px] leading-relaxed text-muted">
                {fc.note}
              </p>
            </div>
          ))}
        </div>

        {/* 同一商品価格競争力 */}
        <div className="section-head">
          <div className="section-title">同一商品 価格競争力（ハンズクラフト）</div>
          <div className="section-meta">軸H: アクトツール・工具買取王国のスクレイピング比較</div>
        </div>

        <div className="table-scroll mb-8 rounded-lg border border-line bg-surface md:mb-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-elevated font-mono text-[10px] uppercase tracking-widest text-subtle">
                <th className="px-4 py-3 text-left md:px-5">型番</th>
                <th className="px-4 py-3 text-left md:px-5">商品</th>
                <th className="px-4 py-3 text-right md:px-5">自社買取</th>
                <th className="px-4 py-3 text-right md:px-5">アクトツール</th>
                <th className="px-4 py-3 text-right md:px-5">工具買取王国</th>
                <th className="px-4 py-3 text-right md:px-5">競争力指数</th>
                <th className="px-4 py-3 text-left md:px-5">AI示唆</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {priceCompetition.map((p) => (
                <tr key={p.sku} className="border-b border-line last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3.5 font-mono tabular-nums text-muted md:px-5">{p.sku}</td>
                  <td className="px-4 py-3.5 text-foreground md:px-5">{p.name}</td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-foreground md:px-5">
                    {p.self}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted md:px-5">
                    {p.act}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-muted md:px-5">
                    {p.kaitori}
                  </td>
                  <td
                    className={cn(
                      'px-4 py-3.5 text-right font-mono tabular-nums font-semibold md:px-5',
                      p.index >= 1.05
                        ? 'text-positive'
                        : p.index >= 0.95
                          ? 'text-foreground'
                          : 'text-accent',
                    )}
                  >
                    {p.index.toFixed(2)}x
                  </td>
                  <td className="px-4 py-3.5 md:px-5">
                    {p.hint === 'raise' ? (
                      <SeverityBadge severity="positive" label="値上余地" />
                    ) : p.hint === 'review' ? (
                      <SeverityBadge severity="critical" label="見直し" />
                    ) : (
                      <SeverityBadge severity="warning" label="維持" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 非上場競合プロファイル */}
        <div className="section-head">
          <div className="section-title">非上場競合プロファイル</div>
          <div className="section-meta">公式サイト・信用調査会社・現地調査</div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:mb-10 md:grid-cols-2 lg:grid-cols-3">
          {privateCompetitors.map((p) => (
            <div
              key={p.name}
              className="rounded-lg border border-line bg-surface p-4 md:p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-serif text-[15px] font-medium text-foreground">
                  {p.name}
                </h3>
                <span
                  className={cn(
                    'rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest whitespace-nowrap',
                    p.segment === 'tool'
                      ? 'border-positive/40 bg-positive-soft text-positive'
                      : p.segment === 'luxury'
                        ? 'border-info/40 bg-[rgba(107,140,176,0.1)] text-info'
                        : 'border-line bg-surface-hover text-muted',
                  )}
                >
                  {p.segmentLabel}
                </span>
              </div>
              <p className="mb-3 text-[12px] leading-relaxed text-muted">{p.description}</p>
              <dl className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <dt className="text-subtle">推定規模</dt>
                  <dd className="font-mono tabular-nums text-muted">{p.scale}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-subtle">脅威度</dt>
                  <dd className="font-mono text-muted">{p.threat}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* AI 四半期サマリー */}
        <div className="section-head">
          <div className="section-title">AI 四半期サマリー</div>
          <div className="section-meta">competitor-analysis エージェント · 経営会議向け</div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-positive/40 bg-positive-soft p-5 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <SeverityBadge severity="positive" label="優位" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                価格設定
              </span>
            </div>
            <h3 className="font-serif text-[16px] font-medium text-foreground md:text-[17px]">
              工具カテゴリ、業界対比 +8% の高値買取を実現
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Makita・HiKOKI 主要型番でアクトツール比 +8%、工具買取王国比 +12%。
              PAUDEL氏・久芳氏の目利きが価格競争力に直結していることが裏付けられた。
              <strong className="text-foreground">属人化リスク（軸D）の裏返しでもあり、AI化優先度は依然最高</strong>。
            </p>
          </div>
          <div className="rounded-lg border border-accent/40 bg-critical-soft p-5 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <SeverityBadge severity="critical" label="警戒" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                FC出店速度
              </span>
            </div>
            <h3 className="font-serif text-[16px] font-medium text-foreground md:text-[17px]">
              おたからや、四半期で +38 店舗（自社 +1）
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              買取特化FCモデルで出店ペースが桁違い。エコプラス事業の商圏で競合密度が上昇中。
              <strong className="text-foreground">FC立ち上げテンプレ化（Phase 4）の前倒し検討を推奨</strong>。
              品質ガバナンスを担保しつつ出店速度をどう上げるかが論点。
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-surface p-5 md:mt-8">
          <div className="font-mono text-[10px] uppercase tracking-widest text-subtle">
            データソース・制約
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            上場6社は EDINET と適時開示の自動取得（四半期）。非上場8社は公式サイト・信用調査会社ベースの推計を含む。
            価格競争力指数は<span className="text-accent">スクレイピング許諾・robots.txt 遵守</span>
            のうえ、代表SKU 120 点で算出。<strong className="text-foreground">CLAUDE.md §4.4.4 / §4.5</strong>
            に準拠。AI示唆は公開情報に基づく一般的分析の範囲であり、最終判断は経営会議で行ってください。
          </p>
        </div>
      </div>
    </>
  );
}

const listedCompetitors = [
  {
    code: '2674',
    name: 'ハードオフHD',
    subtitle: '総合リユースFC',
    segment: 'ハンズクラフト',
    revenue: '¥8,420M',
    yoy: 4.8,
    sss: 2.1,
    ebitda: 11.2,
    role: 'fc-benchmark',
  },
  {
    code: '2780',
    name: 'コメ兵HD',
    subtitle: 'ブランド品最大手',
    segment: 'エコプラス',
    revenue: '¥21,840M',
    yoy: 12.4,
    sss: 6.8,
    ebitda: 9.8,
    role: 'price-source',
  },
  {
    code: '7685',
    name: 'バイセル',
    subtitle: '出張買取・着物/貴金属',
    segment: 'エコプラス',
    revenue: '¥7,120M',
    yoy: 8.2,
    sss: 3.4,
    ebitda: 7.1,
    role: 'direct',
  },
  {
    code: '2681',
    name: 'ゲオHD',
    subtitle: '家電・ホビー・リユース',
    segment: 'ハンズクラフト',
    revenue: '¥94,120M',
    yoy: 2.1,
    sss: -0.4,
    ebitda: 8.4,
    role: 'direct',
  },
  {
    code: '3093',
    name: 'トレジャー・ファクトリー',
    subtitle: '総合リユース・店舗型',
    segment: '横断',
    revenue: '¥9,680M',
    yoy: 11.2,
    sss: 5.6,
    ebitda: 10.4,
    role: 'direct',
  },
  {
    code: '9270',
    name: 'SOU（なんぼや）',
    subtitle: 'ブランド・時計・店舗型',
    segment: 'エコプラス',
    revenue: '¥6,840M',
    yoy: 14.8,
    sss: 7.2,
    ebitda: 12.8,
    role: 'direct',
  },
] as const;

const fcBenchmarks = [
  {
    name: 'ライフクリエイト',
    subtitle: '216A · 福岡/東京/名証',
    code: '自社',
    isSelf: true,
    metrics: [
      { label: '総店舗数', value: '17店' },
      { label: 'FC比率', value: '18%' },
      { label: '1店売上 (年)', value: '¥198M' },
      { label: 'FC立ち上げ期間', value: '直営80%到達 14ヶ月' },
      { label: '四半期出店', value: '+1店' },
    ],
    note: '島根出雲店でFC本格展開中。査定AIによる立ち上げ速度短縮が軸B KPIの焦点。',
  },
  {
    name: 'ハードオフHD',
    subtitle: '216A上場・総合リユースFC',
    code: '2674',
    isSelf: false,
    metrics: [
      { label: '総店舗数', value: '920店' },
      { label: 'FC比率', value: '64%' },
      { label: '1店売上 (年)', value: '¥92M' },
      { label: 'FC立ち上げ期間', value: '約8ヶ月' },
      { label: '四半期出店', value: '+12店' },
    ],
    note: '216A上場 × FC展開という二軸で最良比較対象。オペレーションテンプレ化が先進。',
  },
  {
    name: 'おたからや',
    subtitle: 'いーふらん · 買取特化FC',
    code: '非上場',
    isSelf: false,
    metrics: [
      { label: '総店舗数', value: '約1,400店' },
      { label: 'FC比率', value: '95%+' },
      { label: '1店売上 (推定)', value: '¥38M' },
      { label: 'FC立ち上げ期間', value: '約4ヶ月' },
      { label: '四半期出店', value: '+38店' },
    ],
    note: '買取特化の爆発的出店モデル。エコプラス商圏での直接脅威。品質ガバナンスとのトレードオフが論点。',
  },
] as const;

const priceCompetition = [
  { sku: 'HR2631FT', name: 'Makita ハンマドリル', self: '¥18,800', act: '¥17,200', kaitori: '¥16,400', index: 1.09, hint: 'raise' },
  { sku: 'DH36DPA', name: 'HiKOKI 36V ハンマドリル', self: '¥42,000', act: '¥38,500', kaitori: '¥36,800', index: 1.09, hint: 'raise' },
  { sku: 'GBH 18V-26', name: 'BOSCH コードレスハンマドリル', self: '¥28,400', act: '¥29,800', kaitori: '¥27,200', index: 0.98, hint: 'hold' },
  { sku: 'TD173DRGX', name: 'Makita インパクトドライバ', self: '¥26,200', act: '¥25,400', kaitori: '¥24,100', index: 1.06, hint: 'hold' },
  { sku: 'WH36DC', name: 'HiKOKI インパクトドライバ', self: '¥29,800', act: '¥28,400', kaitori: '¥27,900', index: 1.06, hint: 'hold' },
  { sku: 'HS301DZ', name: 'Makita 充電式マルノコ', self: '¥12,400', act: '¥13,800', kaitori: '¥13,200', index: 0.92, hint: 'review' },
  { sku: 'GSR 18V-60', name: 'BOSCH ドライバードリル', self: '¥19,800', act: '¥19,200', kaitori: '¥18,400', index: 1.05, hint: 'hold' },
  { sku: 'CR36DMA', name: 'HiKOKI セーバソー', self: '¥22,800', act: '¥21,400', kaitori: '¥20,800', index: 1.08, hint: 'raise' },
] as const;

const privateCompetitors = [
  {
    name: 'アクトツール',
    segment: 'tool',
    segmentLabel: '工具',
    description: '工具専業・買取強い。東日本中心。型番×状態の査定ロジックが精緻で、査定精度のベンチマーク。',
    scale: '約40店舗',
    threat: '★★★★☆',
  },
  {
    name: '工具買取王国',
    segment: 'tool',
    segmentLabel: '工具',
    description: '工具専業。出張・宅配買取も展開。買取単価は自社・アクトツール比やや低め、在庫回転重視型。',
    scale: '約25店舗',
    threat: '★★★☆☆',
  },
  {
    name: 'おたからや（いーふらん）',
    segment: 'luxury',
    segmentLabel: 'ブランド',
    description: '買取FC最大級。ブランド品・貴金属・金券まで横断。出店速度とTV広告で認知急拡大。',
    scale: '約1,400店舗',
    threat: '★★★★★',
  },
  {
    name: '大黒屋',
    segment: 'luxury',
    segmentLabel: 'ブランド',
    description: 'ブランド・金券の老舗。駅前立地で競合。都心商圏ではエコプラスと正面衝突。',
    scale: '約220店舗',
    threat: '★★★☆☆',
  },
  {
    name: '銀蔵',
    segment: 'luxury',
    segmentLabel: 'ブランド',
    description: 'ブランド・ジュエリー買取。相場ソース候補としても活用可能。',
    scale: '約30店舗',
    threat: '★★☆☆☆',
  },
  {
    name: 'ブランドオフ',
    segment: 'luxury',
    segmentLabel: 'ブランド',
    description: 'ブランド品買取・販売。真贋判定に定評。価格ソース候補。',
    scale: '約40店舗',
    threat: '★★★☆☆',
  },
  {
    name: '関西クリーンサービス',
    segment: 'life',
    segmentLabel: '遺品整理',
    description: '遺品整理専業。リユース導線が弱く、ライフサポート事業での差別化余地が大きい。',
    scale: '関西圏中心',
    threat: '★★☆☆☆',
  },
  {
    name: 'メモリーズ',
    segment: 'life',
    segmentLabel: '遺品整理',
    description: '遺品整理・生前整理。価格訴求型。地域ごとのFC連携の可能性。',
    scale: '全国対応',
    threat: '★★☆☆☆',
  },
] as const;
