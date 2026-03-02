import type { Order } from "@/shared/schemas/order.schema";
import type { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";

export type OrderStatus = "pending" | "preparing" | "ready" | "waiting_delivery_man" | "in_delivery" | "delivered" | "finished" | "canceled";

export interface GetOrderItemResponse {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface GetOrderClosedByResponse {
  id: string;
  name: string;
  email?: string;
}

export interface GetOrderResponse {
  id: string;
  userName: string;
  status: OrderStatus;
  timestamp: string;
  items: GetOrderItemResponse[];
  orderSessionId: string | null;
  closedBy: GetOrderClosedByResponse | null;
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
