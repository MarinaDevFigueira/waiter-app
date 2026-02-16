import { cn } from "@/lib/utils";

export function OrderCard({ children, className, orderId, status, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col bg-card border border-border rounded-lg overflow-hidden h-[280px] transition-shadow",
        className,
      )}
      data-testid={`kitchen-order-card-${orderId}`}
      data-status={status}
      {...props}
    >
      {children}
    </div>
  );
}

function OrderCardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-primary/5 border-b border-border/50 px-4 py-3 flex items-center justify-between shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function OrderCardItems({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-2 snap-y snap-proximity my-1",
        className,
      )}
      data-testid="order-items-list"
      {...props}
    >
      {children}
    </div>
  );
}

function OrderCardItem({ name, quantity, className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-2 text-sm border-b border-border/30 pb-2 last:border-0",
        className,
      )}
      data-testid="order-item"
      {...props}
    >
      <span className="flex-1 leading-tight">{name}</span>
      <span className="font-medium shrink-0 text-primary">{quantity}x</span>
    </div>
  );
}

function OrderCardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "px-4 py-2 border-t border-border/50 shrink-0 flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

OrderCard.Header = OrderCardHeader;
OrderCard.Items = OrderCardItems;
OrderCard.Item = OrderCardItem;
OrderCard.Footer = OrderCardFooter;
