import { CookingPotIcon } from "@phosphor-icons/react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface KitchenEmptyStateProps {
  searchQuery?: string;
}

export function KitchenEmptyState({ searchQuery }: KitchenEmptyStateProps): JSX.Element {
  const { t } = useTranslation();
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16"
      data-testid="kitchen-empty-state"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <CookingPotIcon className="w-10 h-10 text-primary/50" weight="duotone" />
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h3 className="text-lg font-semibold text-foreground">
          {isSearching
            ? t("orders.kitchen.emptyState.noResults")
            : t("orders.kitchen.emptyState.noOrders")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isSearching
            ? t("orders.kitchen.emptyState.noResultsDescription", {
                query: searchQuery ?? "",
              })
            : t("orders.kitchen.emptyState.noOrdersDescription")}
        </p>
      </div>

      {isSearching && (
        <p className="text-xs text-muted-foreground">
          {t("orders.kitchen.emptyState.searchHint")}
        </p>
      )}
    </div>
  );
}
