import { useCallback } from "react";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { useOrderSessionOrders } from "@/shared/hooks/useOrderSessionOrders";
import { multiply, add } from "@/lib/math";
import type { Order, OrderItem } from "@/shared/schemas/order.schema";

interface OrderSessionSummaryModalProps {
  open: boolean;
  onClose: () => void;
  orderSessionId: string | null;
  onCloseSession: () => void;
  isClosing: boolean;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export function OrderSessionSummaryModal({
  open,
  onClose,
  orderSessionId,
  onCloseSession,
  isClosing,
}: OrderSessionSummaryModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { data: ordersData, isLoading } = useOrderSessionOrders(
    open ? orderSessionId : null
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const isClosed = !isOpen;
      if (isClosed) {
        onClose();
      }
    },
    [onClose]
  );

  if (!open) return null;

  const orders = ordersData?.items ?? [];

  const totalAmount = orders.reduce((sum: number, order: Order) => {
    const orderTotal = order.items.reduce((itemSum: number, item: OrderItem) => {
      const itemTotal = multiply(item.preco, item.quantity);
      return add(itemSum, itemTotal);
    }, 0);
    return add(sum, orderTotal);
  }, 0);

  const formattedTotal = formatPrice(totalAmount);

  const loadingSpinner = (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const emptyState = (
    <p className="text-center text-muted-foreground select-none py-8">
      {t("orderSession.noOrders")}
    </p>
  );

  const hasNoOrders = !isLoading && orders.length === 0;

  const ordersList = (
    <div className="space-y-4">
      {orders.map((order: Order) => {
        const shortId = order.id.slice(0, 8);
        return (
          <div key={order.id} className="border border-border rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="font-medium text-sm">Pedido #{shortId}</span>
              <span className="text-xs text-muted-foreground select-none">{order.status}</span>
            </div>
            <ul className="space-y-2">
              {order.items.map((item: OrderItem, index: number) => {
                const itemTotalValue = multiply(item.preco, item.quantity);
                const itemTotal = formatPrice(itemTotalValue);
                return (
                  <li key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium">{itemTotal}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );

  const footer = (
    <div className="border-t border-border p-4 space-y-3">
      <div className="flex justify-between font-bold text-lg">
        <span>{t("orderSession.total")}</span>
        <span className="text-primary">{formattedTotal}</span>
      </div>
      <button
        onClick={onCloseSession}
        disabled={isClosing}
        data-disabled={isClosing}
        data-testid="close-session-button"
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 active:shadow-sm hover:cursor-pointer transition-opacity data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
      >
        {t("orderSession.closeSession")}
      </button>
    </div>
  );

  const bodyContent = (
    <div className="p-4 space-y-4 overflow-y-auto flex-1">
      {isLoading && loadingSpinner}
      {hasNoOrders && emptyState}
      {!isLoading && ordersList}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <Drawer.Content
          className="max-h-[85vh] flex flex-col"
          data-testid="order-session-summary-modal"
        >
          <Drawer.Header className="flex-row items-center justify-between">
            <Drawer.Title>{t("orderSession.summary")}</Drawer.Title>
          </Drawer.Header>
          {bodyContent}
          {footer}
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content
        className="max-w-2xl p-0 max-h-[80vh] flex flex-col"
        data-testid="order-session-summary-modal"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{t("orderSession.summary")}</h2>
          <button
            onClick={onClose}
            aria-label={t("common.buttons.cancel")}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted hover:cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {bodyContent}
        {footer}
      </Dialog.Content>
    </Dialog>
  );
}
