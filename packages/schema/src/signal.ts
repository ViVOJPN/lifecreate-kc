import { z } from 'zod';

export const SeveritySchema = z.enum(['critical', 'warning', 'positive']);
export type Severity = z.infer<typeof SeveritySchema>;

export const SignalCategorySchema = z.enum([
  'crm',
  'attribution',
  'inventory',
  'meo',
  'ads',
  'external',
]);
export type SignalCategory = z.infer<typeof SignalCategorySchema>;

export const SuggestedActionSchema = z.object({
  kind: z.enum(['decision', 'execution']),
  description: z.string(),
  owner: z.string().optional(),
});

/**
 * AIシグナル (朝の3つの示唆のソース)
 */
export const AiSignalSchema = z.object({
  id: z.string().uuid(),
  detectedAt: z.string().datetime(),
  severity: SeveritySchema,
  category: SignalCategorySchema,
  title: z.string(),
  body: z.string(),
  metricValue: z.number().nullable(),
  metricUnit: z.string().nullable(),
  metricDelta: z.number().nullable(),
  storeId: z.string().uuid().nullable(),
  evidenceQuery: z.string().nullable(),
  suggestedActions: z.array(SuggestedActionSchema).nullable(),
  dismissedAt: z.string().datetime().nullable(),
  dismissedBy: z.string().uuid().nullable(),
});
export type AiSignal = z.infer<typeof AiSignalSchema>;

export const MorningBriefSchema = z.object({
  id: z.string().uuid(),
  briefDate: z.string().date(),
  targetUserRole: z.string(),
  summary: z.string(),
  topSignalIds: z.array(z.string().uuid()),
  generatedAt: z.string().datetime(),
  modelVersion: z.string().nullable(),
});
export type MorningBrief = z.infer<typeof MorningBriefSchema>;
