import { useEffect, useState, useMemo } from "react";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";

interface UseKitchenOrdersReturn {
  orders: Order[];
  allOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
}

export function useKitchenOrders(): UseKitchenOrdersReturn {
  const [orders, setOrders] = useState<Order[]>(kitchenOrdersObservable.getValue());
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const subscription = kitchenOrdersObservable.subscribe(setOrders);
    return () => subscription.unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return orders.filter((order) => {
      return (
        order.table.toLowerCase().includes(searchLower) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchLower))
      );
    });
  }, [orders, searchQuery]);

  return {
    orders: filteredOrders,
    allOrders: orders,
    searchQuery,
    setSearchQuery,
    updateOrderStatus: kitchenOrdersObservable.updateOrderStatus,
    addOrder: kitchenOrdersObservable.addOrder,
  };
}
