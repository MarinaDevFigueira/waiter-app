import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const businessSchema = baseEntitySchema.extend({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  deletedBy: z.string().nullable().optional(),
});

export type Business = z.infer<typeof businessSchema>;
