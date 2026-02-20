import { api } from "@/services/api";
import {
  apiOrderSessionSchema,
  apiOrderSessionSummarySchema,
  type ApiOrderSession,
  type ApiOrderSessionSummary,
  type OrderSession,
  type OrderSessionSummary,
} from "./order-sessions.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiOrderSessionToOrderSession(raw: ApiOrderSession): OrderSession {
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
  raw: ApiOrderSessionSummary
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

      const parsed = apiOrderSessionSchema.safeParse(result.data);
      if (!parsed.success) {
        console.error(parsed.error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderSessionToOrderSession(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao abrir sessão de pedidos";
      return { error: errorMessage };
    }
  },

  async getActive(): Promise<ServiceResult<OrderSession | null>> {
    try {
      const result = await api.get<unknown>("/order-sessions/active");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const noActiveSession = result.data === null || result.data === undefined;
      if (noActiveSession) {
        return { data: null };
      }

      const parsed = apiOrderSessionSchema.safeParse(result.data);
      if (!parsed.success) {
        console.error(parsed.error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderSessionToOrderSession(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar sessão ativa";
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

      const parsed = apiOrderSessionSummarySchema.safeParse(result.data);
      if (!parsed.success) {
        console.error(parsed.error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderSessionSummaryToOrderSessionSummary(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fechar sessão de pedidos";
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

      const parsed = apiOrderSessionSummarySchema.safeParse(result.data);
      if (!parsed.success) {
        console.error(parsed.error);
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderSessionSummaryToOrderSessionSummary(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar resumo da sessão de pedidos";
      return { error: errorMessage };
    }
  },
};
