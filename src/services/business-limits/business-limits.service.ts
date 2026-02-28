import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiBusinessLimitsSchema,
  type ApiBusinessLimits,
} from "./schemas/get.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const businessLimitsService = {
  async get(): Promise<ServiceResult<ApiBusinessLimits>> {
    try {
      const result = await api.get<unknown>("/business-limits");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiBusinessLimitsSchema.safeParse(result.data);
      const validationFailed = !parsed.success;
      if (validationFailed) {
        const zodMessage = formatZodError(parsed.error);
        const error = new Error(zodMessage);
        logger.error("[businessLimitsService.get] Validation error", error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar limites";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
