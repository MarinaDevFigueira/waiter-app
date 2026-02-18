import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";
import { ordersService } from "@/services/orders/orders.service";
import type { OrderStatus } from "@/shared/schemas/order.schema";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import type { OrdersQueryParams, UseOrdersReturn } from "@/shared/hooks/useOrders.interface";

const DEFAULT_QUERY_PARAMS: OrdersQueryParams = {
  search: "",
  orderBy: OrdersOrderByEnum.CREATED_AT,
  direction: SortDirection.DESC,
};

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState(kitchenOrdersObservable.getValue());
  const [queryParams, setQueryParams] = useState<OrdersQueryParams>(DEFAULT_QUERY_PARAMS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOrders = useCallback(async (params: OrdersQueryParams) => {
    setIsLoading(true);

    const result = await ordersService.getAll({
      search: params.search || undefined,
      orderBy: params.orderBy,
      direction: params.direction,
    });
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
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchOrders(queryParams);
  }, [fetchOrders, queryParams]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    kitchenOrdersObservable.updateOrderStatus(orderId, status);

    const result = await ordersService.updateStatus(orderId, status);
    const hasError = "error" in result;

    if (hasError) {
      const error = new Error(result.error);
      toast.error(result.error);
      logger.error("Erro ao atualizar status do pedido", error);
      await fetchOrders(queryParams);
    }
  }, [fetchOrders, queryParams]);

  return {
    orders,
    queryParams,
    isLoading,
    setQueryParams,
    updateOrderStatus,
    addOrder: kitchenOrdersObservable.addOrder,
    refetch: () => fetchOrders(queryParams),
  };
}
