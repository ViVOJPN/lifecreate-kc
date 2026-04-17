import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'executive',
  'hq_staff',
  'store_manager',
  'fc_owner',
  'appraiser',
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  role: UserRoleSchema,
  storeId: z.string().uuid().nullable(),
  fullName: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;
