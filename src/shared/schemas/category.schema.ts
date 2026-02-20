import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().optional(),
  sortOrder: z.number().int().nonnegative(),
  active: z.boolean(),
  businessId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryForm = z.infer<typeof categoryFormSchema>;
