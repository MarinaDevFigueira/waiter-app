import { z } from "zod";
import { productSchema } from "@/shared/schemas/product.schema";

// Query params schema
export const productQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().max(100).default(10),
  orderBy: z
    .enum(["nome", "preco", "estoque", "categoria", "createdAt", "updatedAt"])
    .default("nome"),
  direction: z.enum(["ASC", "DESC"]).default("ASC"),
  filters: z
    .object({
      search: z.string().optional(),
      categoria: z.array(z.string()).optional(),
      precoMin: z.number().nullable().optional(),
      precoMax: z.number().nullable().optional(),
      somenteEmEstoque: z.boolean().optional(),
      estoqueMin: z.number().nullable().optional(),
      status: z.array(z.enum(["ativo", "inativo"])).optional(),
      dataInicio: z.date().nullable().optional(),
      dataFim: z.date().nullable().optional(),
    })
    .optional(),
});

// Paginated response schema
export const paginatedProductsSchema = z.object({
  items: z.array(productSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
