import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type { User } from "@/shared/schemas/user.schema";
import type {
  CreateUserRequestBody,
  GetUserResponse,
  GetUsersApiResponse,
  GetUsersRequestQuery,
  GetUsersResponse,
  UpdateMeRequestBody,
  UpdateUserRequestBody,
} from "./interfaces/users.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiUserToUser(apiUser: GetUserResponse): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    username: apiUser.username,
    email: apiUser.email,
    role: apiUser.role,
    document: apiUser.document,
    documentType: apiUser.documentType,
    birthDate: apiUser.birthDate,
    businessId: apiUser.businessId,
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
    deletedAt: apiUser.deletedAt ? new Date(apiUser.deletedAt) : undefined,
    permissions: apiUser.permissions,
  };
}

export const usersService = {
  async getAll(
    queryParams: GetUsersRequestQuery
  ): Promise<ServiceResult<GetUsersResponse>> {
    try {
      const { page, size, orderBy, direction, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));

      const hasOrderBy = orderBy !== undefined;
      if (hasOrderBy) {
        params.set("orderBy", orderBy);
      }

      const hasDirection = direction !== undefined;
      if (hasDirection) {
        params.set("direction", direction);
      }

      const roleFilter = filters.role;
      const hasRoleFilter = roleFilter !== undefined && roleFilter.length > 0;
      if (hasRoleFilter) {
        params.set("roles", roleFilter.join(","));
      }
      if (filters.search) {
        params.set("search", filters.search);
      }
      if (filters.includeDeleted) {
        params.set("includeDeleted", "true");
      }

      const result = await api.get<unknown>(`/users?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const apiData = result.data as GetUsersApiResponse;
      const mappedItems = apiData.items.map(mapApiUserToUser);

      return {
        data: {
          items: mappedItems,
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
        error instanceof Error ? error.message : "Erro ao buscar usuários";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async disable(userId: string): Promise<ServiceResult<void>> {
    try {
      const result = await api.delete<unknown>(`/users/${userId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao desabilitar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async restore(userId: string): Promise<ServiceResult<void>> {
    try {
      const result = await api.patch<unknown>(`/users/${userId}/restore`, {});

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao restaurar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async updateMe(data: UpdateMeRequestBody): Promise<ServiceResult<void>> {
    try {
      const result = await api.patch<unknown>("/users/me", data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(
    userId: string,
    data: UpdateUserRequestBody
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.put<unknown>(`/users/${userId}`, data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: CreateUserRequestBody): Promise<ServiceResult<void>> {
    try {
      const result = await api.post<unknown>("/users", data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
