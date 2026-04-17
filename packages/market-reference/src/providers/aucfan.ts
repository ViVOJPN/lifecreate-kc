import type { LookupParams, MarketPrice, MarketProvider } from '../types';

/**
 * AucfanProvider - オークファン公式API
 *
 * 設計書 §4.3.2 参照。ハンズクラフト向け最優先ソース。
 * 実装は Phase 1b で本番化する。ここでは interface 実装の骨格のみ。
 */
export class AucfanProvider implements MarketProvider {
  readonly id = 'aucfan' as const;
  readonly type = 'auction' as const;

  constructor(
    private readonly config: {
      apiKey: string;
      baseUrl?: string;
    },
  ) {}

  async fetch(_params: LookupParams): Promise<MarketPrice[]> {
    // TODO(Phase 1b): オークファンAPI実呼び出し
    // - エンドポイント: https://aucfan.com/api/... (要確認)
    // - 認証: this.config.apiKey
    // - rate limit 対応
    // - レスポンスを MarketPrice[] にマッピング
    return [];
  }
}
