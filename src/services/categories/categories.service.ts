import { api } from "@/services/api";
import type { CategoryForm, Category } from "@/shared/schemas/category.schema";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiCategoryListSchema,
  apiCategorySchema,
} from "./categories.schema";
import type { PaginatedCategories, ApiCategory, CategoryQueryParams } from "./categories.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiCategoryToCategory(raw: ApiCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    sortOrder: raw.sortOrder,
    active: raw.active,
    businessId: raw.businessId,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export const categoriesService = {
  async getAll(
    queryParams: CategoryQueryParams
  ): Promise<ServiceResult<PaginatedCategories>> {
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

      const parsed = apiCategoryListSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[categoriesService.getAll] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      const items = parsed.data.items.map(mapApiCategoryToCategory);

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

      const parsed = apiCategorySchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[categoriesService.getById] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiCategoryToCategory(parsed.data) };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: CategoryForm): Promise<ServiceResult<void>> {
    try {
      const hasDescription = Boolean(data.description);

      const payload: CategoryForm = { ...data };
      if (!hasDescription) delete payload.description;

      const result = await api.post<unknown>("/categories", payload);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(
    categoryId: string,
    data: CategoryForm
  ): Promise<ServiceResult<void>> {
    try {
      const hasDescription = Boolean(data.description);

      const payload: CategoryForm = { ...data };
      if (!hasDescription) delete payload.description;

      const result = await api.patch<unknown>(`/categories/${categoryId}`, payload);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async delete(
    categoryId: string
  ): Promise<ServiceResult<{ success: boolean; id: string }>> {
    try {
      const result = await api.delete<unknown>(`/categories/${categoryId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: { success: true, id: categoryId } };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar categoria";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
