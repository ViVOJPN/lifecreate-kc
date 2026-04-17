import { Topbar } from '@/components/topbar';
import { ComingSoon } from '@/components/ui/coming-soon';

export default function LtvPage() {
  return (
    <>
      <Topbar crumbs={[{ label: 'AIエージェント' }, { label: '顧客LTV予測' }]} />
      <ComingSoon
        phase="Phase 3 / 5"
        status="planned"
        title="顧客LTV予測 & 御用聞きビジョン測定"
        summary="初回来店から36ヶ月の累計粗利貢献を予測し、売り買い両面利用率・顧客横断ユース率と統合。「日本一の御用聞き会社」ビジョンの定量定義を実装する最重要エージェント。"
        features={[
          {
            label: 'LTV 予測モデル',
            description:
              '初回購入データ × カテゴリ × 店舗属性から、36ヶ月LTVを推定。回帰モデル + LLM補正。',
          },
          {
            label: '売り買い両面利用率',
            description:
              '買取も販売も利用した顧客の比率を時系列で追跡。御用聞き中核指標。',
          },
          {
            label: '顧客横断ユース率',
            description:
              'ハンズ × エコプラス × ライフサポートの複数事業を利用した顧客比率。',
          },
          {
            label: '解約・離反予兆検知',
            description:
              '前回来店からの日数・購買間隔の乱れから離反確率を算出、リマケ対象を提示。',
          },
        ]}
        dependencies={[
          '会員IDの連続性回復（2024年4月断絶問題の解消）',
          '事業横断の顧客名寄せロジック',
          '最低36ヶ月分のPOS履歴',
        ]}
      />
    </>
  );
}
