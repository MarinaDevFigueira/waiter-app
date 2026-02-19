import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";

export { SortDirection, OrdersOrderByEnum };

export interface OrdersQueryParams {
  search: string;
  orderBy: OrdersOrderByEnum;
  direction: SortDirection;
  page: number;
  size: number;
}

export interface UseOrdersReturn {
  orders: Order[];
  queryParams: OrdersQueryParams;
  isLoading: boolean;
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setQueryParams: React.Dispatch<React.SetStateAction<OrdersQueryParams>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  refetch: () => void;
}
