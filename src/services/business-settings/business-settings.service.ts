import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiBusinessSettingsSchema,
  type ApiBusinessSettings,
} from "./schemas/get.schema";
import type { BusinessSettingsUpdateForm } from "./schemas/update.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const businessSettingsService = {
  async get(): Promise<ServiceResult<ApiBusinessSettings>> {
    try {
      const result = await api.get<unknown>("/business-settings");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiBusinessSettingsSchema.safeParse(result.data);
      const validationFailed = !parsed.success;
      if (validationFailed) {
        const zodMessage = formatZodError(parsed.error);
        const error = new Error(zodMessage);
        logger.error("[businessSettingsService.get] Validation error", error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar configurações";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(data: BusinessSettingsUpdateForm): Promise<ServiceResult<void>> {
    try {
      const result = await api.patch<unknown>("/business-settings", data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar configurações";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
