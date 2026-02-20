import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { cartObservable, type CartData, type CartItem } from "@/shared/subjects/cart.subject";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { ordersService } from "@/services/orders/orders.service";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserProfileEnum } from "@/shared/constants/user-profile";
import { logger } from "@/lib/logger";

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
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = cartObservable.subscribe(setCart);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const isMesaProfile = auth?.profile === UserProfileEnum.MESA;
    if (!isMesaProfile) return;

    const initializeSession = async (): Promise<void> => {
      const currentCart = cartObservable.getValue();
      const noSessionId = !currentCart.orderSessionId;

      if (noSessionId) {
        setIsLoading(true);
        try {
          const result = await orderSessionsService.getActive();

          const hasError = "error" in result;
          if (hasError) {
            logger.error("Erro ao buscar sessão ativa", new Error(result.error));
            return;
          }

          const hasActiveSession = result.data !== null;
          if (hasActiveSession) {
            cartObservable.setOrderSession(result.data.id);
          }
        } catch (error) {
          logger.error(
            "Erro ao inicializar sessão",
            error instanceof Error ? error : new Error(String(error))
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeSession();
  }, [auth]);

  const ensureOrderSession = async (): Promise<boolean> => {
    const isMesaProfile = auth?.profile === UserProfileEnum.MESA;
    if (!isMesaProfile) return true;

    const currentCart = cartObservable.getValue();
    const hasSessionId = Boolean(currentCart.orderSessionId);
    if (hasSessionId) return true;

    try {
      const result = await orderSessionsService.getActive();
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        logger.error("Erro ao buscar sessão ativa", new Error(result.error));
        return false;
      }

      const hasActiveSession = result.data !== null;
      if (hasActiveSession) {
        cartObservable.setOrderSession(result.data.id);
        return true;
      }

      const openResult = await orderSessionsService.open();
      const openHasError = "error" in openResult;
      if (openHasError) {
        toast.error(openResult.error);
        logger.error("Erro ao abrir sessão", new Error(openResult.error));
        return false;
      }

      cartObservable.setOrderSession(openResult.data.id);
      return true;
    } catch (error) {
      logger.error(
        "Erro ao criar sessão",
        error instanceof Error ? error : new Error(String(error))
      );
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
      toast.success(`${item.productName} adicionado ao carrinho`);
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
      const isMesaProfile = auth?.profile === UserProfileEnum.MESA;

      if (hasSessionId && isMesaProfile) {
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
      const isMesaProfile = auth?.profile === UserProfileEnum.MESA;

      const orderItems = currentCart.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.productPrice,
      }));

      const hasSessionId = Boolean(currentCart.orderSessionId);
      const orderSessionId = hasSessionId && isMesaProfile
        ? (currentCart.orderSessionId as string)
        : undefined;

      const result = await ordersService.create({ items: orderItems, orderSessionId });
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        logger.error("Erro ao criar pedido", new Error(result.error));
        return false;
      }

      cartObservable.clearCart();

      const sessionStaysOpen = isMesaProfile && hasSessionId;
      if (sessionStaysOpen) {
        cartObservable.setOrderSession(currentCart.orderSessionId);
      }

      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
