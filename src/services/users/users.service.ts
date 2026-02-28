import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import { apiPaginatedUsersSchema } from "./users.schema";
import type { ApiUser, UserQueryParams } from "./users.schema";
import type { User } from "@/shared/schemas/user.schema";

interface PaginatedUsersResult {
  items: User[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function mapApiUserToUser(apiUser: ApiUser): User {
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

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const usersService = {
  async getAll(
    queryParams: UserQueryParams
  ): Promise<ServiceResult<PaginatedUsersResult>> {
    try {
      const { page, size, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(size));

      if (filters.role?.length) {
        params.set("role", filters.role.join(","));
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

      const parsed = apiPaginatedUsersSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[usersService.getAll] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      const apiData = parsed.data;
      const totalPages = Math.ceil(apiData.total / apiData.limit);
      const hasNextPage = apiData.page < totalPages;
      const hasPreviousPage = apiData.page > 1;

      const mappedItems = apiData.items.map(mapApiUserToUser);

      const mappedData: PaginatedUsersResult = {
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
    } catch (error) {
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao restaurar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async updateMe(data: {
    name?: string;
    email?: string;
    password?: string;
  }): Promise<ServiceResult<void>> {
    try {
      const result = await api.patch<unknown>("/users/me", data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
      document?: string;
      documentType?: "cpf" | "rg";
      birthDate?: string;
    }
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.put<unknown>(`/users/${userId}`, data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
