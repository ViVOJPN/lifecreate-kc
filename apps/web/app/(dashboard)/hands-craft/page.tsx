import { Topbar } from '@/components/topbar';
import { ComingSoon } from '@/components/ui/coming-soon';

export default function HandsCraftPage() {
  return (
    <>
      <Topbar crumbs={[{ label: '事業セグメント' }, { label: 'ハンズクラフト' }]} />
      <ComingSoon
        phase="Phase 2 / 3"
        status="in-progress"
        title="ハンズクラフト事業の横断ダッシュボード"
        summary="工具・家電のリユース事業「ハンズクラフト」全17店舗の共通指標と、PAUDEL氏・久芳氏の査定パターン分析、競合買取サイト（アクトツール・工具買取王国）との価格比較を統合するビュー。"
        features={[
          {
            label: '工具カテゴリ別 需給マップ',
            description:
              'Makita・HiKOKI・BOSCH 等ブランド別の仕入れ量・粗利率・滞留日数をヒートマップ化。',
          },
          {
            label: '査定AI採用率',
            description:
              'PAUDEL氏・久芳氏の判断と AI 推奨の一致率/乖離を店舗別に時系列追跡。',
          },
          {
            label: '競合買取価格ウォッチ',
            description:
              'アクトツール・工具買取王国の価格を定期スクレイピングし、自社設定との差分を可視化。',
          },
          {
            label: 'メーカー別 市場動向',
            description:
              'オークファン・ヤフオク・メルカリの相場を 30 日移動平均でブランド別に追跡。',
          },
        ]}
        dependencies={[
          'POSタロスシステムズの日次取込完了 (Phase 1a)',
          'Market Reference Service の 4ソース統合 (Phase 2b)',
          '競合スクレイピングの法務確認 (Phase 3b)',
        ]}
      />
    </>
  );
}
