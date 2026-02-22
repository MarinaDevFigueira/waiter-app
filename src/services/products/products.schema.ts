import { z } from "zod";
import { productSchema } from "@/shared/schemas/product.schema";
import { ProductsOrderByEnum } from "@/shared/enums/products-order-by.enum";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";

const apiImageSchema = z.union([
  z.string(),
  z.object({ id: z.string(), url: z.string() }),
]);

export const apiProductSchema = productSchema.omit({
  deletedAt: true,
  deletedBy: true,
  images: true,
}).extend({
  images: z.array(apiImageSchema).optional(),
})

const PRODUCTS_ORDER_BY_VALUES = Object.values(ProductsOrderByEnum) as [ProductsOrderByEnum, ...ProductsOrderByEnum[]];
const SORT_DIRECTION_VALUES = Object.values(SortDirection) as [SortDirection, ...SortDirection[]];
const PRODUCT_STATUS_VALUES = Object.values(ProductStatusEnum) as [ProductStatusEnum, ...ProductStatusEnum[]];

export const productQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().max(100).default(10),
  orderBy: z.enum(PRODUCTS_ORDER_BY_VALUES).default(ProductsOrderByEnum.NAME),
  direction: z.enum(SORT_DIRECTION_VALUES).default(SortDirection.ASC),
  filters: z
    .object({
      search: z.string().optional(),
      categoria: z.array(z.string()).optional(),
      precoMin: z.number().optional(),
      precoMax: z.number().optional(),
      somenteEmEstoque: z.boolean().optional(),
      estoqueMin: z.number().optional(),
      status: z.array(z.enum(PRODUCT_STATUS_VALUES)).optional(),
      dataInicio: z.date().optional(),
      dataFim: z.date().optional(),
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
