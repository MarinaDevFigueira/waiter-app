import { useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { PencilLineIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { CategoriesOrderByEnum } from "@/shared/enums/categories-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { Category } from "@/shared/schemas/category.schema";

interface SortingConfig {
  orderBy: CategoriesOrderByEnum;
  direction: SortDirection;
}

interface CategoriesTableProps {
  categories: Category[];
  sorting: SortingConfig;
  onSortingChange: (orderBy: CategoriesOrderByEnum, direction: SortDirection) => void;
  onEdit: (category: Category) => void;
}

function ActiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-600">
      {label}
    </span>
  );
}

function InactiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
      {label}
    </span>
  );
}

function SortIndicatorAsc() {
  return <span className="text-muted-foreground/70 text-xs">▲</span>;
}

function SortIndicatorDesc() {
  return <span className="text-muted-foreground/70 text-xs">▼</span>;
}

function SortIndicatorNone() {
  return <span className="text-muted-foreground/70 text-xs">⬍</span>;
}

function SortIndicator({ isSorted }: { isSorted: "asc" | "desc" | false }) {
  const isAsc = isSorted === "asc";
  const isDesc = isSorted === "desc";

  if (isAsc) return <SortIndicatorAsc />;
  if (isDesc) return <SortIndicatorDesc />;
  return <SortIndicatorNone />;
}

export function CategoriesTable({ categories, sorting, onSortingChange, onEdit }: CategoriesTableProps) {
  const { t } = useTranslation();

  const hasSortingConfig = Boolean(sorting?.orderBy);

  const tableSorting: SortingState = useMemo(() => {
    if (!hasSortingConfig) return [];

    const sortDescending = sorting.direction === SortDirection.DESC;
    return [{ id: sorting.orderBy, desc: sortDescending }];
  }, [hasSortingConfig, sorting]);

  const handleSortingChange = useCallback((updater: Updater<SortingState>) => {
    const isUpdaterFunction = typeof updater === "function";
    const newSorting = isUpdaterFunction ? updater(tableSorting) : updater;

    const isClearingSorting = newSorting.length === 0;

    if (isClearingSorting) {
      onSortingChange(CategoriesOrderByEnum.NAME, SortDirection.ASC);
      return;
    }

    const sortConfig = newSorting[0];
    const sortField = sortConfig.id as CategoriesOrderByEnum;
    const sortDirection = sortConfig.desc ? SortDirection.DESC : SortDirection.ASC;

    onSortingChange(sortField, sortDirection);
  }, [tableSorting, onSortingChange]);

  const activeLabel = t("common.status.active");
  const inactiveLabel = t("common.status.inactive");

  const getStatusBadge = useCallback((category: Category) => {
    const isActive = category.active;

    if (isActive) return <ActiveBadge label={activeLabel} />;

    return <InactiveBadge label={inactiveLabel} />;
  }, [activeLabel, inactiveLabel]);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        size: 300,
        header: t("categories.table.columns.name"),
        cell: (info) => {
          const category = info.row.original;
          return (
            <div className="font-medium text-foreground">{category.name}</div>
          );
        },
      },
      {
        accessorKey: "description",
        size: 400,
        header: t("categories.table.columns.description"),
        cell: (info) => {
          const description = info.getValue() as string | undefined;
          return (
            <span className="text-muted-foreground">
              {description || "—"}
            </span>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "sortOrder",
        header: t("categories.table.columns.sortOrder"),
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue() as number}</span>
        ),
      },
      {
        id: "status",
        header: t("categories.table.columns.status"),
        accessorFn: (row) => (row.active ? "ativo" : "inativo"),
        cell: (info) => getStatusBadge(info.row.original),
        enableSorting: false,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: (info) => {
          const category = info.row.original;
          return (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(category)}
              data-testid={`edit-category-${category.id}`}
            >
              <PencilLineIcon size={16} />
            </Button>
          );
        },
      },
    ],
    [t, getStatusBadge, onEdit],
  );

  const table = useReactTable({
    data: categories,
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
                  const isPlaceholder = header.isPlaceholder;

                  const columnSize = header.column.getSize();
                  const hasColumnSize = columnSize !== 150;
                  const columnStyle = hasColumnSize ? { width: columnSize, minWidth: columnSize } : undefined;

                  const nextSortOrder = header.column.getNextSortingOrder();
                  const isAscSort = nextSortOrder === "asc";
                  const isDescSort = nextSortOrder === "desc";
                  const sortTitleAsc = t("common.sort.ascending");
                  const sortTitleDesc = t("common.sort.descending");
                  const sortTitleRemove = t("common.sort.removeSort");

                  const getSortTitle = (): string | undefined => {
                    if (!canSort) return undefined;
                    if (isAscSort) return sortTitleAsc;
                    if (isDescSort) return sortTitleDesc;
                    return sortTitleRemove;
                  };

                  const headerContent = flexRender(header.column.columnDef.header, header.getContext());

                  return (
                    <th
                      key={header.id}
                      style={columnStyle}
                      data-sortable={canSort}
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider data-[sortable=true]:cursor-pointer data-[sortable=true]:select-none"
                      onClick={header.column.getToggleSortingHandler()}
                      title={getSortTitle()}
                    >
                      <div className="flex items-center gap-2">
                        {!isPlaceholder && headerContent}
                        {canSort && <SortIndicator isSorted={isSorted} />}
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
