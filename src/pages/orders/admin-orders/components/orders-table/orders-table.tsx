import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import type { OrdersTableProps, OrdersTableHeaderProps, OrdersTableBodyProps } from "@/pages/orders/admin-orders/components/orders-table/orders-table.interface";

const SORT_INDICATORS: Record<string, string> = {
  asc: "▲",
  desc: "▼",
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

function OrdersTableHeader({ headerGroups, getSortTitle }: OrdersTableHeaderProps) {
  return (
    <thead className="bg-muted/50 border-b border-border">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();
            const nextSortOrder = header.column.getNextSortingOrder();
            const sortIndicator = isSorted ? SORT_INDICATORS[isSorted] : DEFAULT_SORT_INDICATOR;
            const sortTitle = getSortTitle(canSort, nextSortOrder);
            const headerClassName = canSort
              ? "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
              : "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider";

            return (
              <th
                key={header.id}
                className={headerClassName}
                onClick={header.column.getToggleSortingHandler()}
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

function OrdersTableBody({ rows }: OrdersTableBodyProps) {
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

export function OrdersTable({ orders }: OrdersTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatDate = useCallback((date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  }, []);

  const getStatusLabel = useCallback(
    (status: OrderStatus) => t(`common.status.${status}`),
    [t],
  );

  const getSortTitle = useCallback(
    (canSort: boolean, nextSortOrder: string | false): string | undefined => {
      const isSortable = canSort;
      if (!isSortable) return undefined;

      const SORT_TITLES: Record<string, string> = {
        asc: t("common.sort.ascending"),
        desc: t("common.sort.descending"),
        default: t("common.sort.removeSort"),
      };

      const sortKey = nextSortOrder || "default";
      return SORT_TITLES[sortKey];
    },
    [t],
  );

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "table",
        header: t("orders.admin.table.columns.table"),
        cell: (info) => {
          const tableNumber = info.getValue() as string;
          return <span className="font-medium text-foreground">{tableNumber}</span>;
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
        enableSorting: false,
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="w-full">
          <OrdersTableHeader headerGroups={headerGroups} getSortTitle={getSortTitle} />
          <OrdersTableBody rows={rows} />
        </table>
      </div>
    </div>
  );
}
