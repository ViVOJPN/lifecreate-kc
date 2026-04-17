import { Topbar } from '@/components/topbar';
import { ComingSoon } from '@/components/ui/coming-soon';

export default function FcPage() {
  return (
    <>
      <Topbar crumbs={[{ label: '事業セグメント' }, { label: 'FC管理' }]} />
      <ComingSoon
        phase="Phase 4"
        status="planned"
        title="FC展開ガバナンス"
        summary="FC加盟店（島根出雲店が1号店）の立ち上げ期モニタリングと、本部ノウハウの移植進捗を追跡。FCオーナーには自店舗のデータのみ開示し、他店は匿名化されたベンチマーク平均のみ表示する権限分離を実装。"
        features={[
          {
            label: 'FC査定精度カーブ',
            description:
              'FC店員の粗利率が直営比 80% に到達するまでの月数。暗黙知移植の進捗指標。',
          },
          {
            label: '価格ガバナンス乖離',
            description:
              '同一JANコードの設定売価の店舗間標準偏差。FC間の価格統制度を可視化。',
          },
          {
            label: '本部問い合わせ頻度',
            description:
              'FCオーナーから本部への問い合わせ件数・分類。セルフサービス化の進捗。',
          },
          {
            label: 'FCオーナー向けビュー',
            description:
              '自店舗詳細 + 匿名化されたFC平均ベンチマーク。RLSで他店個別データを遮断。',
          },
        ]}
        dependencies={[
          'FC展開のコアコンピタンス（査定 or 運営）の方針確定',
          'Supabase RLS のFCオーナー権限ポリシー',
          '島根出雲店の本格展開データ蓄積',
        ]}
      />
    </>
  );
}
