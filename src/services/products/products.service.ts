import { api } from "@/services/api";
import { type Product, type ProductForm } from "@/shared/schemas/product.schema";
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";
import { ProductStatusEnum } from "@/shared/enums/product-status.enum";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiProductListSchema,
  apiProductSchema,
} from "./products.schema";
import type { PaginatedProducts, ApiProduct, ProductQueryParams } from "./products.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiProductToProduct(raw: ApiProduct): Product {
  return {
    ...baseEntityDefaults,
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    categoryId: raw.categoryId,
    price: raw.price,
    stock: raw.stock,
    unit: raw.unit as Product["unit"],
    imageUrl: raw.imageUrl ?? undefined,
    active: raw.active,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    createdBy: "api",
    updatedBy: "api",
    deletedAt: null,
    deletedBy: null,
  };
}


export const productsService = {
  async getAll(
    queryParams: ProductQueryParams
  ): Promise<ServiceResult<PaginatedProducts>> {
    try {
      const { page, size, orderBy, direction, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("orderBy", orderBy);
      params.set("direction", direction);

      if (filters.search) params.set("search", filters.search);
      if (filters.categoria?.length) {
        params.set("categoryId", filters.categoria.join(","));
      }
      if (filters.precoMin !== undefined) params.set("priceMin", String(filters.precoMin));
      if (filters.precoMax !== undefined) params.set("priceMax", String(filters.precoMax));
      if (filters.somenteEmEstoque) params.set("inStock", "true");
      if (filters.estoqueMin !== undefined) params.set("stockMin", String(filters.estoqueMin));
      if (filters.status?.length) {
        const activeValues = filters.status.map((s) => (s === ProductStatusEnum.ACTIVE ? "true" : "false"));
        params.set("active", activeValues.join(","));
      }

      const result = await api.get<unknown>(`/products?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductListSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[productsService.getAll] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      const items = parsed.data.items.map(mapApiProductToProduct);

      return {
        data: {
          items,
          total: parsed.data.total,
          page: parsed.data.page,
          size: parsed.data.size,
          totalPages: parsed.data.totalPages,
          hasNextPage: parsed.data.hasNextPage,
          hasPreviousPage: parsed.data.hasPreviousPage,
        },
      };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produtos";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getById(productId: string): Promise<ServiceResult<Product>> {
    try {
      const result = await api.get<unknown>(`/products/${productId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiProductSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[productsService.getById] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiProductToProduct(parsed.data) };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: ProductForm): Promise<ServiceResult<void>> {
    try {
      const hasDescription = Boolean(data.description);
      const hasImageUrl = Boolean(data.imageUrl);

      const payload: ProductForm = { ...data };
      if (!hasDescription) delete payload.description;
      if (!hasImageUrl) delete payload.imageUrl;

      const result = await api.post<unknown>("/products", payload);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(
    productId: string,
    data: ProductForm
  ): Promise<ServiceResult<void>> {
    try {
      const hasDescription = Boolean(data.description);
      const hasImageUrl = Boolean(data.imageUrl);

      const payload: ProductForm = { ...data };
      if (!hasDescription) delete payload.description;
      if (!hasImageUrl) delete payload.imageUrl;

      const result = await api.put<unknown>(`/products/${productId}`, payload);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async delete(
    productId: string
  ): Promise<ServiceResult<{ success: boolean; id: string }>> {
    try {
      const result = await api.delete<unknown>(`/products/${productId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: { success: true, id: productId } };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
