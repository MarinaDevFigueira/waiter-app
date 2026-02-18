import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";
import { ordersService } from "@/services/orders/orders.service";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";

interface UseKitchenOrdersReturn {
  orders: Order[];
  allOrders: Order[];
  searchQuery: string;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  refetch: () => Promise<void>;
}

export function useKitchenOrders(): UseKitchenOrdersReturn {
  const [orders, setOrders] = useState<Order[]>(kitchenOrdersObservable.getValue());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);

    const result = await ordersService.getAll();
    const hasError = "error" in result;

    if (hasError) {
      const error = new Error(result.error);
      toast.error(result.error);
      logger.error("Erro ao buscar pedidos", error);
      setIsLoading(false);
      return;
    }

    kitchenOrdersObservable.setOrders(result.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const subscription = kitchenOrdersObservable.subscribe(setOrders);
    fetchOrders();
    return () => subscription.unsubscribe();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return orders.filter((order) => {
      return (
        order.table.toLowerCase().includes(searchLower) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchLower))
      );
    });
  }, [orders, searchQuery]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    kitchenOrdersObservable.updateOrderStatus(orderId, status);

    const result = await ordersService.updateStatus(orderId, status);
    const hasError = "error" in result;

    if (hasError) {
      const error = new Error(result.error);
      toast.error(result.error);
      logger.error("Erro ao atualizar status do pedido", error);
      await fetchOrders();
    }
  }, [fetchOrders]);

  return {
    orders: filteredOrders,
    allOrders: orders,
    searchQuery,
    isLoading,
    setSearchQuery,
    updateOrderStatus,
    addOrder: kitchenOrdersObservable.addOrder,
    refetch: fetchOrders,
  };
}
