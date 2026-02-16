import { BehaviorSubject } from "rxjs";
import { kitchenOrdersMock } from "@/shared/mocks/kitchen-orders";

const kitchenOrdersSubject = new BehaviorSubject(kitchenOrdersMock);

export const kitchenOrdersObservable = {
  subscribe: (callback) => kitchenOrdersSubject.subscribe(callback),
  getValue: () => kitchenOrdersSubject.getValue(),
  setOrders: (orders) => kitchenOrdersSubject.next(orders),
  updateOrderStatus: (orderId, status) => {
    const currentOrders = kitchenOrdersSubject.getValue();
    const updatedOrders = currentOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    kitchenOrdersSubject.next(updatedOrders);
  },
  addOrder: (order) => {
    const currentOrders = kitchenOrdersSubject.getValue();
    kitchenOrdersSubject.next([...currentOrders, order]);
  },
};
