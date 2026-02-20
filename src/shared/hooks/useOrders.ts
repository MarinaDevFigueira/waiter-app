import { useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";
import { ordersService } from "@/services/orders/orders.service";
import type { PaginatedOrders } from "@/services/orders/orders.service";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";
import { SortDirection } from "@/shared/enums/sort-direction.enum";
import { OrdersOrderByEnum } from "@/shared/enums/orders-order-by.enum";
import type { OrdersQueryParams, UseOrdersReturn } from "@/shared/hooks/useOrders.interface";

const DEFAULT_QUERY_PARAMS: OrdersQueryParams = {
  search: "",
  orderBy: OrdersOrderByEnum.CREATED_AT,
  direction: SortDirection.DESC,
  page: 1,
  size: 10,
};

export function useOrders(): UseOrdersReturn {
  const queryClient = useQueryClient();
  const [optimisticOrders, setOptimisticOrders] = useState<Order[]>(kitchenOrdersObservable.getValue());
  const [queryParams, setQueryParams] = useState<OrdersQueryParams>(DEFAULT_QUERY_PARAMS);

  const { data, isLoading, error, isError } = useQuery<PaginatedOrders>({
    queryKey: ["orders", queryParams],
    queryFn: async () => {
      const result = await ordersService.getAll({
        search: queryParams.search || undefined,
        orderBy: queryParams.orderBy,
        direction: queryParams.direction,
        page: queryParams.page,
        size: queryParams.size,
      });

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error("Nenhum dado retornado");
      }

      kitchenOrdersObservable.setOrders(result.data.items);
      return result.data;
    },
    placeholderData: keepPreviousData,
    retry: 2,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("[useOrders] Erro ao buscar pedidos:", error);
      toast.error(error.message ?? "Erro ao buscar pedidos");
      logger.error("Erro ao buscar pedidos", error);
    }
  }, [isError, error]);

  useEffect(() => {
    const subscription = kitchenOrdersObservable.subscribe(setOptimisticOrders);
    return () => subscription.unsubscribe();
  }, []);

  const orders = useMemo<Order[]>(() => {
    const hasOptimisticData = optimisticOrders.length > 0;
    if (hasOptimisticData) return optimisticOrders;
    const hasCachedItems = data?.items != null;
    if (hasCachedItems) return data.items;
    return [];
  }, [data, optimisticOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    kitchenOrdersObservable.updateOrderStatus(orderId, status);

    const result = await ordersService.updateStatus(orderId, status);
    const hasError = "error" in result;

    if (hasError) {
      const updateError = new Error(result.error);
      toast.error(result.error);
      logger.error("Erro ao atualizar status do pedido", updateError);
    }

    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  }, [queryClient]);

  return {
    orders,
    queryParams,
    isLoading,
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    size: data?.size ?? 10,
    totalPages: data?.totalPages ?? 0,
    hasNextPage: data?.hasNextPage ?? false,
    hasPreviousPage: data?.hasPreviousPage ?? false,
    setQueryParams,
    updateOrderStatus,
    refetch,
  };
}
