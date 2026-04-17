import { z } from 'zod';

export const AppraisalBusinessTypeSchema = z.enum(['tool', 'luxury']);
export type AppraisalBusinessType = z.infer<typeof AppraisalBusinessTypeSchema>;

/**
 * 査定ログ (工具/ブランド品 共通)
 */
export const AppraisalSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid().nullable(),
  appraiserId: z.string().uuid().nullable(),
  businessType: AppraisalBusinessTypeSchema,
  imageUrls: z.array(z.string().url()),
  identifiedProduct: z.record(z.string(), z.unknown()).nullable(),
  aiRecommendedBuyPrice: z.number().int().nullable(),
  aiRecommendedSellPrice: z.number().int().nullable(),
  aiConfidence: z.number().min(0).max(1).nullable(),
  aiReasoning: z.string().nullable(),
  marketSnapshot: z.record(z.string(), z.unknown()).nullable(),
  actualBuyPrice: z.number().int().nullable(),
  transactionId: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type Appraisal = z.infer<typeof AppraisalSchema>;
