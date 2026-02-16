import { OrderCard } from "@/pages/orders/components/order-card/order-card";
import { KitchenEmptyState } from "@/components/empty-states/kitchen-empty-state";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card/hover-card";

export function OrdersGrid({
  orders,
  searchQuery,
  formatDate,
  formatTime,
  handleStatusChange,
  statusOptions,
  getStatusLabel,
}) {
  const isEmpty = orders.length === 0;

  if (isEmpty) {
    return <KitchenEmptyState searchQuery={searchQuery} />;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-max py-4"
      data-testid="kitchen-orders-grid"
    >
      {orders.map((order) => (
        <OrderCard key={order.id} orderId={order.id} status={order.status}>
          <OrderCard.Header>
            <div className="flex flex-col gap-1">
              <h3
                className="font-semibold text-sm uppercase tracking-wide"
                data-testid="order-table-name"
              >
                {order.table}
              </h3>
              <span className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(order.createdAt)}
            </span>
          </OrderCard.Header>

          <OrderCard.Items>
            {order.items.map((item, index) => (
              <OrderCard.Item
                key={index}
                name={item.name}
                quantity={item.quantity}
              />
            ))}
          </OrderCard.Items>

          <OrderCard.Footer>
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <span
                  data-status={order.status}
                  className="inline-block text-xs font-medium px-2 py-1 rounded cursor-pointer mx-auto min-w-24 text-center data-[status=pending]:bg-muted data-[status=pending]:text-muted-foreground data-[status=preparing]:bg-yellow-500/10 data-[status=preparing]:text-yellow-600 data-[status=ready]:bg-green-500/10 data-[status=ready]:text-green-600"
                  data-testid="order-status"
                >
                  {getStatusLabel(order.status)}
                </span>
              </HoverCardTrigger>
              <HoverCardContent
                className="w-48 p-2"
                data-testid="order-status-menu"
              >
                <div className="space-y-1">
                  {statusOptions.map((option) => {
                    const isActive = order.status === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleStatusChange(order.id, option.value)
                        }
                        data-status={option.value}
                        data-active={isActive}
                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent transition-colors data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                        data-testid={`status-option-${option.value}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </HoverCardContent>
            </HoverCard>
          </OrderCard.Footer>
        </OrderCard>
      ))}
    </div>
  );
}
