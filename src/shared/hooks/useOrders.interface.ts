import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";

export { SortDirection, OrdersOrderByEnum };

export interface OrdersQueryParams {
  search: string;
  orderBy: OrdersOrderByEnum;
  direction: SortDirection;
}

export interface UseOrdersReturn {
  orders: Order[];
  queryParams: OrdersQueryParams;
  isLoading: boolean;
  setQueryParams: React.Dispatch<React.SetStateAction<OrdersQueryParams>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  refetch: () => Promise<void>;
}
