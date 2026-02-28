import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type { GetBusinessLimitsResponse } from "./interfaces/business-limits.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const businessLimitsService = {
  async get(): Promise<ServiceResult<GetBusinessLimitsResponse>> {
    try {
      const result = await api.get<unknown>("/business-limits");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetBusinessLimitsResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar limites";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
