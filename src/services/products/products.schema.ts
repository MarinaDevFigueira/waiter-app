import { z } from "zod";
import { productSchema } from "@/shared/schemas/product.schema";

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

export const paginatedProductsSchema = z.object({
  items: z.array(productSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const apiProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: z.string(),
  price: z.number(),
  stock: z.number().int(),
  unit: z.enum(["un", "kg", "g", "l", "ml"]),
  imageUrl: z.string().nullable().optional(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const apiProductListSchema = z.object({
  items: z.array(apiProductSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type ProductQueryParams = z.infer<typeof productQueryParamsSchema>;
export type PaginatedProducts = z.infer<typeof paginatedProductsSchema>;
export type ApiProduct = z.infer<typeof apiProductSchema>;
