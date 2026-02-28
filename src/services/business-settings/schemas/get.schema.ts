import { z } from "zod";

export const apiBusinessSettingsSchema = z.object({
  id: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  enabledLanguages: z.union([
    z.array(z.string()),
    z.string().transform((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return [val];
      }
    }),
  ]),
  businessId: z.string().nullable().optional(),
});

export type ApiBusinessSettings = z.infer<typeof apiBusinessSettingsSchema>;
