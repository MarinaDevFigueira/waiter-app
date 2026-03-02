import { api } from "@/services/api";
import { logger } from "@/lib/logger";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const cacheService = {
  async clear(): Promise<ServiceResult<void>> {
    try {
      const result = await api.post<unknown>("/cache/clear", {});

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao limpar cache";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
