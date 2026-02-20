import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders/orders.service";
import type { PaginatedOrders } from "@/services/orders/orders.service";

export function useOrderSessionOrders(orderSessionId: string | null) {
  return useQuery<PaginatedOrders>({
    queryKey: ["orders", { orderSessionId }],
    queryFn: async () => {
      const result = await ordersService.getAll({
        orderSessionId: orderSessionId as string,
        size: 100,
      });

      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: Boolean(orderSessionId),
  });
}
