import type { Order } from "@/shared/schemas/order.schema";
import type { HeaderGroup, Row } from "@tanstack/react-table";

export interface OrdersTableProps {
  orders: Order[];
}

export interface OrdersTableHeaderProps {
  headerGroups: HeaderGroup<Order>[];
  getSortTitle: (canSort: boolean, nextSortOrder: string | false) => string | undefined;
}

export interface OrdersTableBodyProps {
  rows: Row<Order>[];
}
