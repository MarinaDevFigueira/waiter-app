import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useKitchenOrders } from "@/shared/hooks/useKitchenOrders";
import { usePagination } from "@/shared/hooks/usePagination";
import { SearchBar } from "@/pages/orders/components/search-bar/search-bar";
import { OrdersGrid } from "@/pages/orders/components/orders-grid/orders-grid";
import { Pagination } from "@/components/ui/pagination/pagination";
import { useTranslation } from "@/shared/hooks/useTranslation";

type OrderStatus = "pending" | "preparing" | "ready";

export function KitchenOrdersPage() {
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
    onPageChange: (newPage, newSize) => {
      setPage(newPage);
      setSize(newSize);
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const formatDate = (timestamp: Date) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };

  const formatTime = (timestamp: Date) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const statusOptions = [
    { value: "pending" as const, label: t("common.status.pending") },
    { value: "preparing" as const, label: t("common.status.preparing") },
    { value: "ready" as const, label: t("common.status.ready") },
  ];

  const getStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      pending: t("common.status.pending"),
      preparing: t("common.status.preparing"),
      ready: t("common.status.ready"),
    };
    return statusMap[status] ?? t("common.status.pending");
  };

  const pageHeader = (
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight" data-testid="kitchen-orders-title">
        {t("orders.kitchen.pageTitle")}
      </h1>
      <p className="text-muted-foreground" data-testid="kitchen-orders-subtitle">
        {t("orders.kitchen.pageSubtitle")}
      </p>
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
