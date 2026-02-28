import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  userPermissionsResponseSchema,
  permissionsCatalogResponseSchema,
} from "@/shared/schemas/permission.schema";
import type {
  UserPermissionsResponse,
  PermissionsCatalogResponse,
} from "@/shared/schemas/permission.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const permissionsService = {
  async getMyPermissions(): Promise<ServiceResult<UserPermissionsResponse>> {
    try {
      const result = await api.get<unknown>("/users/permissions");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = userPermissionsResponseSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error(
          "[permissionsService.getMyPermissions] Erro de validação",
          new Error(zodMessage)
        );
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar permissões do usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getCatalog(): Promise<ServiceResult<PermissionsCatalogResponse>> {
    try {
      const result = await api.get<unknown>("/permissions");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = permissionsCatalogResponseSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error(
          "[permissionsService.getCatalog] Erro de validação",
          new Error(zodMessage)
        );
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
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
