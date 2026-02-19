import type { ReactNode } from "react";
import type { Order } from "@/shared/schemas/order.schema";
import type { HeaderGroup, Row } from "@tanstack/react-table";
import type { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import type { SortDirection } from "@/shared/enums/sort-direction.enum";

export interface OrdersTableSortState {
  orderBy: OrdersOrderByEnum;
  direction: SortDirection;
}

export interface OrdersTableRootProps {
  children: ReactNode;
}

export interface OrdersTableProps {
  orders: Order[];
  sortState: OrdersTableSortState;
  onSortChange: (sort: OrdersTableSortState) => void;
}

export interface OrdersTableHeaderProps {
  headerGroups: HeaderGroup<Order>[];
  sortState: OrdersTableSortState;
  getSortTitle: (canSort: boolean, columnId: string) => string | undefined;
  onColumnSort: (columnId: string) => void;
}

export interface OrdersTableBodyProps {
  rows: Row<Order>[];
}
