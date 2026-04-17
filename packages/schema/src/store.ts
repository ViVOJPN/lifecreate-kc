import { z } from 'zod';

export const BusinessTypeSchema = z.enum(['hands_craft', 'eco_plus', 'life_support']);
export type BusinessType = z.infer<typeof BusinessTypeSchema>;

export const OwnershipSchema = z.enum(['direct', 'fc']);
export type Ownership = z.infer<typeof OwnershipSchema>;

/**
 * 店舗マスター (Supabase stores テーブル対応)
 */
export const StoreSchema = z.object({
  id: z.string().uuid(),
  posStoreCode: z.string(),
  name: z.string(),
  businessType: BusinessTypeSchema,
  ownership: OwnershipSchema,
  openedAt: z.string().date().nullable(),
  prefecture: z.string().nullable(),
  city: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  googlePlaceId: z.string().nullable(),
  tradeAreaPopulation: z.number().int().nullable(),
  createdAt: z.string().datetime(),
});
export type Store = z.infer<typeof StoreSchema>;
