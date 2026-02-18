import { useState, useMemo, useCallback } from "react";
import { useKitchenOrders } from "@/shared/hooks/useKitchenOrders";
import { usePagination } from "@/shared/hooks/usePagination";
import { OrdersTable } from "@/pages/orders/admin-orders/components/orders-table/orders-table";
import { OrdersTableSkeleton } from "@/pages/orders/admin-orders/components/orders-table/orders-table-skeleton";
import { OrdersViewToggle } from "@/pages/orders/kitchen-orders/components/orders-view-toggle/orders-view-toggle";
import { Pagination } from "@/components/ui/pagination/pagination";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { AdminOrdersPageProps } from "@/pages/orders/admin-orders/page.interface";

export function AdminOrdersPage({ canSwitchOrdersView }: AdminOrdersPageProps) {
  const { orders, isLoading } = useKitchenOrders();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const total = orders.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * size;
    return orders.slice(start, start + size);
  }, [orders, page, size]);

  const pagination = usePagination({
    page,
    size,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange: useCallback((newPage: number, newSize: number) => {
      setPage(newPage);
      setSize(newSize);
    }, []),
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
      <OrdersViewToggle disabled={!canSwitchOrdersView} />
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
            <OrdersTable orders={pagedOrders} />
          </div>
          {paginationBar}
        </div>
      );
    }

    return null;
  }, [showSkeleton, showEmpty, showTable, t, pagedOrders, paginationBar]);

  return (
    <div className="flex flex-col h-full gap-6">
      {pageHeader}
      {bodyContent}
    </div>
  );
}
