import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import type {
  GetOrderResponse,
  GetOrdersApiResponse,
  CreateOrderRequestBody,
  GetOrdersResponse,
  GetOrdersRequestQuery,
} from "./interfaces/orders.interface";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

function mapApiOrderToOrder(raw: GetOrderResponse): Order {
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
    orderSessionId: raw.orderSessionId,
    closedBy: raw.closedBy,
    createdAt: new Date(raw.createdAt),
    createdBy: "api",
    updatedAt: new Date(raw.updatedAt),
    updatedBy: "api",
    deletedAt: null,
    deletedBy: null,
  };
}

export const ordersService = {
  async getAll(filters: GetOrdersRequestQuery = {}): Promise<ServiceResult<GetOrdersResponse>> {
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

      const apiData = result.data as GetOrdersApiResponse;

      return {
        data: {
          items: apiData.items.map(mapApiOrderToOrder),
          total: apiData.total,
          page: apiData.page,
          size: apiData.size,
          totalPages: apiData.totalPages,
          hasNextPage: apiData.hasNextPage,
          hasPreviousPage: apiData.hasPreviousPage,
        },
      };
    } catch (error: unknown) {
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

      return { data: mapApiOrderToOrder(result.data as GetOrderResponse) };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pedido";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: CreateOrderRequestBody): Promise<ServiceResult<void>> {
    try {
      const result = await api.post<unknown>("/orders", data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
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
      const result = await api.patch<unknown>(`/orders/${orderId}/status`, {
        status,
      });

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: undefined };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar status do pedido";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
