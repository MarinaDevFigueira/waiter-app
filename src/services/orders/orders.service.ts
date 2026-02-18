import { api } from "@/services/api";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import {
  apiOrderSchema,
  apiOrderListSchema,
  createOrderRequestSchema,
  updateOrderStatusSchema,
} from "./orders.schema";
import type { ApiOrder, CreateOrderRequest } from "./orders.schema";

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

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
  async getAll(filters: { status?: string; search?: string; orderBy?: string; direction?: string } = {}): Promise<ServiceResult<Order[]>> {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      if (filters.orderBy) params.set("orderBy", filters.orderBy);
      if (filters.direction) params.set("direction", filters.direction);

      const query = params.toString();
      const path = query ? `/orders?${query}` : "/orders";

      const result = await api.get<unknown>(path);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiOrderListSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data.items.map(mapApiOrderToOrder) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pedidos";
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
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderToOrder(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar pedido";
      return { error: errorMessage };
    }
  },

  async create(data: CreateOrderRequest): Promise<ServiceResult<Order>> {
    try {
      const validated = createOrderRequestSchema.safeParse(data);
      if (!validated.success) {
        return { error: "Dados do pedido inválidos" };
      }

      const result = await api.post<unknown>("/orders", validated.data);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiOrderSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderToOrder(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar pedido";
      return { error: errorMessage };
    }
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<ServiceResult<Order>> {
    try {
      const validated = updateOrderStatusSchema.safeParse({ status });
      if (!validated.success) {
        return { error: "Status inválido" };
      }

      const result = await api.patch<unknown>(`/orders/${orderId}/status`, {
        status: validated.data.status,
      });

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiOrderSchema.safeParse(result.data);
      if (!parsed.success) {
        return { error: "Resposta inválida do servidor" };
      }

      return { data: mapApiOrderToOrder(parsed.data) };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar status do pedido";
      return { error: errorMessage };
    }
  },
};
