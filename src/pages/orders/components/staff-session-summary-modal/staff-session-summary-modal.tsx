import { useCallback, useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { ordersService } from "@/services/orders/orders.service";
import { orderStatusUpdateObservable } from "./observables/order-status-update.observable";
import { multiply, add } from "@/lib/math";
import { logger } from "@/lib/logger";
import type { OrderStatus } from "@/shared/schemas/order.schema";
import type { OrderSessionSummary, OrderSessionSummaryOrder, OrderSessionSummaryItem } from "@/services/order-sessions/interfaces/order-sessions.interface";
import type { StaffSessionSummaryModalProps } from "./staff-session-summary-modal.interface";

const CLOSEABLE_STATUSES: OrderStatus[] = ["delivered", "finished", "canceled"];

const CHANGEABLE_STATUSES: OrderStatus[] = ["preparing", "ready", "waiting_delivery_man", "in_delivery", "delivered", "finished", "canceled"];

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600",
  preparing: "bg-blue-500/10 text-blue-600",
  ready: "bg-purple-500/10 text-purple-600",
  waiting_delivery_man: "bg-orange-500/10 text-orange-600",
  in_delivery: "bg-cyan-500/10 text-cyan-600",
  delivered: "bg-green-500/10 text-green-600",
  finished: "bg-emerald-500/10 text-emerald-600",
  canceled: "bg-red-500/10 text-red-600",
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export function StaffSessionSummaryModal({ open, onClose, sessionId }: StaffSessionSummaryModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [summary, setSummary] = useState<OrderSessionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = orderStatusUpdateObservable.subscribe((state) => {
      setUpdatingOrderId(state.updatingOrderId);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const hasNoSessionId = !sessionId;
      if (hasNoSessionId) return;

      const isNotOpen = !open;
      if (isNotOpen) return;

      setIsLoading(true);
      setError(null);

      const result = await orderSessionsService.getSummary(sessionId);
      const hasError = "error" in result;

      if (hasError) {
        logger.error("[StaffSessionSummaryModal] Erro ao buscar resumo", new Error(result.error));
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSummary(result.data);
      setIsLoading(false);
    };

    fetchSummary();
  }, [sessionId, open]);

  const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    orderStatusUpdateObservable.setUpdating(orderId);

    const result = await ordersService.updateStatus(orderId, newStatus);
    const hasError = "error" in result;

    if (hasError) {
      logger.error("[StaffSessionSummaryModal] Erro ao atualizar status", new Error(result.error));
      toast.error(result.error);
      orderStatusUpdateObservable.reset();
      return;
    }

    setSummary((prev) => {
      if (!prev) return prev;
      const updatedOrders = prev.orders.map((order) => {
        const isTargetOrder = order.id === orderId;
        if (isTargetOrder) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      return { ...prev, orders: updatedOrders };
    });

    orderStatusUpdateObservable.reset();
    toast.success(t("orders.admin.updateStatus.success"));
  }, [t]);

  const allOrdersCloseable = useMemo(() => {
    const hasNoSummary = !summary;
    if (hasNoSummary) return false;

    const hasNoOrders = summary.orders.length === 0;
    if (hasNoOrders) return false;

    return summary.orders.every((order) => CLOSEABLE_STATUSES.includes(order.status as OrderStatus));
  }, [summary]);

  const handleCloseSession = useCallback(async () => {
    const hasNoSessionId = !sessionId;
    if (hasNoSessionId) return;

    const cannotClose = !allOrdersCloseable;
    if (cannotClose) {
      toast.error(t("orderSession.staffSummary.pendingOrders"));
      return;
    }

    setIsClosing(true);

    const result = await orderSessionsService.close(sessionId);
    const hasError = "error" in result;

    if (hasError) {
      logger.error("[StaffSessionSummaryModal] Erro ao fechar sessão", new Error(result.error));
      toast.error(result.error);
      setIsClosing(false);
      return;
    }

    toast.success(t("orderSession.staffSummary.closed"));
    setIsClosing(false);
    onClose();
  }, [sessionId, onClose, t, allOrdersCloseable]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const isClosed = !isOpen;
      if (isClosed) {
        onClose();
      }
    },
    [onClose],
  );

  const getStatusLabel = useCallback((status: string) => t(`common.status.${status}`), [t]);

  if (!open) return null;

  const loadingSpinner = (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const errorState = (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <p className="text-destructive text-sm">{t("orderSession.scanner.notFound")}</p>
      <p className="text-muted-foreground text-xs">{error}</p>
    </div>
  );

  const totalAmount = summary?.orders.reduce((sum: number, order: OrderSessionSummaryOrder) => {
    const orderTotal = order.items.reduce((itemSum: number, item: OrderSessionSummaryItem) => {
      const itemTotal = multiply(item.price, item.quantity);
      return add(itemSum, itemTotal);
    }, 0);
    return add(sum, orderTotal);
  }, 0) ?? 0;

  const formattedTotal = formatPrice(totalAmount);

  const ordersList = summary?.orders.map((order: OrderSessionSummaryOrder) => {
    const shortId = order.id.slice(0, 8);
    const status = order.status as OrderStatus;
    const statusLabel = getStatusLabel(status);
    const statusClassName = STATUS_CLASSES[status] || "bg-gray-500/10 text-gray-600";
    const isCloseable = CLOSEABLE_STATUSES.includes(status);
    const isUpdating = updatingOrderId === order.id;

    return (
      <div key={order.id} className="border border-border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-sm">Pedido #{shortId}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
              <button
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium cursor-pointer border-0 outline-none focus:ring-1 focus:ring-ring ${statusClassName}`}
                disabled={isUpdating}
              >
                {isUpdating && (
                  <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                )}
                {statusLabel}
                {!isUpdating && <CaretDownIcon size={12} />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {CHANGEABLE_STATUSES.map((changeableStatus) => {
                const isCurrentStatus = changeableStatus === status;
                const itemClassName = STATUS_CLASSES[changeableStatus];
                return (
                  <DropdownMenuItem
                    key={changeableStatus}
                    onClick={() => handleStatusChange(order.id, changeableStatus)}
                    disabled={isCurrentStatus}
                    data-current={isCurrentStatus}
                    className="data-[current=true]:opacity-50"
                  >
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${itemClassName}`}>
                      {getStatusLabel(changeableStatus)}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!isCloseable && (
          <p className="text-xs text-amber-600 mb-2">{t("orderSession.staffSummary.mustChangeStatus")}</p>
        )}
        <ul className="space-y-2">
          {order.items.map((item: OrderSessionSummaryItem, index: number) => {
            const itemTotalValue = multiply(item.price, item.quantity);
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
  });

  const summaryContent = (
    <div className="space-y-4">
      {ordersList}
    </div>
  );

  const hasNoOrders = summary !== null && summary.orders.length === 0;
  const emptyState = (
    <p className="text-center text-muted-foreground select-none py-8">
      {t("orderSession.noOrders")}
    </p>
  );

  const shouldShowLoading = isLoading;
  const shouldShowError = !isLoading && error !== null;
  const shouldShowEmpty = !isLoading && error === null && hasNoOrders;
  const shouldShowSummary = !isLoading && error === null && summary !== null && !hasNoOrders;

  const bodyContent = (
    <div className="p-4 space-y-4 overflow-y-auto flex-1">
      {shouldShowLoading && loadingSpinner}
      {shouldShowError && errorState}
      {shouldShowEmpty && emptyState}
      {shouldShowSummary && summaryContent}
    </div>
  );

  const canCloseSession = allOrdersCloseable && !isClosing && !isLoading && error === null;

  const footer = (
    <div className="border-t border-border p-4 space-y-3">
      <div className="flex justify-between font-bold text-lg">
        <span>{t("orderSession.total")}</span>
        <span className="text-primary">{formattedTotal}</span>
      </div>
      <Button
        onClick={handleCloseSession}
        disabled={!canCloseSession}
        className="w-full"
        size="lg"
        data-testid="staff-close-session-button"
      >
        {isClosing ? t("orderSession.staffSummary.closing") : t("orderSession.staffSummary.closeAndConfirm")}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <Drawer.Content className="max-h-[85vh] flex flex-col" data-testid="staff-session-summary-modal">
          <Drawer.Header className="flex-row items-center justify-between">
            <Drawer.Title>{t("orderSession.staffSummary.title")}</Drawer.Title>
          </Drawer.Header>
          {bodyContent}
          {footer}
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content className="max-w-2xl p-0 max-h-[80vh] flex flex-col" data-testid="staff-session-summary-modal">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Dialog.Title className="text-lg font-semibold">{t("orderSession.staffSummary.title")}</Dialog.Title>
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
