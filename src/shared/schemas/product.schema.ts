import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  name: z.string().min(1, { error: "Nome é obrigatório" }),
  description: z.string().optional(),
  category: z.string().min(1, { error: "Categoria é obrigatória" }),
  price: z.number().positive({ error: "Preço deve ser positivo" }),
  stock: z.number().int().nonnegative({ error: "Estoque deve ser não-negativo" }),
  unit: z.enum(["un", "kg", "g", "l", "ml"]),
  imageUrl: z.string().optional(),
  active: z.boolean(),
});

export const productFormSchema = productSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  deletedAt: true,
  deletedBy: true,
});

export type Product = z.infer<typeof productSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
