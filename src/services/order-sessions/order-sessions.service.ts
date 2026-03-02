import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type {
  GetOrderSessionResponse,
  GetOrderSessionSummaryResponse,
  GetOrderSessionQrCodeResponse,
  OrderSession,
  OrderSessionSummary,
  UpdateOrderSessionClosedByRequestBody,
  UpdateOrderSessionClosedByResponse,
} from "./interfaces/order-sessions.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiOrderSessionToOrderSession(raw: GetOrderSessionResponse): OrderSession {
  return {
    id: raw.id,
    tableUserId: raw.tableUserId,
    businessId: raw.businessId,
    status: raw.status,
    openedAt: new Date(raw.openedAt),
    closedAt: raw.closedAt ? new Date(raw.closedAt) : null,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

function mapApiOrderSessionSummaryToOrderSessionSummary(
  raw: GetOrderSessionSummaryResponse
): OrderSessionSummary {
  return {
    orderSession: mapApiOrderSessionToOrderSession(raw.orderSession),
    orders: raw.orders.map((order) => ({
      id: order.id,
      status: order.status,
      timestamp: new Date(order.timestamp),
      items: order.items,
    })),
    totalAmount: raw.totalAmount,
  };
}

export const orderSessionsService = {
  async open(): Promise<ServiceResult<OrderSession>> {
    try {
      const result = await api.post<unknown>("/order-sessions/open", {});

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: mapApiOrderSessionToOrderSession(result.data as GetOrderSessionResponse) };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao abrir sessão de pedidos";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getActive(): Promise<ServiceResult<OrderSession | null>> {
    try {
      const result = await api.get<unknown>("/order-sessions/active");

      const hasError = "error" in result;
      if (hasError) {
        const isNotFound =
          result.error.includes("404") ||
          result.error.toLowerCase().includes("not found") ||
          result.error.toLowerCase().includes("não encontrad");
        if (isNotFound) {
          return { data: null };
        }
        return { error: result.error };
      }

      const noActiveSession = result.data === null || result.data === undefined;
      if (noActiveSession) {
        return { data: null };
      }

      return { data: mapApiOrderSessionToOrderSession(result.data as GetOrderSessionResponse) };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar sessão ativa";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async close(sessionId: string): Promise<ServiceResult<OrderSessionSummary>> {
    try {
      const result = await api.post<unknown>(`/order-sessions/${sessionId}/close`, {});

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: mapApiOrderSessionSummaryToOrderSessionSummary(result.data as GetOrderSessionSummaryResponse) };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fechar sessão de pedidos";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getSummary(sessionId: string): Promise<ServiceResult<OrderSessionSummary>> {
    try {
      const result = await api.get<unknown>(`/order-sessions/${sessionId}/summary`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: mapApiOrderSessionSummaryToOrderSessionSummary(result.data as GetOrderSessionSummaryResponse) };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar resumo da sessão de pedidos";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getQrCode(sessionId: string): Promise<ServiceResult<GetOrderSessionQrCodeResponse>> {
    try {
      const result = await api.get<unknown>(`/order-sessions/${sessionId}/qrcode`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as GetOrderSessionQrCodeResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao gerar QR code da sessão";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async updateClosedBy(
    sessionId: string,
    data: UpdateOrderSessionClosedByRequestBody
  ): Promise<ServiceResult<UpdateOrderSessionClosedByResponse>> {
    try {
      const result = await api.patch<unknown>(`/order-sessions/${sessionId}/closed-by`, data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data as UpdateOrderSessionClosedByResponse };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao atualizar responsável pelo fechamento";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
