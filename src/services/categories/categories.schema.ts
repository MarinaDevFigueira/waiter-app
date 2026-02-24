import { z } from "zod";
import { categorySchema, categoryTranslationSchema } from "@/shared/schemas/category.schema";
import { CategoriesOrderByEnum } from "@/shared/enums/categories-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";

export const apiCategorySchema = categorySchema;

const CATEGORIES_ORDER_BY_VALUES = Object.values(CategoriesOrderByEnum) as [CategoriesOrderByEnum, ...CategoriesOrderByEnum[]];
const SORT_DIRECTION_VALUES = Object.values(SortDirection) as [SortDirection, ...SortDirection[]];

export const categoryQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().max(100).default(10),
  orderBy: z.enum(CATEGORIES_ORDER_BY_VALUES).default(CategoriesOrderByEnum.NAME),
  direction: z.enum(SORT_DIRECTION_VALUES).default(SortDirection.ASC),
  search: z.string().optional(),
});

export const paginatedCategoriesSchema = z.object({
  items: z.array(categorySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const apiCategoryListSchema = z.object({
  items: z.array(apiCategorySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const apiCategoryTranslationsSchema = z.object({
  translations: z.array(categoryTranslationSchema),
});

export type CategoryQueryParams = z.infer<typeof categoryQueryParamsSchema>;
export type PaginatedCategories = z.infer<typeof paginatedCategoriesSchema>;
export type ApiCategory = z.infer<typeof apiCategorySchema>;
export type ApiCategoryTranslations = z.infer<typeof apiCategoryTranslationsSchema>;
