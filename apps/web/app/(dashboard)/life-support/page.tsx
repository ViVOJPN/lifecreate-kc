import { Topbar } from '@/components/topbar';
import { ComingSoon } from '@/components/ui/coming-soon';

export default function LifeSupportPage() {
  return (
    <>
      <Topbar crumbs={[{ label: '事業セグメント' }, { label: 'ライフサポート' }]} />
      <ComingSoon
        phase="Phase 5"
        status="planned"
        title="ライフサポート事業の統合ビュー"
        summary="遺品整理・不用品買取から リユース（ハンズ・エコプラス）への導線設計。顧客横断ユース率（4事業のうち複数利用した顧客比率）を御用聞きビジョンの中核指標として可視化。"
        features={[
          {
            label: '遺品整理 → 買取 転換率',
            description:
              '整理案件から買取商品に転換した比率を、案件規模・地域・担当者別に追跡。',
          },
          {
            label: '顧客横断ユース',
            description:
              '4事業のうち複数利用した顧客の比率と LTV 寄与。御用聞きビジョン直結指標。',
          },
          {
            label: '50代+ 顧客セグメント',
            description:
              '遺品整理の主要顧客層（50代以上）の継続利用率・紹介率。',
          },
          {
            label: 'エリア別 需要予測',
            description:
              '人口動態（高齢化率）× 過去案件密度から、エリア別の遺品整理需要を予測。',
          },
        ]}
        dependencies={[
          '4事業統合の顧客ID設計',
          '人口動態データ (国勢調査) 取込',
          '遺品整理案件の業務システム連携',
        ]}
      />
    </>
  );
}
