import { z } from "zod";

export const businessSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});

export type Business = z.infer<typeof businessSchema>;
