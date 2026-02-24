import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";
import { TranslationsEnum } from "@/shared/enums/translations.enum";

const LOCALE_VALUES = Object.values(TranslationsEnum) as [string, ...string[]];

export const productImageSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const productTranslationSchema = z.object({
  locale: z.enum(LOCALE_VALUES),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().optional(),
});

export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().optional(),
  categoryId: z.string().min(1, { message: "Categoria é obrigatória" }),
  price: z.number().positive({ message: "Preço deve ser positivo" }),
  stock: z.number().int().nonnegative({ message: "Estoque deve ser não-negativo" }),
  unit: z.enum(["un", "kg", "g", "l", "ml"]),
  images: z.array(productImageSchema),
  active: z.boolean(),
});

export const productFormSchema = z.object({
  translations: z
    .array(productTranslationSchema)
    .min(1, { message: "Ao menos uma tradução é obrigatória" }),
  categoryId: z.string().min(1, { message: "Categoria é obrigatória" }),
  price: z.number().positive({ message: "Preço deve ser positivo" }),
  stock: z.number().int().nonnegative({ message: "Estoque deve ser não-negativo" }),
  unit: z.enum(["un", "kg", "g", "l", "ml"]),
  images: z.array(productImageSchema).optional(),
  active: z.boolean().optional(),
});

export type ProductImage = z.infer<typeof productImageSchema>;
export type ProductTranslation = z.infer<typeof productTranslationSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
