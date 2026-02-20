import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { ordersService } from "@/services/orders/orders.service";
import type { PaginatedOrders } from "@/services/orders/orders.service";

export function useOrderSessionOrders(orderSessionId: string | null) {
  const query = useQuery<PaginatedOrders>({
    queryKey: ["orders", { orderSessionId }],
    queryFn: async () => {
      const result = await ordersService.getAll({
        orderSessionId: orderSessionId as string,
        size: 100,
      });

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (!result.data) {
        throw new Error("Nenhum dado retornado");
      }

      return result.data;
    },
    enabled: Boolean(orderSessionId),
    retry: 2,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message);
      logger.error("Erro ao buscar pedidos da sessão", query.error);
    }
  }, [query.isError, query.error]);

  return query;
}
