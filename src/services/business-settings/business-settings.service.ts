import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type {
  GetBusinessSettingsResponse,
  UpdateBusinessSettingsRequestBody,
} from "./interfaces/business-settings.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const businessSettingsService = {
  async get(): Promise<ServiceResult<GetBusinessSettingsResponse>> {
    try {
      const result = await api.get<unknown>("/business-settings");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const rawData = result.data as {
        id: string;
        primaryColor: string;
        secondaryColor: string;
        enabledLanguages: string | string[];
        businessId?: string | null;
      };

      const enabledLanguages = typeof rawData.enabledLanguages === "string"
        ? (() => {
            try {
              const parsed = JSON.parse(rawData.enabledLanguages);
              return Array.isArray(parsed) ? parsed : [rawData.enabledLanguages];
            } catch {
              return [rawData.enabledLanguages];
            }
          })()
        : rawData.enabledLanguages;

      const settings: GetBusinessSettingsResponse = {
        id: rawData.id,
        primaryColor: rawData.primaryColor,
        secondaryColor: rawData.secondaryColor,
        enabledLanguages,
        businessId: rawData.businessId,
      };

      return { data: settings };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar configurações";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async update(data: UpdateBusinessSettingsRequestBody): Promise<ServiceResult<void>> {
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
