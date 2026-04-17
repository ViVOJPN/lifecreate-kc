import type {
  AggregatedMarketPrice,
  LookupParams,
  MarketPrice,
  MarketProvider,
  MarketReferenceService,
  SourceId,
} from './types';

/**
 * Default implementation of MarketReferenceService.
 *
 * - 複数 Provider を並列実行
 * - タイムアウト・エラーは graceful degradation (空配列で継続)
 * - キャッシュレイヤーは後続 PR で追加 (Upstash Redis)
 */
export class DefaultMarketReferenceService implements MarketReferenceService {
  constructor(
    private readonly providers: MarketProvider[],
    private readonly options: { perProviderTimeoutMs?: number } = {},
  ) {}

  async lookup(params: LookupParams): Promise<MarketPrice[]> {
    const timeoutMs = this.options.perProviderTimeoutMs ?? 3000;
    const filteredProviders = params.sourceTypes
      ? this.providers.filter((p) => params.sourceTypes!.includes(p.type))
      : this.providers;

    const results = await Promise.allSettled(
      filteredProviders.map((p) =>
        withTimeout(p.fetch(params), timeoutMs, p.id),
      ),
    );

    return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  }

  async getAggregated(params: {
    productIdentifier: LookupParams['productIdentifier'];
  }): Promise<AggregatedMarketPrice> {
    const prices = await this.lookup({ productIdentifier: params.productIdentifier });

    if (prices.length === 0) {
      return {
        medianPrice: 0,
        priceRange: [0, 0],
        sampleSize: 0,
        confidence: 0,
        sources: [],
        observedAt: new Date(),
      };
    }

    const sorted = [...prices].sort((a, b) => a.price - b.price);
    const mid = Math.floor(sorted.length / 2);
    const medianPrice =
      sorted.length % 2 === 0
        ? (sorted[mid - 1]!.price + sorted[mid]!.price) / 2
        : sorted[mid]!.price;

    const minPrice = sorted[0]!.price;
    const maxPrice = sorted[sorted.length - 1]!.price;

    const uniqueSources = Array.from(
      new Set<SourceId>(prices.map((p) => p.sourceId)),
    );

    const avgConfidence =
      prices.reduce((sum, p) => sum + p.confidence, 0) / prices.length;

    return {
      medianPrice,
      priceRange: [minPrice, maxPrice],
      sampleSize: prices.length,
      confidence: avgConfidence,
      sources: uniqueSources,
      observedAt: new Date(),
    };
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`provider timeout: ${label}`)), ms),
    ),
  ]);
}
