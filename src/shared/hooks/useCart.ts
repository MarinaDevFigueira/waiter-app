import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { cartObservable, type CartData, type CartItem } from "@/shared/subjects/cart.subject";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { ordersService } from "@/services/orders/orders.service";
import { useRoles } from "@/shared/hooks/useRoles";
import { logger } from "@/lib/logger";
import { useLanguage } from "@/shared/hooks/useLanguage";

interface UseCartReturn {
  cart: CartData;
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  confirmOrder: () => Promise<boolean>;
  isLoading: boolean;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartData>(cartObservable.getValue());
  const [isLoading, setIsLoading] = useState(false);
  const { isTable } = useRoles();
  const { addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = cartObservable.subscribe(setCart);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isTable) return;

    const initializeSession = async (): Promise<void> => {
      const currentCart = cartObservable.getValue();
      const noSessionId = !currentCart.orderSessionId;

      if (noSessionId) {
        setIsLoading(true);
        try {
          const result = await orderSessionsService.getActive();

          const hasError = "error" in result;
          if (hasError) {
            const sessionError = new Error(result.error);
            logger.error("Erro ao buscar sessão ativa", sessionError);
            return;
          }

          const activeSession = result.data;
          const hasActiveSession = activeSession !== null && activeSession !== undefined;
          if (hasActiveSession) {
            cartObservable.setOrderSession(activeSession.id);
          }
        } catch (error) {
          const sessionError = error instanceof Error ? error : new Error(String(error));
          logger.error("Erro ao inicializar sessão", sessionError);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeSession();
  }, [isTable]);

  const ensureOrderSession = async (): Promise<boolean> => {
    if (!isTable) return true;

    const currentCart = cartObservable.getValue();
    const hasSessionId = Boolean(currentCart.orderSessionId);
    if (hasSessionId) return true;

    try {
      const result = await orderSessionsService.getActive();
      const hasError = "error" in result;
      if (hasError) {
        const sessionError = new Error(result.error);
        console.error("[useCart] Erro ao buscar sessão ativa:", sessionError);
        toast.error(result.error ?? "Erro ao buscar sessão ativa");
        logger.error("Erro ao buscar sessão ativa", sessionError);
        return false;
      }

      const activeSessionData = result.data;
      const hasActiveSession = activeSessionData !== null && activeSessionData !== undefined;
      if (hasActiveSession) {
        cartObservable.setOrderSession(activeSessionData.id);
        return true;
      }

      const openResult = await orderSessionsService.open();
      const openHasError = "error" in openResult;
      if (openHasError) {
        const openError = new Error(openResult.error);
        toast.error(openResult.error ?? "Erro ao abrir sessão");
        logger.error("Erro ao abrir sessão", openError);
        return false;
      }

      cartObservable.setOrderSession(openResult.data.id);
      return true;
    } catch (error) {
      const sessionError = error instanceof Error ? error : new Error(String(error));
      logger.error("Erro ao criar sessão", sessionError);
      return false;
    }
  };

  const addItem = async (
    item: Omit<CartItem, "quantity">,
    quantity = 1
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const sessionReady = await ensureOrderSession();
      const sessionNotReady = !sessionReady;
      if (sessionNotReady) return;

      cartObservable.addItem(item, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string): Promise<void> => {
    setIsLoading(true);
    try {
      cartObservable.removeItem(productId);
      const currentCart = cartObservable.getValue();
      const isEmpty = currentCart.items.length === 0;
      if (isEmpty) {
        cartObservable.setOrderSession(null);
      }
      toast.success("Item removido do carrinho");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    setIsLoading(true);
    try {
      cartObservable.updateQuantity(productId, quantity);
      const currentCart = cartObservable.getValue();
      const isEmpty = currentCart.items.length === 0;
      if (isEmpty) {
        cartObservable.setOrderSession(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const currentCart = cartObservable.getValue();
      const hasSessionId = Boolean(currentCart.orderSessionId);

      if (hasSessionId && isTable) {
        const result = await orderSessionsService.close(currentCart.orderSessionId as string);
        const hasError = "error" in result;
        if (hasError) {
          logger.error("Erro ao fechar sessão", new Error(result.error));
        }
      }

      cartObservable.clearCart();
      toast.success("Carrinho limpo");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOrder = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const currentCart = cartObservable.getValue();

      const orderItems = currentCart.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.productPrice,
      }));

      const hasSessionId = Boolean(currentCart.orderSessionId);
      const orderSessionId = hasSessionId && isTable
        ? (currentCart.orderSessionId as string)
        : undefined;

      const result = await ordersService.create({ items: orderItems, orderSessionId });
      const hasError = "error" in result;
      if (hasError) {
        const orderError = new Error(result.error);
        toast.error(result.error ?? "Erro ao criar pedido");
        logger.error("Erro ao criar pedido", orderError);
        return false;
      }

      cartObservable.clearCart();

      const sessionStaysOpen = isTable && hasSessionId;
      if (sessionStaysOpen) {
        cartObservable.setOrderSession(currentCart.orderSessionId);
      }

      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("orders") });
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cart,
    itemCount: cartObservable.getItemCount(),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    confirmOrder,
    isLoading,
  };
}
