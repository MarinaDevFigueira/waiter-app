import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiPaginatedBusinessSchema,
  type BusinessQueryParams,
  type ApiBusinessItem,
} from "./schemas/get-all.schema";
import {
  apiBusinessDetailSchema,
  type ApiBusinessDetail,
} from "./schemas/get-by-id.schema";
import type { BusinessUpdateForm } from "./schemas/update.schema";
import type { Business } from "@/shared/schemas/business.schema";

interface PaginatedBusinessResult {
  items: Business[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function mapApiBusinessItemToBusiness(apiItem: ApiBusinessItem): Business {
  return {
    id: apiItem.id,
    name: apiItem.name,
    logoUrl: apiItem.logoUrl ?? undefined,
    city: apiItem.city ?? undefined,
    state: apiItem.state ?? undefined,
    createdAt: new Date(apiItem.createdAt),
  };
}

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const businessService = {
  async getAll(
    queryParams: BusinessQueryParams
  ): Promise<ServiceResult<PaginatedBusinessResult>> {
    try {
      const { page, size, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(size));

      const searchValue = filters.search;
      const hasSearch = searchValue !== undefined && searchValue !== "";
      if (hasSearch) {
        params.set("search", searchValue);
      }

      const hasIncludeDeleted = filters.includeDeleted === true;
      if (hasIncludeDeleted) {
        params.set("includeDeleted", "true");
      }

      const result = await api.get<unknown>(`/business?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiPaginatedBusinessSchema.safeParse(result.data);
      const validationFailed = !parsed.success;
      if (validationFailed) {
        const zodMessage = formatZodError(parsed.error);
        const error = new Error(zodMessage);
        logger.error("[businessService.getAll] Validation error", error);
        return { error: "Resposta inválida do servidor" };
      }

      const apiData = parsed.data;
      const totalPages = Math.ceil(apiData.total / apiData.limit);
      const hasNextPage = apiData.page < totalPages;
      const hasPreviousPage = apiData.page > 1;

      const mappedItems = apiData.items.map(mapApiBusinessItemToBusiness);

      const mappedData: PaginatedBusinessResult = {
        items: mappedItems,
        total: apiData.total,
        page: apiData.page,
        size: apiData.limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      return { data: mappedData };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresas";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getById(id: string): Promise<ServiceResult<ApiBusinessDetail>> {
    try {
      const result = await api.get<unknown>(`/business/${id}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiBusinessDetailSchema.safeParse(result.data);
      const validationFailed = !parsed.success;
      if (validationFailed) {
        const zodMessage = formatZodError(parsed.error);
        const error = new Error(zodMessage);
        logger.error("[businessService.getById] Validation error", error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresa";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(id: string, data: BusinessUpdateForm): Promise<ServiceResult<void>> {
    try {
      const result = await api.put<unknown>(`/business/${id}`, data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar empresa";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
