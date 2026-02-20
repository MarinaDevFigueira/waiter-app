import { api } from "@/services/api";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiOrderSchema,
  apiOrderPaginatedListSchema,
  createOrderRequestSchema,
  updateOrderStatusSchema,
} from "./orders.schema";
import type { ApiOrder, CreateOrderRequest } from "./orders.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export interface PaginatedOrders {
  items: Order[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function mapApiOrderToOrder(raw: ApiOrder): Order {
  return {
    id: raw.id,
    userName: raw.userName,
    status: raw.status,
    timestamp: new Date(raw.timestamp),
    items: raw.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      preco: item.price,
    })),
    createdAt: new Date(raw.createdAt),
    createdBy: "api",
    updatedAt: new Date(raw.updatedAt),
    updatedBy: "api",
    deletedAt: null,
    deletedBy: null,
  };
}

export const ordersService = {
  async getAll(filters: { status?: string; search?: string; orderBy?: string; direction?: string; page?: number; size?: number; orderSessionId?: string } = {}): Promise<ServiceResult<PaginatedOrders>> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      if (filters.orderBy) params.set("orderBy", filters.orderBy);
      if (filters.direction) params.set("direction", filters.direction);
      if (filters.page != null) params.set("page", String(filters.page));
      if (filters.size != null) params.set("size", String(filters.size));
      if (filters.orderSessionId) params.set("orderSessionId", filters.orderSessionId);

      const query = params.toString();
      const path = query ? `/orders?${query}` : "/orders";

      const result = await api.get<unknown>(path);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiOrderPaginatedListSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[ordersService.getAll] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return {
        data: {
          items: parsed.data.items.map(mapApiOrderToOrder),
          total: parsed.data.total,
          page: parsed.data.page,
          size: parsed.data.size,
          totalPages: parsed.data.totalPages,
          hasNextPage: parsed.data.hasNextPage,
          hasPreviousPage: parsed.data.hasPreviousPage,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pedidos";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async getById(orderId: string): Promise<ServiceResult<Order>> {
    try {
      const result = await api.get<unknown>(`/orders/${orderId}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiOrderSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[ordersService.getById] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderToOrder(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pedido";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: CreateOrderRequest): Promise<ServiceResult<void>> {
    try {
      const validated = createOrderRequestSchema.safeParse(data);
      const validationFailed = !validated.success;
      if (validationFailed) {
        const zodMessage = formatZodError(validated.error);
        logger.error("[ordersService.create] Erro de validação", new Error(zodMessage));
        return { error: "Dados do pedido inválidos" };
      }

      const result = await api.post<unknown>("/orders", validated.data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar pedido";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<ServiceResult<void>> {
    try {
      const validated = updateOrderStatusSchema.safeParse({ status });
      const validationFailed = !validated.success;
      if (validationFailed) {
        const zodMessage = formatZodError(validated.error);
        logger.error("[ordersService.updateStatus] Erro de validação", new Error(zodMessage));
        return { error: "Status inválido" };
      }

      const result = await api.patch<unknown>(`/orders/${orderId}/status`, {
        status: validated.data.status,
      });

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar status do pedido";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
