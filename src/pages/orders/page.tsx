import { format } from "date-fns";
import { useKitchenOrders } from "@/shared/hooks/useKitchenOrders";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";
import { SearchBar } from "@/pages/orders/components/search-bar/search-bar";
import { OrdersGrid } from "@/pages/orders/components/orders-grid/orders-grid";
import { useTranslation } from "@/shared/hooks/useTranslation";

type OrderStatus = "pending" | "preparing" | "ready";

export function KitchenOrdersPage() {
  const { orders, searchQuery, setSearchQuery } = useKitchenOrders();
  const { t } = useTranslation();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const formatDate = (timestamp: Date) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };

  const formatTime = (timestamp: Date) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    kitchenOrdersObservable.updateOrderStatus(orderId, newStatus);
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

      <div className="w-full flex-1">
        <OrdersGrid
          orders={orders}
          searchQuery={searchQuery}
          formatDate={formatDate}
          formatTime={formatTime}
          handleStatusChange={handleStatusChange}
          statusOptions={statusOptions}
          getStatusLabel={getStatusLabel}
        />
      </div>
    </div>
  );
}
