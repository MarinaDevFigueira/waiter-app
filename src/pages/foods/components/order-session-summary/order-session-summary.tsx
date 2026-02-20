import { X } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useOrderSessionOrders } from "@/shared/hooks/useOrderSessionOrders";

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
  const { data: ordersData, isLoading } = useOrderSessionOrders(
    open ? orderSessionId : null
  );

  if (!open) return null;

  const orders = ordersData?.items ?? [];

  const totalAmount = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => {
      return itemSum + item.preco * item.quantity;
    }, 0);
  }, 0);

  const formattedTotal = formatPrice(totalAmount);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      data-testid="order-session-summary-modal"
    >
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
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

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
          {!isLoading && orders.length === 0 && (
            <p className="text-center text-muted-foreground select-none py-8">
              {t("orderSession.noOrders")}
            </p>
          )}
          {!isLoading && orders.map((order) => {
            const shortId = order.id.slice(0, 8);
            return (
              <div key={order.id} className="border border-border rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-sm">Pedido #{shortId}</span>
                  <span className="text-xs text-muted-foreground select-none">{order.status}</span>
                </div>
                <ul className="space-y-2">
                  {order.items.map((item, index) => {
                    const itemTotal = formatPrice(item.preco * item.quantity);
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
      </div>
    </div>
  );
}
