import { z } from 'zod';

/**
 * Google Business Profile 口コミ (MEO intelligence のソース)
 */
export const GoogleReviewSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid().nullable(),
  googleReviewId: z.string(),
  rating: z.number().int().min(1).max(5),
  content: z.string().nullable(),
  reviewerName: z.string().nullable(),
  postedAt: z.string().datetime().nullable(),
  replyContent: z.string().nullable(),
  repliedAt: z.string().datetime().nullable(),
  aiThemes: z.array(z.string()).nullable(),
  aiSentimentScore: z.number().min(-1).max(1).nullable(),
  fetchedAt: z.string().datetime(),
});
export type GoogleReview = z.infer<typeof GoogleReviewSchema>;
