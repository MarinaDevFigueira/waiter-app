import { useState, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { Title } from "./components/title";
import { Foods } from "./components/foods";
import { CartDrawer } from "./components/cart-drawer/cart-drawer";
import { CartButton } from "./components/cart-button/cart-button";
import { OrderSessionButton } from "./components/order-session-button/order-session-button";
import { OrderSessionSummaryModal } from "./components/order-session-summary/order-session-summary";
import { ProductDetailModal } from "./components/product-detail-modal/product-detail-modal";
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [hasUnviewedOrder, setHasUnviewedOrder] = useState(false);
  const cartAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { categories } = useCategories({
    initialSize: 100,
  });

  const { products, isLoading: isProductsLoading, setQueryParams } = useProducts();

  const { addItem, itemCount, cart } = useCart();

  const activeCategories = useMemo(() => {
    const filtered = categories.filter((c) => {
      const isActive = c.active;
      return isActive;
    });
    return filtered;
  }, [categories]);

  const handleCategoryChange = useCallback(
    (categoryId: string | null) => {
      setSelectedCategoryId(categoryId);
      setQueryParams((prev) => {
        const firstPage = 1;
        const nameOrderBy = ProductsOrderByEnum.NAME;
        const ascDirection = SortDirection.ASC;
        const hasCategoryId = !!categoryId;
        const categoryFilter = hasCategoryId ? [categoryId] : undefined;

        const newParams = {
          ...prev,
          page: firstPage,
          orderBy: nameOrderBy,
          direction: ascDirection,
          filters: {
            ...prev.filters,
            categoria: categoryFilter,
          },
        };
        return newParams;
      });
    },
    [setQueryParams]
  );

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  }, []);

  const handleCloseProductDetail = useCallback(() => {
    setIsProductDetailOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleAddToCart = useCallback(
    async (product: Product, quantity: number) => {
      const productId = product.id;
      const productName = product.name;
      const productPrice = product.price;
      const productImages = product.images;
      const firstImage = productImages?.[0];
      const productImageUrl = firstImage?.url;

      await addItem(
        {
          productId,
          productName,
          productPrice,
          productImageUrl,
        },
        quantity
      );

      const hasExistingTimer = cartAnimationTimerRef.current !== null;
      if (hasExistingTimer) {
        clearTimeout(cartAnimationTimerRef.current!);
      }

      setIsCartAnimating(true);
      const animationDuration = 2000;
      cartAnimationTimerRef.current = setTimeout(() => {
        setIsCartAnimating(false);
        cartAnimationTimerRef.current = null;
      }, animationDuration);
    },
    [addItem]
  );

  const handleOpenCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const handleOrderConfirmed = useCallback(() => {
    setHasUnviewedOrder(true);
  }, []);

  const handleOpenSummary = useCallback(() => {
    const currentCart = cartObservable.getValue();
    const sessionId = currentCart.orderSessionId;
    const noSession = !sessionId;
    if (noSession) return;

    setHasUnviewedOrder(false);
    setIsSummaryOpen(true);
  }, []);

  const handleCloseSummaryModal = useCallback(() => {
    setIsSummaryOpen(false);
  }, []);

  const handleCloseSession = useCallback(async () => {
    const currentCart = cartObservable.getValue();
    const sessionId = currentCart.orderSessionId;
    const sessionExists = !!sessionId;
    const noSession = !sessionExists;
    if (noSession) return;

    const isClosing = true;
    setIsClosingSession(isClosing);
    try {
      const result = await orderSessionsService.close(sessionId);
      const errorExists = "error" in result;
      const hasError = errorExists;
      if (hasError) {
        const errorMessage = result.error;
        toast.error(errorMessage);
        const error = new Error(errorMessage);
        const logMessage = "Erro ao encerrar sessão";
        logger.error(logMessage, error);
        return;
      }

      cartObservable.clearCart();
      const successMessage = t("orderSession.sessionClosedAndLoggedOut");
      toast.success(successMessage);
      const isClosed = false;
      setIsSummaryOpen(isClosed);
      await authService.logout();
      const homeRoute = { to: "/" };
      navigate(homeRoute);
    } finally {
      const isNotClosing = false;
      setIsClosingSession(isNotClosing);
    }
  }, [t, navigate]);

  const filteredProducts = useMemo(() => {
    const activeProducts = products.filter((p) => {
      const isActive = p.active;
      return isActive;
    });
    return activeProducts;
  }, [products]);

  const sortedByCategory = useMemo(() => {
    const categoryPairs = activeCategories.map((c) => {
      const categoryId = c.id;
      const sortOrder = c.sortOrder;
      const pair = [categoryId, sortOrder] as const;
      return pair;
    });
    const categoryOrderMap = new Map(categoryPairs);
    const productsCopy = [...filteredProducts];
    const sorted = productsCopy.sort((a, b) => {
      const categoryIdA = a.categoryId;
      const categoryIdB = b.categoryId;
      const defaultOrder = 999;
      const orderA = categoryOrderMap.get(categoryIdA) ?? defaultOrder;
      const orderB = categoryOrderMap.get(categoryIdB) ?? defaultOrder;
      const comparison = orderA - orderB;
      return comparison;
    });
    return sorted;
  }, [filteredProducts, activeCategories]);

  const categoryIdExists = selectedCategoryId !== null;
  const hasSelectedCategory = categoryIdExists;
  const displayProducts = hasSelectedCategory
    ? filteredProducts
    : sortedByCategory;
  const sessionIdExists = !!cart.orderSessionId;
  const hasActiveSession = sessionIdExists;

  const contentToRender = useMemo(() => {
    if (isProductsLoading) {
      return (
        <FoodsLoadingSkeleton />
      );
    }
    return (
      <Foods
        items={displayProducts}
        onProductClick={handleProductClick}
        categories={activeCategories}
        showCategoryHeaders={!hasSelectedCategory}
      />
    );
  }, [isProductsLoading, displayProducts, handleProductClick, activeCategories, hasSelectedCategory]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-4 animate-fade-in">
      <div className="flex items-start justify-between w-full gap-3 animate-slide-in-down">
        <Title />
        <div className="pt-1 flex items-center gap-2">
          <OrderSessionButton
            hasActiveSession={hasActiveSession}
            onClick={handleOpenSummary}
            hasUnviewedOrder={hasUnviewedOrder}
          />
          <CartButton itemCount={itemCount} onClick={handleOpenCart} isAnimating={isCartAnimating} />
        </div>
      </div>
      <Categories
        categories={activeCategories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />
      {contentToRender}
      <CartDrawer open={isCartOpen} onClose={handleCloseCart} onOrderConfirmed={handleOrderConfirmed} />
      <OrderSessionSummaryModal
        open={isSummaryOpen}
        onClose={handleCloseSummaryModal}
        orderSessionId={cart.orderSessionId ?? null}
        onCloseSession={handleCloseSession}
        isClosing={isClosingSession}
      />
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          open={isProductDetailOpen}
          onClose={handleCloseProductDetail}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

function FoodsLoadingSkeleton() {
  const skeletonRows = [0, 1, 2, 3, 4];
  return (
    <ul className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4 animate-fade-in">
      {skeletonRows.map((i) => {
        const rowKey = i;
        const staggerDelay = i * 60;
        const skeletonStyle = { animationDelay: `${staggerDelay}ms` };
        return (
          <li
            key={rowKey}
            className="w-full flex items-start gap-3 sm:gap-4 min-h-20 sm:h-24 animate-stagger-item"
            style={skeletonStyle}
          >
            <div className="h-20 sm:h-24 aspect-video rounded-md bg-muted animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2 py-1">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/4 rounded bg-muted animate-pulse mt-auto" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
