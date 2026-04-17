import { Topbar } from '@/components/topbar';
import { ComingSoon } from '@/components/ui/coming-soon';

export default function EcoPlusPage() {
  return (
    <>
      <Topbar crumbs={[{ label: '事業セグメント' }, { label: 'エコプラス' }]} />
      <ComingSoon
        phase="Phase 3a"
        status="planned"
        title="エコプラス事業の専門ダッシュボード"
        summary="ブランド品・貴金属リユース「エコプラス」の真贋判定リスク、カテゴリ別滞留、専門担当者の査定精度カーブを統合。工具事業とは査定ロジック・相場ソース・学習データを完全分離。"
        features={[
          {
            label: 'ブランド別 需給マップ',
            description:
              'ROLEX・LOUIS VUITTON・HERMES 等のカテゴリ別 仕入れ量・粗利率・滞留日数。',
          },
          {
            label: '真贋判定 リスクスコア',
            description:
              'appraisal-luxury エージェントによる真贋判定の信頼度・差し戻し件数・学習精度。',
          },
          {
            label: '貴金属相場トラッキング',
            description:
              'MEKIKI・相場検索・コメ兵オークション・おおくらの 4ソース統合ビュー。',
          },
          {
            label: '専門担当者の学習化',
            description:
              'エコプラス専門担当者の暗黙知を AI に移植する進捗。査定差異の月次トレンド。',
          },
        ]}
        dependencies={[
          'エコプラス専門担当者の特定と学習データ提供の同意',
          'MEKIKI 等の相場 API 契約 (Phase 3a)',
          'Claude Vision 精度評価 (真贋領域)',
        ]}
      />
    </>
  );
}
