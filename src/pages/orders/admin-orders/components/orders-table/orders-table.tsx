import { useMemo, useCallback, useState, Fragment } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { CaretDownIcon, ListBulletsIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { multiply, add } from "@/lib/math";
import type { Order, OrderItem, OrderStatus } from "@/shared/schemas/order.schema";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type {
  OrdersTableProps,
  OrdersTableHeaderProps,
  OrdersTableBodyProps,
  OrdersTableRootProps,
  OrdersTableSortState,
  OrderItemsDetailsProps,
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

function OrderItemsDetails({ items, columnsCount, totalLabel, isExpanded }: OrderItemsDetailsProps) {
  const total = items.reduce((acc, item) => {
    const itemTotal = multiply(item.quantity, item.preco);
    return add(acc, itemTotal);
  }, 0);
  const formattedTotal = formatCurrency(total);
  const expandedColSpan = columnsCount;
  const gridRowsClassName = isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]";
  const gridClassName = `grid transition-[grid-template-rows] duration-300 ease-in-out ${gridRowsClassName}`;

  return (
    <tr data-testid="order-items-details">
      <td colSpan={expandedColSpan} className="p-0 overflow-hidden">
        <div className={gridClassName}>
        <div className="overflow-hidden min-h-0">
        <div className="bg-muted/40 border-t border-border px-6 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">Qtd</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">Unitário</th>
                <th className="pb-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-28">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: OrderItem, index: number) => {
                const unitPrice = formatCurrency(item.preco);
                const subtotal = multiply(item.quantity, item.preco);
                const formattedSubtotal = formatCurrency(subtotal);
                const rowKey = `${item.name}-${index}`;

                return (
                  <tr key={rowKey} className="border-b border-border/50 last:border-0" data-testid="order-item-row">
                    <td className="py-2 text-foreground">{item.quantity}x</td>
                    <td className="py-2 text-foreground font-medium">{item.name}</td>
                    <td className="py-2 text-right text-muted-foreground">{unitPrice}</td>
                    <td className="py-2 text-right text-foreground">{formattedSubtotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3 pt-3 border-t border-border flex justify-end" data-testid="order-items-total">
            <span className="text-sm font-semibold text-foreground">{totalLabel}: {formattedTotal}</span>
          </div>
        </div>
        </div>
        </div>
      </td>
    </tr>
  );
}

function Body({ rows, expandedRowId, onRowToggle, totalLabel }: OrdersTableBodyProps) {
  const columnsCount = rows.length > 0 ? rows[0].getVisibleCells().length : 0;

  return (
    <tbody className="divide-y divide-border">
      {rows.map((row) => {
        const isExpanded = row.id === expandedRowId;

        return (
          <Fragment key={row.id}>
            <tr
              className="hover:bg-muted/30 transition-colors"
              data-testid="orders-table-row"
              data-expanded={isExpanded}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-foreground">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            <OrderItemsDetails
              items={row.original.items}
              columnsCount={columnsCount}
              totalLabel={totalLabel}
              isExpanded={isExpanded}
            />
          </Fragment>
        );
      })}
    </tbody>
  );
}

export function OrdersTable({ orders, sortState, onSortChange }: OrdersTableProps) {
  const { t } = useTranslation();
  const [expandedRowId, setExpandedRowId] = useState<string | undefined>(undefined);

  const formatDate = useCallback((date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  }, []);

  const getStatusLabel = useCallback(
    (status: OrderStatus) => t(`common.status.${status}`),
    [t],
  );

  const getSortTitle = useCallback(
    (canSort: boolean, columnId: string): string | undefined => {
      const isNotSortable = !canSort;
      if (isNotSortable) return undefined;

      const orderBy = COLUMN_TO_ORDER_BY[columnId];
      const hasNoOrderBy = !orderBy;
      if (hasNoOrderBy) return undefined;

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
      const hasNoOrderBy = !orderBy;
      if (hasNoOrderBy) return;

      const isActive = orderBy === sortState.orderBy;
      const nextDirection = isActive && sortState.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC;

      const nextSort: OrdersTableSortState = { orderBy, direction: nextDirection };
      onSortChange(nextSort);
    },
    [sortState, onSortChange],
  );

  const onRowToggle = useCallback((rowId: string) => {
    setExpandedRowId((current) => {
      const isSameRow = current === rowId;
      return isSameRow ? undefined : rowId;
    });
  }, []);

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
          const rowId = info.row.id;
          const order = info.row.original;
          const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
          const itemsLabel = t("orders.admin.table.itemsTotal");
          const isRowExpanded = rowId === expandedRowId;
          const caretClassName = isRowExpanded
            ? "transition-transform duration-200 rotate-180"
            : "transition-transform duration-200 rotate-0";
          const buttonLabel = `${itemsCount} ${itemsLabel}`;

          return (
            <Button
              variant="ghost"
              size="sm"
              data-testid="toggle-order-items-button"
              aria-expanded={isRowExpanded}
              onClick={() => onRowToggle(rowId)}
              className="hover:cursor-pointer active:scale-95 gap-2"
            >
              <ListBulletsIcon size={14} />
              {buttonLabel}
              <CaretDownIcon size={14} className={caretClassName} />
            </Button>
          );
        },
        enableSorting: false,
      },
      {
        id: "total",
        header: t("orders.admin.table.columns.total"),
        accessorFn: (row) => {
          return row.items.reduce((acc, item) => {
            const itemTotal = multiply(item.quantity, item.preco);
            return add(acc, itemTotal);
          }, 0);
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
    [t, getStatusLabel, formatDate, expandedRowId, onRowToggle],
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const totalLabel = t("orders.admin.table.total");

  return (
    <Root>
      <Header
        headerGroups={headerGroups}
        sortState={sortState}
        getSortTitle={getSortTitle}
        onColumnSort={onColumnSort}
      />
      <Body
        rows={rows}
        expandedRowId={expandedRowId}
        onRowToggle={onRowToggle}
        totalLabel={totalLabel}
      />
    </Root>
  );
}

OrdersTable.Root = Root;
OrdersTable.Header = Header;
OrdersTable.Body = Body;
OrdersTable.OrderItemsDetails = OrderItemsDetails;
