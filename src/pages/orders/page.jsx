import { format } from "date-fns";
import { useKitchenOrders } from "@/shared/hooks/useKitchenOrders";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";
import { SearchBar } from "@/pages/orders/components/search-bar/search-bar";
import { OrdersGrid } from "@/pages/orders/components/orders-grid/orders-grid";

export function KitchenOrdersPage() {
  const { orders, searchQuery, setSearchQuery } = useKitchenOrders();

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), "yyyy-MM-dd");
  };

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const handleStatusChange = (orderId, newStatus) => {
    kitchenOrdersObservable.updateOrderStatus(orderId, newStatus);
  };

  const statusOptions = [
    { value: "pending", label: "Pendente" },
    { value: "preparing", label: "Preparando" },
    { value: "ready", label: "Pronto" },
  ];

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Pendente",
      preparing: "Preparando",
      ready: "Pronto",
    };
    return statusMap[status] || "Pendente";
  };

  const pageHeader = (
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight" data-testid="kitchen-orders-title">
        Pedidos da Cozinha
      </h1>
      <p className="text-muted-foreground" data-testid="kitchen-orders-subtitle">
        Gerencie os pedidos em preparação
      </p>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {pageHeader}

      <div className="w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="w-full flex-1 overflow-y-auto">
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
