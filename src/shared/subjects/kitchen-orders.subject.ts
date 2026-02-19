import { BehaviorSubject, type Subscription } from "rxjs";
import type { Order, OrderStatus } from "@/shared/schemas/order.schema";

const kitchenOrdersSubject = new BehaviorSubject<Order[]>([]);

export const kitchenOrdersObservable = {
  subscribe: (callback: (value: Order[]) => void): Subscription =>
    kitchenOrdersSubject.subscribe(callback),
  getValue: (): Order[] => kitchenOrdersSubject.getValue(),
  setOrders: (orders: Order[]): void => kitchenOrdersSubject.next(orders),
  updateOrderStatus: (orderId: string, status: OrderStatus): void => {
    const currentOrders = kitchenOrdersSubject.getValue();
    const updatedOrders = currentOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    kitchenOrdersSubject.next(updatedOrders);
  },
  addOrder: (order: Order): void => {
    const currentOrders = kitchenOrdersSubject.getValue();
    kitchenOrdersSubject.next([...currentOrders, order]);
  },
};
