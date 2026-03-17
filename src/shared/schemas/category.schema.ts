import { z } from "zod";
import { TranslationsEnum } from "@/shared/enums/translations.enum";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

const LOCALE_VALUES = Object.values(TranslationsEnum) as [string, ...string[]];

export const categoryTranslationSchema = z.object({
  locale: z.enum(LOCALE_VALUES),
  name: z.string().min(1, { error: "Nome é obrigatório" }),
  description: z.string().optional(),
});

export const categorySchema = baseEntitySchema.extend({
  id: z.string(),
  name: z.string().default(""),
  description: z.string().optional().default(""),
  sortOrder: z.number().int().nonnegative(),
  active: z.boolean(),
  businessId: z.string(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  deletedBy: z.string().nullable().optional(),
});

export const categoryFormSchema = z.object({
  translations: z
    .array(categoryTranslationSchema)
    .min(1, { error: "Ao menos uma tradução é obrigatória" }),
  sortOrder: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryTranslation = z.infer<typeof categoryTranslationSchema>;
export type CategoryForm = z.infer<typeof categoryFormSchema>;
