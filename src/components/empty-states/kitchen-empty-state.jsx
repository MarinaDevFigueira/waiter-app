import { CookingPotIcon } from "@phosphor-icons/react";

export function KitchenEmptyState({ searchQuery }) {
  const isSearching = searchQuery && searchQuery.trim().length > 0;

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
          {isSearching ? "Nenhum pedido encontrado" : "Nenhum pedido ativo"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isSearching
            ? `Não encontramos pedidos com "${searchQuery}"`
            : "Não há pedidos pendentes ou em preparo no momento"}
        </p>
      </div>

      {isSearching && (
        <p className="text-xs text-muted-foreground">
          Tente buscar por mesa ou nome do item
        </p>
      )}
    </div>
  );
}
