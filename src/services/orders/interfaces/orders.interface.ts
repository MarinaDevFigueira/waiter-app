import type { Order } from "@/shared/schemas/order.schema";
import type { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";

export type OrderStatus = "pending" | "preparing" | "ready" | "canceled";

export interface GetOrderItemResponse {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface GetOrderResponse {
  id: string;
  userName: string;
  status: OrderStatus;
  timestamp: string;
  items: GetOrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersApiResponse {
  items: GetOrderResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateOrderRequestItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequestBody {
  items: CreateOrderRequestItem[];
  orderSessionId?: string;
}

export interface UpdateOrderStatusRequestBody {
  status: OrderStatus;
}

export interface GetOrdersResponse {
  items: Order[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetOrdersRequestQuery {
  status?: string;
  search?: string;
  userId?: string;
  orderSessionId?: string;
  orderBy?: OrdersOrderByEnum;
  direction?: SortDirection;
  page?: number;
  size?: number;
}
