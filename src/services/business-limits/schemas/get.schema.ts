import { z } from "zod";

export const apiBusinessLimitsSchema = z.object({
  id: z.string().nullable(),
  maxTableUsers: z.number().int().nonnegative(),
  maxWaiterUsers: z.number().int().nonnegative(),
  maxKitchenUsers: z.number().int().nonnegative(),
  maxAttendantUsers: z.number().int().nonnegative(),
  businessId: z.string().nullable().optional(),
});

export type ApiBusinessLimits = z.infer<typeof apiBusinessLimitsSchema>;
