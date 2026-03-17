import type { ReactNode } from "react";
import type {
  Order,
  OrderItem,
  OrderStatus,
} from "@/shared/schemas/order.schema";
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
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onEditClosedBy?: (orderSessionId: string) => void;
  showActionsColumn?: boolean;
}

export interface OrdersTableHeaderProps {
  headerGroups: HeaderGroup<Order>[];
}

export interface OrdersTableBodyProps {
  rows: Row<Order>[];
  expandedRowId?: string;
  onRowToggle: (rowId: string) => void;
  totalLabel: string;
}

export interface OrderItemsDetailsProps {
  items: OrderItem[];
  columnsCount: number;
  totalLabel: string;
  isExpanded: boolean;
}
