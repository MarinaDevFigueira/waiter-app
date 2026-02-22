import { useState, useCallback, useMemo } from "react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Drawer } from "@/components/ui/drawer/drawer";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCart } from "@/shared/hooks/useCart";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserProfileEnum } from "@/shared/constants/user-profile";
import { multiply } from "@/lib/math";
import type { CartItem } from "@/shared/subjects/cart.subject";

interface CartItemRowProps {
  item: CartItem;
  onRemove: (productId: string) => Promise<void>;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

function CartItemRow({ item, onRemove, onUpdateQuantity }: CartItemRowProps) {
  const { t } = useTranslation();

  const handleRemove = useCallback(() => {
    onRemove(item.productId);
  }, [item.productId, onRemove]);

  const handleIncrease = useCallback(() => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  }, [item.productId, item.quantity, onUpdateQuantity]);

  const handleDecrease = useCallback(() => {
    onUpdateQuantity(item.productId, item.quantity - 1);
  }, [item.productId, item.quantity, onUpdateQuantity]);

  const itemTotalValue = multiply(item.productPrice, item.quantity);
  const itemTotal = formatPrice(itemTotalValue);
  const hasImage = Boolean(item.productImageUrl);
  const imageSrc = hasImage ? item.productImageUrl : "/placeholder-food.png";

  return (
    <li className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <img
        src={imageSrc}
        alt={item.productName}
        className="w-14 h-14 rounded-md object-cover shrink-0 bg-muted"
      />
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="text-sm font-semibold truncate">{item.productName}</span>
        <span className="text-xs text-muted-foreground">{formatPrice(item.productPrice)} cada</span>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:cursor-pointer transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:cursor-pointer transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="text-sm font-bold text-primary">{itemTotal}</span>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:cursor-pointer transition-colors"
        aria-label={t("cart.removeItem")}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onOrderConfirmed?: () => void;
}

export function CartDrawer({ open, onClose, onOrderConfirmed }: CartDrawerProps) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { cart, itemCount, removeItem, updateQuantity, clearCart, confirmOrder, isLoading } = useCart();
  const [isConfirming, setIsConfirming] = useState(false);

  const formattedTotal = useMemo(() => formatPrice(cart.total), [cart.total]);

  const isMesaProfile = auth?.profile === UserProfileEnum.MESA;

  const confirmButtonLabel = useMemo(() => {
    if (isMesaProfile) return t("cart.sendToKitchen");
    return t("cart.confirmOrder");
  }, [isMesaProfile, t]);

  const itemCountLabel = useMemo(() => {
    const key = itemCount === 1 ? "cart.itemCount" : "cart.itemCountPlural";
    return t(key, { count: String(itemCount) });
  }, [itemCount, t]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const isClosed = !isOpen;
      if (isClosed) {
        onClose();
      }
    },
    [onClose]
  );

  const handleConfirmOrder = useCallback(async () => {
    setIsConfirming(true);
    try {
      const success = await confirmOrder();
      if (success) {
        onOrderConfirmed?.();
        onClose();
      }
    } finally {
      setIsConfirming(false);
    }
  }, [confirmOrder, onClose, onOrderConfirmed]);

  const handleCancelOrder = useCallback(async () => {
    await clearCart();
    onClose();
  }, [clearCart, onClose]);

  const hasItems = cart.items.length > 0;
  const isDisabled = isLoading || isConfirming;

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
      <Drawer.Content
        className="fixed inset-y-0 right-0 left-auto w-full max-w-sm rounded-t-none rounded-l-xl flex flex-col"
        showHandle={false}
        data-testid="cart-drawer"
      >
        <Drawer.Header className="border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <Drawer.Title>{t("cart.title")}</Drawer.Title>
            {hasItems && (
              <span className="text-sm text-muted-foreground">({itemCountLabel})</span>
            )}
          </div>
          <Drawer.Close />
        </Drawer.Header>

        <div className="flex-1 overflow-y-auto px-4">
          {hasItems ? (
            <ul className="py-2">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
              <span className="text-base font-semibold text-muted-foreground">{t("cart.empty")}</span>
              <span className="text-sm text-muted-foreground">{t("cart.emptyDescription")}</span>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="p-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">{t("cart.total")}</span>
              <span className="text-xl font-bold text-primary">{formattedTotal}</span>
            </div>
            <button
              onClick={handleConfirmOrder}
              disabled={isDisabled}
              data-disabled={isDisabled}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:opacity-90 active:opacity-75 hover:cursor-pointer transition-opacity data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
              data-testid="confirm-order-button"
            >
              {confirmButtonLabel}
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={isDisabled}
              data-disabled={isDisabled}
              className="w-full border border-border text-muted-foreground font-semibold py-2 px-4 rounded-lg hover:bg-muted hover:text-foreground hover:cursor-pointer transition-colors data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
              data-testid="cancel-order-button"
            >
              {t("cart.cancelOrder")}
            </button>
          </div>
        )}
      </Drawer.Content>
    </Drawer>
  );
}
