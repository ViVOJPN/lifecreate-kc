/**
 * Market Reference Service - 相場メタAPI層
 *
 * 設計書 §4.3.1 参照。複数ソース (オークファン/ヤフオク/メルカリ/等) を
 * 単一インターフェースで扱う抽象化層の型定義。
 *
 * AIエージェントは getAggregated() のみ使用する。個別ソース取得 (lookup) は
 * デバッグ・検証用途のみ。
 */

export type SourceId =
  | 'aucfan'
  | 'yahoo_auction'
  | 'mercari'
  | 'amazon'
  | 'rakuten'
  | 'jmty'
  | 'manufacturer'
  | 'act_tool'
  | 'tool_kaitori_oukoku'
  | 'mekiki'
  | 'kakaku_com'
  | 'komehyo_auction';

export type SourceType = 'auction' | 'marketplace' | 'new_retail' | 'competitor_buy';

export type Condition = 'new' | 'used_A' | 'used_B' | 'used_C';

export interface ProductIdentifier {
  jan?: string;
  modelNumber?: string;
  brand?: string;
  freeText: string;
}

export interface MarketPrice {
  sourceId: SourceId;
  sourceType: SourceType;
  productIdentifier: ProductIdentifier;
  price: number;
  currency: 'JPY';
  condition?: Condition;
  observedAt: Date;
  sampleSize?: number;
  confidence: number;
  raw?: Record<string, unknown>;
}

export interface AggregatedMarketPrice {
  medianPrice: number;
  priceRange: [number, number];
  sampleSize: number;
  confidence: number;
  sources: SourceId[];
  observedAt: Date;
}

export interface LookupParams {
  productIdentifier: ProductIdentifier;
  lookbackDays?: number;
  sourceTypes?: SourceType[];
}

export interface MarketReferenceService {
  /**
   * 個別ソースから相場を取得。デバッグ・検証用。
   */
  lookup(params: LookupParams): Promise<MarketPrice[]>;

  /**
   * 複数ソースを統合した集計値を取得。AIエージェントはこれを使う。
   */
  getAggregated(params: {
    productIdentifier: ProductIdentifier;
  }): Promise<AggregatedMarketPrice>;
}

/**
 * 個別ソース Provider インターフェース。
 * 新規ソース追加時は MarketProvider を実装して providers に登録するだけ。
 */
export interface MarketProvider {
  readonly id: SourceId;
  readonly type: SourceType;
  fetch(params: LookupParams): Promise<MarketPrice[]>;
}
