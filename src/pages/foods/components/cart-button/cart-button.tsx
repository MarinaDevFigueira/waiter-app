import { ShoppingCart } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

export function CartButton({ itemCount, onClick }: CartButtonProps) {
  const { t } = useTranslation();

  const hasItems = itemCount > 0;

  const label = hasItems
    ? t("cart.itemCountPlural", { count: String(itemCount) })
    : t("cart.title");

  return (
    <button
      onClick={onClick}
      data-hasitems={hasItems}
      data-testid="cart-button"
      aria-label={label}
      className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted hover:cursor-pointer active:shadow-sm transition-colors"
    >
      <ShoppingCart className="w-5 h-5 text-primary" />
      {hasItems && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center select-none">
          {itemCount}
        </span>
      )}
    </button>
  );
}
