import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type { CategoryForm, Category } from "@/shared/schemas/category.schema";
import type {
  GetCategoryResponse,
  GetCategoryTranslationsResponse,
  GetCategoriesRequestQuery,
  GetCategoriesResponse,
} from "./interfaces/categories.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiCategoryToCategory(raw: GetCategoryResponse): Category {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    sortOrder: raw.sortOrder,
    active: raw.active,
    businessId: raw.businessId,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export const categoriesService = {
  async getAll(
    queryParams: GetCategoriesRequestQuery,
  ): Promise<ServiceResult<GetCategoriesResponse>> {
    try {
      const { page, size, orderBy, direction, search } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));
      params.set("orderBy", orderBy);
      params.set("direction", direction);

      if (search) params.set("search", search);

      const result = await api.get<unknown>(`/categories?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const apiData = result.data as {
        items: GetCategoryResponse[];
        total: number;
        page: number;
        size: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };

      const items = apiData.items.map(mapApiCategoryToCategory);

      return {
        data: {
          items,
          total: apiData.total,
          page: apiData.page,
          size: apiData.size,
          totalPages: apiData.totalPages,
          hasNextPage: apiData.hasNextPage,
          hasPreviousPage: apiData.hasPreviousPage,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar categorias";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getById(categoryId: string): Promise<ServiceResult<Category>> {
    try {
      const result = await api.get<unknown>(`/categories/${categoryId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return {
        data: mapApiCategoryToCategory(result.data as GetCategoryResponse),
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: CategoryForm): Promise<ServiceResult<void>> {
    try {
      const result = await api.post<unknown>("/categories", data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(
    categoryId: string,
    data: CategoryForm,
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.patch<unknown>(
        `/categories/${categoryId}`,
        data,
      );

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async delete(categoryId: string): Promise<ServiceResult<void>> {
    try {
      const result = await api.delete<unknown>(`/categories/${categoryId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getTranslations(
    categoryId: string,
  ): Promise<ServiceResult<GetCategoryTranslationsResponse>> {
    try {
      const result = await api.get<unknown>(
        `/categories/${categoryId}/translations`,
      );

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetCategoryTranslationsResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar traduções";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
