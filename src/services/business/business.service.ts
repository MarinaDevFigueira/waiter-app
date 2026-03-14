import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type { Business } from "@/shared/schemas/business.schema";
import type {
  GetBusinessItemResponse,
  GetBusinessesApiResponse,
  GetBusinessDetailResponse,
  GetBusinessesRequestQuery,
  UpdateBusinessRequestBody,
  GetBusinessesResponse,
  GetPublicBusinessResponse,
} from "./interfaces/business.interface";

function mapApiBusinessItemToBusiness(apiItem: GetBusinessItemResponse): Business {
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
    queryParams: GetBusinessesRequestQuery
  ): Promise<ServiceResult<GetBusinessesResponse>> {
    try {
      const { page, size, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));

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

      const apiData = result.data as GetBusinessesApiResponse;
      const totalPages = apiData.totalPages ?? Math.ceil(apiData.total / apiData.size);
      const hasNextPage = apiData.hasNextPage ?? apiData.page < totalPages;
      const hasPreviousPage = apiData.hasPreviousPage ?? apiData.page > 1;

      const mappedItems = apiData.items.map(mapApiBusinessItemToBusiness);

      return {
        data: {
          items: mappedItems,
          total: apiData.total,
          page: apiData.page,
          size: apiData.size,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresas";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getById(id: string): Promise<ServiceResult<GetBusinessDetailResponse>> {
    try {
      const result = await api.get<unknown>(`/business/${id}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetBusinessDetailResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresa";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getMe(): Promise<ServiceResult<GetBusinessDetailResponse>> {
    try {
      const result = await api.get<unknown>("/business/me");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetBusinessDetailResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresa do usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getPublicById(id: string): Promise<ServiceResult<GetPublicBusinessResponse>> {
    try {
      const result = await api.get<unknown>(`/public/business/${id}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetPublicBusinessResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresa pública";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(id: string, data: UpdateBusinessRequestBody): Promise<ServiceResult<void>> {
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
