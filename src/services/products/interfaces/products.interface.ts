import type { Product, ProductTranslation } from "@/shared/schemas/product.schema";
import type { ProductsOrderByEnum } from "@/shared/enums/products-order-by.enum";
import type { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";

export type ApiProductImage = string | { id: string; url: string };

export interface GetProductResponse {
  id: string;
  name?: string;
  description?: string;
  categoryId: string;
  price: number;
  stock: number;
  unit: "un" | "kg" | "g" | "l" | "ml";
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
  categoria?: string[];
  precoMin?: number;
  precoMax?: number;
  somenteEmEstoque?: boolean;
  estoqueMin?: number;
  status?: ProductStatusEnum[];
  dataInicio?: Date;
  dataFim?: Date;
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
