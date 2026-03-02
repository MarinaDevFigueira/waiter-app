import { useState, useMemo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useOrders } from "@/shared/hooks/useOrders";
import { usePagination } from "@/shared/hooks/usePagination";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { ordersService } from "@/services/orders/orders.service";
import { OrdersTable } from "@/pages/orders/admin-orders/components/orders-table/orders-table";
import { OrdersTableSkeleton } from "@/pages/orders/admin-orders/components/orders-table/orders-table-skeleton";
import { EditClosedByModal } from "@/pages/orders/admin-orders/components/edit-closed-by-modal/edit-closed-by-modal";
import { OrdersViewToggle } from "@/pages/orders/kitchen-orders/components/orders-view-toggle/orders-view-toggle";
import { Pagination } from "@/components/ui/pagination/pagination";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import { editClosedByObservable } from "@/pages/orders/admin-orders/observables/edit-closed-by.observable";
import type { OrderStatus } from "@/shared/schemas/order.schema";
import type { AdminOrdersPageProps } from "@/pages/orders/admin-orders/page.interface";
import type { OrdersTableSortState } from "@/pages/orders/admin-orders/components/orders-table/orders-table.interface";

export function AdminOrdersPage({ canSwitchOrdersView, extraActions }: AdminOrdersPageProps) {
  const { orders, isLoading, total, page, size, totalPages, hasNextPage, hasPreviousPage, setQueryParams } = useOrders();
  const [sortState, setSortState] = useState<OrdersTableSortState>({
    orderBy: OrdersOrderByEnum.CREATED_AT,
    direction: SortDirection.DESC,
  });

  const handleSortChange = useCallback((sort: OrdersTableSortState) => {
    setSortState(sort);
    setQueryParams((prev) => ({ ...prev, orderBy: sort.orderBy, direction: sort.direction, page: 1 }));
  }, [setQueryParams]);

  const { t } = useTranslation();
  const { addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();
  const { hasPermissionTo } = usePermissions();

  const canEditClosedBy = hasPermissionTo(PermissionEnum.EDIT_ORDER_SESSIONS_CLOSED_BY);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const result = await ordersService.updateStatus(orderId, status);
      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("orders") });
      toast.success(t("orders.admin.updateStatus.success"));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleStatusChange = useCallback((orderId: string, status: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status });
  }, [updateStatusMutation]);

  const handleEditClosedBy = useCallback((orderSessionId: string) => {
    editClosedByObservable.open(orderSessionId);
  }, []);

  const pagination = usePagination({
    page,
    size,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange: useCallback((newPage: number, newSize: number) => {
      setQueryParams((prev) => ({ ...prev, page: newPage, size: newSize }));
    }, [setQueryParams]),
  });

  const isLoadingData = isLoading;
  const hasNoOrders = orders.length === 0;
  const showSkeleton = isLoadingData;
  const showEmpty = !isLoadingData && hasNoOrders;
  const showTable = !isLoadingData && !hasNoOrders;

  const pageHeader = (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("orders.admin.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("orders.admin.pageSubtitle")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {extraActions}
        <OrdersViewToggle disabled={!canSwitchOrdersView} />
      </div>
    </div>
  );

  const paginationBar = (
    <Pagination>
      <div className="flex items-center gap-4">
        <Pagination.Info
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          total={pagination.total}
        />
        <Pagination.SizeSelect
          size={pagination.size}
          setPageSize={pagination.setPageSize}
        />
      </div>
      <Pagination.Controls
        page={pagination.page}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        pageRange={pagination.pageRange}
        nextPage={pagination.nextPage}
        prevPage={pagination.prevPage}
        goToPage={pagination.goToPage}
      />
    </Pagination>
  );

  const bodyContent = useMemo(() => {
    if (showSkeleton) {
      return <OrdersTableSkeleton />;
    }

    if (showEmpty) {
      const emptyTitle = t("orders.admin.emptyState.noOrders");
      const emptyDescription = t("orders.admin.emptyState.noOrdersDescription");
      return (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-medium text-foreground">{emptyTitle}</p>
          <p className="text-muted-foreground text-sm">{emptyDescription}</p>
        </div>
      );
    }

    if (showTable) {
      return (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <OrdersTable
              orders={orders}
              sortState={sortState}
              onSortChange={handleSortChange}
              onStatusChange={handleStatusChange}
              onEditClosedBy={handleEditClosedBy}
              showActionsColumn={canEditClosedBy}
            />
          </div>
          {paginationBar}
        </div>
      );
    }

    return null;
  }, [showSkeleton, showEmpty, showTable, t, orders, sortState, handleSortChange, handleStatusChange, handleEditClosedBy, paginationBar, canEditClosedBy]);

  return (
    <div className="flex flex-col h-full gap-6">
      {pageHeader}
      {bodyContent}
      <EditClosedByModal />
    </div>
  );
}
