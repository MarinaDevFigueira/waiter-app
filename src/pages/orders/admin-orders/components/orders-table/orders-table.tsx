import { useMemo, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type {
  OrdersTableProps,
  OrdersTableHeaderProps,
  OrdersTableBodyProps,
  OrdersTableRootProps,
  OrdersTableSortState,
} from "@/pages/orders/admin-orders/components/orders-table/orders-table.interface";

const COLUMN_TO_ORDER_BY: Partial<Record<string, OrdersOrderByEnum>> = {
  userName: OrdersOrderByEnum.USER_ID,
  status: OrdersOrderByEnum.STATUS,
  timestamp: OrdersOrderByEnum.TIMESTAMP,
  createdAt: OrdersOrderByEnum.CREATED_AT,
  updatedAt: OrdersOrderByEnum.UPDATED_AT,
};

const SORT_INDICATORS: Record<SortDirection, string> = {
  [SortDirection.ASC]: "▲",
  [SortDirection.DESC]: "▼",
};

const DEFAULT_SORT_INDICATOR = "⬍";

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  preparing: "bg-blue-500/10 text-blue-600",
  ready: "bg-green-500/10 text-green-600",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function Root({ children }: OrdersTableRootProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="w-full">{children}</table>
      </div>
    </div>
  );
}

function Header({ headerGroups, sortState, getSortTitle, onColumnSort }: OrdersTableHeaderProps) {
  return (
    <thead className="bg-muted/50 border-b border-border">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const columnId = header.column.id;
            const isCurrentSortColumn = canSort && COLUMN_TO_ORDER_BY[columnId] === sortState.orderBy;
            const sortIndicator = isCurrentSortColumn ? SORT_INDICATORS[sortState.direction] : DEFAULT_SORT_INDICATOR;
            const sortTitle = getSortTitle(canSort, columnId);
            const handleClick = canSort ? () => onColumnSort(columnId) : undefined;
            const headerClassName = canSort
              ? "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
              : "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider";

            return (
              <th
                key={header.id}
                className={headerClassName}
                onClick={handleClick}
                title={sortTitle}
              >
                <div className="flex items-center gap-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                  {canSort ? (
                    <span className="text-muted-foreground/70 text-xs">{sortIndicator}</span>
                  ) : null}
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

function Body({ rows }: OrdersTableBodyProps) {
  return (
    <tbody className="divide-y divide-border">
      {rows.map((row) => (
        <tr key={row.id} className="hover:bg-muted/30 transition-colors">
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-3 text-sm text-foreground">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function OrdersTable({ orders, sortState, onSortChange }: OrdersTableProps) {
  const { t } = useTranslation();

  const formatDate = useCallback((date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  }, []);

  const getStatusLabel = useCallback(
    (status: OrderStatus) => t(`common.status.${status}`),
    [t],
  );

  const getSortTitle = useCallback(
    (canSort: boolean, columnId: string): string | undefined => {
      if (!canSort) return undefined;
      const orderBy = COLUMN_TO_ORDER_BY[columnId];
      if (!orderBy) return undefined;

      const isActive = orderBy === sortState.orderBy;
      if (!isActive) return t("common.sort.ascending");
      return sortState.direction === SortDirection.ASC
        ? t("common.sort.descending")
        : t("common.sort.ascending");
    },
    [t, sortState],
  );

  const onColumnSort = useCallback(
    (columnId: string) => {
      const orderBy = COLUMN_TO_ORDER_BY[columnId];
      if (!orderBy) return;

      const isActive = orderBy === sortState.orderBy;
      const nextDirection = isActive && sortState.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

      const nextSort: OrdersTableSortState = { orderBy, direction: nextDirection };
      onSortChange(nextSort);
    },
    [sortState, onSortChange],
  );

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "userName",
        header: t("orders.admin.table.columns.userName"),
        cell: (info) => {
          const userName = info.getValue() as string;
          return <span className="font-medium text-foreground">{userName}</span>;
        },
      },
      {
        accessorKey: "status",
        header: t("orders.admin.table.columns.status"),
        cell: (info) => {
          const status = info.getValue() as OrderStatus;
          const statusLabel = getStatusLabel(status);
          const statusClassName = STATUS_CLASSES[status];
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusClassName}`}
            >
              {statusLabel}
            </span>
          );
        },
      },
      {
        id: "items",
        header: t("orders.admin.table.columns.items"),
        accessorFn: (row) => row.items,
        cell: (info) => {
          const order = info.row.original;
          const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
          const firstItems = order.items.slice(0, 2);
          const preview = firstItems.map((i) => `${i.quantity}x ${i.name}`).join(", ");
          const hasMoreItems = order.items.length > 2;
          const ellipsis = hasMoreItems ? "…" : "";
          const itemsLabel = t("orders.admin.table.itemsTotal");
          return (
            <div>
              <div className="text-sm text-foreground">
                {preview}
                {ellipsis}
              </div>
              <div className="text-xs text-muted-foreground">
                {itemsCount} {itemsLabel}
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        id: "total",
        header: t("orders.admin.table.columns.total"),
        accessorFn: (row) => {
          return row.items.reduce((acc, item) => acc + item.quantity * item.preco, 0);
        },
        cell: (info) => {
          const total = info.getValue() as number;
          const formattedTotal = formatCurrency(total);
          return <span>{formattedTotal}</span>;
        },
      },
      {
        accessorKey: "timestamp",
        header: t("orders.admin.table.columns.timestamp"),
        cell: (info) => {
          const date = info.getValue() as Date;
          const formattedDate = formatDate(date);
          return <span>{formattedDate}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: t("orders.admin.table.columns.createdAt"),
        cell: (info) => {
          const date = info.getValue() as Date;
          const formattedDate = formatDate(date);
          const createdBy = info.row.original.createdBy;
          return (
            <div>
              <div>{formattedDate}</div>
              <div className="text-xs text-muted-foreground">por {createdBy}</div>
            </div>
          );
        },
      },
    ],
    [t, getStatusLabel, formatDate],
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <Root>
      <Header
        headerGroups={headerGroups}
        sortState={sortState}
        getSortTitle={getSortTitle}
        onColumnSort={onColumnSort}
      />
      <Body rows={rows} />
    </Root>
  );
}

OrdersTable.Root = Root;
OrdersTable.Header = Header;
OrdersTable.Body = Body;
