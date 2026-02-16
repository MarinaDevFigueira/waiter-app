import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  nome: z.string().min(1, { error: "Nome é obrigatório" }),
  descricao: z.string().optional(),
  categoria: z.string().min(1, { error: "Categoria é obrigatória" }),
  preco: z.number().positive({ error: "Preço deve ser positivo" }),
  estoque: z.number().int().nonnegative({ error: "Estoque deve ser não-negativo" }),
  unidade: z.enum(["un", "kg", "g", "l", "ml"]),
  imagemUrl: z.string().url().optional(),
  ativo: z.boolean(),
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
