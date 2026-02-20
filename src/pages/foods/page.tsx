import { useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { Title } from "./components/title";
import { Foods } from "./components/foods";
import { CartDrawer } from "./components/cart-drawer/cart-drawer";
import { CartButton } from "./components/cart-button/cart-button";
import { OrderSessionButton } from "./components/order-session-button/order-session-button";
import { OrderSessionSummaryModal } from "./components/order-session-summary/order-session-summary";
import Categories from "./components/categories";
import { useCategories } from "@/shared/hooks/useCategories";
import { useProducts } from "@/shared/hooks/useProducts";
import { useCart } from "@/shared/hooks/useCart";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { authService } from "@/services/auth/auth.service";
import { logger } from "@/lib/logger";
import { cartObservable } from "@/shared/subjects/cart.subject";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { ProductsOrderByEnum } from "@/shared/enums/products-order-by.enum";
import type { Product } from "@/shared/schemas/product.schema";
import { useTranslation } from "@/shared/hooks/useTranslation";

export const FoodsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isClosingSession, setIsClosingSession] = useState(false);

  const { categories } = useCategories({
    initialSize: 100,
  });

  const { products, isLoading: isProductsLoading, setQueryParams } = useProducts();

  const { addItem, itemCount, cart } = useCart();

  const activeCategories = useMemo(() => {
    return categories.filter((c) => c.active);
  }, [categories]);

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      orderBy: ProductsOrderByEnum.NAME,
      direction: SortDirection.ASC,
      filters: {
        ...prev.filters,
        categoria: categoryId ? [categoryId] : undefined,
      },
    }));
  }, [setQueryParams]);

  const handleAddItem = useCallback(async (product: Product) => {
    await addItem({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImageUrl: product.imageUrl,
    });
  }, [addItem]);

  const handleOpenCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const handleOpenSummary = useCallback(() => {
    const currentCart = cartObservable.getValue();
    const sessionId = currentCart.orderSessionId;
    const noSession = !sessionId;
    if (noSession) return;

    setIsSummaryOpen(true);
  }, []);

  const handleCloseSummaryModal = useCallback(() => {
    setIsSummaryOpen(false);
  }, []);

  const handleCloseSession = useCallback(async () => {
    const currentCart = cartObservable.getValue();
    const sessionId = currentCart.orderSessionId;
    const noSession = !sessionId;
    if (noSession) return;

    setIsClosingSession(true);
    try {
      const result = await orderSessionsService.close(sessionId);
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        logger.error("Erro ao encerrar sessão", new Error(result.error));
        return;
      }

      cartObservable.clearCart();
      toast.success(t("orderSession.sessionClosedAndLoggedOut"));
      setIsSummaryOpen(false);
      await authService.logout();
      navigate({ to: "/" });
    } finally {
      setIsClosingSession(false);
    }
  }, [t, navigate]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.active);
  }, [products]);

  const sortedByCategory = useMemo(() => {
    const categoryOrderMap = new Map(
      activeCategories.map((c) => [c.id, c.sortOrder])
    );
    return [...filteredProducts].sort((a, b) => {
      const orderA = categoryOrderMap.get(a.categoryId) ?? 999;
      const orderB = categoryOrderMap.get(b.categoryId) ?? 999;
      return orderA - orderB;
    });
  }, [filteredProducts, activeCategories]);

  const hasSelectedCategory = selectedCategoryId !== null;
  const displayProducts = hasSelectedCategory ? filteredProducts : sortedByCategory;
  const hasActiveSession = Boolean(cart.orderSessionId);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-4">
      <div className="flex items-start justify-between w-full gap-3">
        <Title />
        <div className="pt-1 flex items-center gap-2">
          <OrderSessionButton
            hasActiveSession={hasActiveSession}
            onClick={handleOpenSummary}
          />
          <CartButton itemCount={itemCount} onClick={handleOpenCart} />
        </div>
      </div>
      <Categories
        categories={activeCategories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />
      {isProductsLoading ? (
        <FoodsLoadingSkeleton />
      ) : (
        <Foods
          items={displayProducts}
          onAddItem={handleAddItem}
          categories={activeCategories}
          showCategoryHeaders={!hasSelectedCategory}
        />
      )}
      <CartDrawer open={isCartOpen} onClose={handleCloseCart} />
      <OrderSessionSummaryModal
        open={isSummaryOpen}
        onClose={handleCloseSummaryModal}
        orderSessionId={cart.orderSessionId ?? null}
        onCloseSession={handleCloseSession}
        isClosing={isClosingSession}
      />
    </div>
  );
};

function FoodsLoadingSkeleton() {
  const skeletonRows = [0, 1, 2, 3, 4];
  return (
    <ul className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
      {skeletonRows.map((i) => (
        <li key={i} className="w-full flex items-start gap-3 sm:gap-4 min-h-20 sm:h-24">
          <div className="h-20 sm:h-24 aspect-video rounded-md bg-muted animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-2 py-1">
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-muted animate-pulse mt-auto" />
          </div>
        </li>
      ))}
    </ul>
  );
}
