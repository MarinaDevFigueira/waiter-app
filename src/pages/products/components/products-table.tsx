import { useMemo, useCallback } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { PencilLineIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { ProductsOrderByEnum } from "@/shared/enums/products-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { Product } from "@/shared/schemas/product.schema";
import type { Category } from "@/shared/schemas/category.schema";

interface SortingConfig {
  orderBy: ProductsOrderByEnum;
  direction: SortDirection;
}

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  sorting: SortingConfig;
  onSortingChange: (orderBy: ProductsOrderByEnum, direction: SortDirection) => void;
  onEdit: (product: Product) => void;
}

export function ProductsTable({ products, categories, sorting, onSortingChange, onEdit }: ProductsTableProps) {
  const { t } = useTranslation();
  const hasSortingConfig = Boolean(sorting?.orderBy);

  const categoryIds = categories.map(c => c.id).join(',');

  const getCategoryName = useCallback((categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "—";
  }, [categoryIds]);
  const tableSorting: SortingState = useMemo(() => {
    if (!hasSortingConfig) return [];

    const sortDescending = sorting.direction === SortDirection.DESC;
    return [{ id: sorting.orderBy, desc: sortDescending }];
  }, [hasSortingConfig, sorting]);

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const isUpdaterFunction = typeof updater === "function";
    const newSorting = isUpdaterFunction ? updater(tableSorting) : updater;

    const isClearingSorting = newSorting.length === 0;

    if (isClearingSorting) {
      onSortingChange(ProductsOrderByEnum.NAME, SortDirection.ASC);
      return;
    }

    const sortConfig = newSorting[0];
    const sortField = sortConfig.id as ProductsOrderByEnum;
    const sortDirection = sortConfig.desc ? SortDirection.DESC : SortDirection.ASC;

    onSortingChange(sortField, sortDirection);
  };

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  const formatDate = useCallback((date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  }, []);

  const getStatusBadge = useCallback((product: Product) => {
    const isDeleted = product.deletedAt !== null;
    const isActive = product.active;

    const hasDeleted = isDeleted;
    if (hasDeleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive">
          {t("common.status.deleted")}
        </span>
      );
    }

    const hasActive = isActive;
    if (hasActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600">
          {t("common.status.active")}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
        {t("common.status.inactive")}
      </span>
    );
  }, [t]);

  const getStatusValue = useCallback((product: Product) => {
    if (product.deletedAt !== null) return "excluído";
    if (product.active) return "ativo";
    return "inativo";
  }, []);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => {
      return [
      {
        accessorKey: "name",
        size: 300,
        header: t("products.table.columns.name"),
        cell: (info) => {
          const product = info.row.original;
          return (
            <div>
              <div className="font-medium text-foreground">{product.name}</div>
              <div className="text-muted-foreground text-xs line-clamp-1">
                {product.description}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "categoryId",
        header: t("products.table.columns.category"),
        cell: (info) => {
          const categoryId = info.getValue() as string;
          const categoryName = getCategoryName(categoryId);
          return <span className="capitalize">{categoryName}</span>;
        },
      },
      {
        accessorKey: "price",
        header: t("products.table.columns.price"),
        cell: (info) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: "stock",
        header: t("products.table.columns.stock"),
        cell: (info) => {
          const product = info.row.original;
          return (
            <span>
              {product.stock} {product.unit}
            </span>
          );
        },
      },
      {
        id: "status",
        header: t("products.table.columns.status"),
        accessorFn: (row) => getStatusValue(row),
        cell: (info) => getStatusBadge(info.row.original),
        enableSorting: false,
      },
      {
        accessorKey: "createdAt",
        header: t("products.table.columns.createdAt"),
        cell: (info) => {
          const product = info.row.original;
          return (
            <div>
              <div>{formatDate(product.createdAt)}</div>
              <div className="text-xs">por {product.createdBy}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: t("products.table.columns.updatedAt"),
        cell: (info) => {
          const product = info.row.original;
          return (
            <div>
              <div>{formatDate(product.updatedAt)}</div>
              <div className="text-xs">por {product.updatedBy}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(product)}
              data-testid={`edit-product-${product.id}`}
            >
              <PencilLineIcon size={16} />
            </Button>
          );
        },
      },
    ];
    },
    [t, getStatusBadge, getStatusValue, formatCurrency, formatDate, getCategoryName, onEdit],
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      sorting: tableSorting,
    },
  });

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="w-full">
          <thead className="bg-muted border-b border-border sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  const columnSize = header.column.getSize();
                  const hasColumnSize = columnSize !== 150;
                  const columnStyle = hasColumnSize ? { width: columnSize, minWidth: columnSize } : undefined;

                  return (
                    <th
                      key={header.id}
                      style={columnStyle}
                      className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                        canSort ? "cursor-pointer select-none" : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        canSort
                          ? header.column.getNextSortingOrder() === "asc"
                            ? t("common.sort.ascending")
                            : header.column.getNextSortingOrder() === "desc"
                              ? t("common.sort.descending")
                              : t("common.sort.removeSort")
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {canSort && (
                          <span className="text-muted-foreground/70 text-xs">
                            {isSorted === "asc"
                              ? "▲"
                              : isSorted === "desc"
                                ? "▼"
                                : "⬍"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
