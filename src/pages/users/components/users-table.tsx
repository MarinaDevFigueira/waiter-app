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
import { PencilLineIcon, ProhibitIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { UsersOrderByEnum } from "@/shared/enums/users-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import type { User } from "@/shared/schemas/user.schema";
import type { UsersTableProps } from "../page.interface";

export function UsersTable({ users, sorting, onSortingChange, onEdit, onDisable, canEdit, canDisable }: UsersTableProps) {
  const { t } = useTranslation();
  const hasSortingConfig = Boolean(sorting?.orderBy);

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
      onSortingChange(UsersOrderByEnum.NAME, SortDirection.ASC);
      return;
    }

    const sortConfig = newSorting[0];
    const sortField = sortConfig.id as UsersOrderByEnum;
    const sortDirection = sortConfig.desc ? SortDirection.DESC : SortDirection.ASC;

    onSortingChange(sortField, sortDirection);
  };

  const formatDate = useCallback((date: Date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  }, []);

  const getRoleBadge = useCallback((role: string) => {
    const roleColors: Record<string, string> = {
      admin: "bg-purple-500/10 text-purple-600",
      table: "bg-blue-500/10 text-blue-600",
      kitchen: "bg-orange-500/10 text-orange-600",
      customer: "bg-green-500/10 text-green-600",
      attendant: "bg-cyan-500/10 text-cyan-600",
      waiter: "bg-indigo-500/10 text-indigo-600",
    };

    const badgeColor = roleColors[role] || "bg-muted text-muted-foreground";
    const roleLabel = t(`users.roles.${role}` as any) || role;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badgeColor}`}>
        {roleLabel}
      </span>
    );
  }, [t]);

  const getPermissionsBadge = useCallback((permissions?: string[]) => {
    const hasNoPermissions = !permissions || permissions.length === 0;
    if (hasNoPermissions) {
      return <span className="text-muted-foreground text-xs">—</span>;
    }

    const permissionsCount = permissions.length;
    const badgeText = `${permissionsCount} ${permissionsCount === 1 ? "permissão" : "permissões"}`;

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600">
        {badgeText}
      </span>
    );
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(
    () => {
      return [
      {
        accessorKey: "name",
        size: 200,
        header: t("users.table.columns.name"),
        cell: (info) => {
          const userName = info.getValue() as string;
          return <span className="font-medium text-foreground">{userName}</span>;
        },
      },
      {
        accessorKey: "username",
        header: t("users.table.columns.username"),
        cell: (info) => {
          const username = info.getValue() as string;
          return <span className="text-muted-foreground">{username}</span>;
        },
      },
      {
        accessorKey: "email",
        header: t("users.table.columns.email"),
        cell: (info) => {
          const email = info.getValue() as string;
          return <span>{email}</span>;
        },
      },
      {
        accessorKey: "role",
        header: t("users.table.columns.role"),
        cell: (info) => {
          const role = info.getValue() as string;
          return getRoleBadge(role);
        },
      },
      {
        accessorKey: "permissions",
        header: t("users.table.columns.customPermissions"),
        enableSorting: false,
        cell: (info) => {
          const user = info.row.original;
          return getPermissionsBadge(user.permissions);
        },
      },
      {
        accessorKey: "createdAt",
        header: t("users.table.columns.createdAt"),
        cell: (info) => {
          const user = info.row.original;
          return formatDate(user.createdAt);
        },
      },
      {
        accessorKey: "updatedAt",
        header: t("users.table.columns.updatedAt"),
        cell: (info) => {
          const user = info.row.original;
          return formatDate(user.updatedAt);
        },
      },
      {
        accessorKey: "deletedAt",
        header: t("users.table.columns.disabledAt"),
        cell: (info) => {
          const user = info.row.original;
          const hasDeletedAt = user.deletedAt !== null && user.deletedAt !== undefined;

          if (!hasDeletedAt) {
            return "—";
          }

          return formatDate(user.deletedAt!);
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: (info) => {
          const user = info.row.original;
          const isDeleted = user.deletedAt !== null;
          const shouldShowDisableButton = !isDeleted && canDisable;
          const hasAnyAction = canEdit || shouldShowDisableButton;

          if (!hasAnyAction) {
            return null;
          }

          return (
            <div className="flex gap-2">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(user)}
                  data-testid={`edit-user-${user.id}`}
                  title={t("users.actions.edit")}
                >
                  <PencilLineIcon size={16} />
                </Button>
              )}
              {shouldShowDisableButton && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDisable(user)}
                  data-testid={`disable-user-${user.id}`}
                  title={t("users.actions.disable")}
                >
                  <ProhibitIcon size={16} />
                </Button>
              )}
            </div>
          );
        },
      },
    ];
    },
    [t, formatDate, getRoleBadge, getPermissionsBadge, onEdit, onDisable],
  );

  const table = useReactTable({
    data: users,
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
          <thead className="bg-muted/50 border-b border-border">
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
