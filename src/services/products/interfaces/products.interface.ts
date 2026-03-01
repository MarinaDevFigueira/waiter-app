import type { Product, ProductTranslation } from "@/shared/schemas/product.schema";
import type { ProductsOrderByEnum } from "@/shared/enums/products-order-by.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";

export type ApiProductImage = string | { id: string; url: string };

export type ProductUnit = "un" | "kg" | "g" | "l" | "ml";

export interface GetProductResponse {
  id: string;
  name?: string;
  description?: string;
  categoryId: string;
  price: number;
  stock: number;
  unit: ProductUnit;
  images?: ApiProductImage[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface GetProductTranslationsResponse {
  translations: ProductTranslation[];
}

export interface GetProductsRequestFilters {
  search?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  stockMin?: number;
  active?: string;
}

export interface GetProductsRequestQuery {
  page: number;
  size: number;
  orderBy: ProductsOrderByEnum;
  direction: SortDirection;
  filters?: GetProductsRequestFilters;
}

export interface GetProductsResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetProductsApiResponse {
  items: GetProductResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductTranslationRequestBody {
  locale: TranslationLanguage;
  name: string;
  description?: string;
}

export interface CreateProductRequestBody {
  translations: ProductTranslationRequestBody[];
  categoryId: string;
  price: number;
  stock: number;
  unit: ProductUnit;
  active: boolean;
}

export interface UpdateProductRequestBody {
  translations?: ProductTranslationRequestBody[];
  categoryId?: string;
  price?: number;
  stock?: number;
  unit?: ProductUnit;
  active?: boolean;
}
