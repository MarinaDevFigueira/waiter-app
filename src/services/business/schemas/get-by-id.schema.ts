import { z } from "zod";
import { apiBusinessLimitsSchema } from "@/services/business-limits/schemas/get.schema";
import { apiBusinessSettingsSchema } from "@/services/business-settings/schemas/get.schema";

export const apiBusinessDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable(),
  ownerId: z.string(),
  street: z.string().nullable(),
  number: z.string().nullable(),
  complement: z.string().nullable(),
  neighborhood: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  zipCode: z.string().nullable(),
  settingsId: z.string().nullable(),
  limitsId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  settings: apiBusinessSettingsSchema.nullable(),
  limits: apiBusinessLimitsSchema.nullable(),
});

export type ApiBusinessDetail = z.infer<typeof apiBusinessDetailSchema>;
