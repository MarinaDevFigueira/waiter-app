import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiPaginatedBusinessSchema,
  type BusinessQueryParams,
  type ApiBusinessItem,
} from "./business.schema";
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
};
