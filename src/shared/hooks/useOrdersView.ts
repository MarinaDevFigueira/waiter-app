import { useEffect, useState, useCallback } from "react";
import { ordersViewObservable } from "@/shared/subjects/orders-view.subject";
import { type OrdersView } from "@/shared/enums/orders-view.enum";

export function useOrdersView() {
  const [view, setView] = useState<OrdersView>(ordersViewObservable.getValue());

  useEffect(() => {
    const subscription = ordersViewObservable.subscribe(setView);
    return () => subscription.unsubscribe();
  }, []);

  const setOrdersView = useCallback((newView: OrdersView) => {
    ordersViewObservable.setView(newView);
  }, []);

  return { view, setOrdersView };
}
