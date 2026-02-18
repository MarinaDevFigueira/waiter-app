import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { useKitchenOrders } from "@/shared/hooks/useKitchenOrders";
import { usePagination } from "@/shared/hooks/usePagination";
import { SearchBar } from "@/pages/orders/kitchen-orders/components/search-bar/search-bar";
import { OrdersGrid } from "@/pages/orders/kitchen-orders/components/orders-grid/orders-grid";
import { OrdersViewToggle } from "@/pages/orders/kitchen-orders/components/orders-view-toggle/orders-view-toggle";
import { Pagination } from "@/components/ui/pagination/pagination";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { KitchenOrdersPageProps } from "@/pages/orders/kitchen-orders/page.interface";
import type { OrderStatus } from "@/shared/schemas/order.schema";

function formatDate(timestamp: Date) {
  return format(new Date(timestamp), "yyyy-MM-dd");
}

function formatTime(timestamp: Date) {
  return format(new Date(timestamp), "HH:mm");
}

export function KitchenOrdersPage({ canSwitchOrdersView }: KitchenOrdersPageProps) {
  const { orders, searchQuery, setSearchQuery, updateOrderStatus } = useKitchenOrders();
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

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, [setSearchQuery]);

  const handleStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  }, [updateOrderStatus]);

  const getStatusLabel = useCallback((status: OrderStatus) => t(`common.status.${status}`), [t]);

  const statusOptions = useMemo(() => [
    { value: "pending" as const, label: t("common.status.pending") },
    { value: "preparing" as const, label: t("common.status.preparing") },
    { value: "ready" as const, label: t("common.status.ready") },
  ], [t]);

  const pageHeader = (
    <div className="flex items-start justify-between">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="kitchen-orders-title">
          {t("orders.kitchen.pageTitle")}
        </h1>
        <p className="text-muted-foreground" data-testid="kitchen-orders-subtitle">
          {t("orders.kitchen.pageSubtitle")}
        </p>
      </div>
      <OrdersViewToggle disabled={!canSwitchOrdersView} />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {pageHeader}

      <div className="w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="w-full flex-1 min-h-0">
        <OrdersGrid
          orders={pagedOrders}
          searchQuery={searchQuery}
          formatDate={formatDate}
          formatTime={formatTime}
          handleStatusChange={handleStatusChange}
          statusOptions={statusOptions}
          getStatusLabel={getStatusLabel}
        />
      </div>

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
    </div>
  );
}
