import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type {
  GetMyPermissionsResponse,
  GetPermissionsCatalogResponse,
} from "./interfaces/permissions.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const permissionsService = {
  async getMyPermissions(): Promise<ServiceResult<GetMyPermissionsResponse>> {
    try {
      const result = await api.get<unknown>("/users/permissions");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetMyPermissionsResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar permissões do usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getCatalog(): Promise<ServiceResult<GetPermissionsCatalogResponse>> {
    try {
      const result = await api.get<unknown>("/permissions");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetPermissionsCatalogResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar catálogo de permissões";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async addUserPermissions(
    userId: string,
    permissions: string[]
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.patch<unknown>(
        `/users/${userId}/permissions`,
        { permissions }
      );

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao adicionar permissões ao usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async removeUserPermissions(
    userId: string,
    permissions: string[]
  ): Promise<ServiceResult<void>> {
    try {
      const result = await api.delete<unknown>(`/users/${userId}/permissions`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao remover permissões do usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
