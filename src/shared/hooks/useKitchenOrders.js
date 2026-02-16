import { useEffect, useState, useMemo } from "react";
import { kitchenOrdersObservable } from "@/shared/subjects/kitchen-orders.subject";

export function useKitchenOrders() {
  const [orders, setOrders] = useState(kitchenOrdersObservable.getValue());
  const [searchQuery, setSearchQuery] = useState("");

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
