import { BehaviorSubject, type Subscription } from "rxjs";
import type { FoodItem } from "@/shared/mocks/foods";

interface CurrentOrder {
  id: string;
  table: string | null;
  products: FoodItem[];
}

const orderSubject = new BehaviorSubject<CurrentOrder>({
  id: crypto.randomUUID(),
  table: null,
  products: [],
});

const ordersSubject = new BehaviorSubject<CurrentOrder[]>([]);

export const orderObservable = {
  subscribe: (callback: (value: CurrentOrder) => void): Subscription =>
    orderSubject.subscribe(callback),
  getValue: (): CurrentOrder => orderSubject.getValue(),
  setOrder: (order: CurrentOrder): void => orderSubject.next(order),
  resetOrder: (): void =>
    orderSubject.next({
      id: crypto.randomUUID(),
      table: null,
      products: [],
    }),
};

export const ordersObservable = {
  subscribe: (callback: (value: CurrentOrder[]) => void): Subscription =>
    ordersSubject.subscribe(callback),
  getValue: (): CurrentOrder[] => ordersSubject.getValue(),
  setOrders: (orders: CurrentOrder[]): void => ordersSubject.next(orders),
  addOrder: (order: CurrentOrder): void => {
    const currentOrders = ordersSubject.getValue();
    ordersSubject.next([...currentOrders, order]);
  },
};

export type { CurrentOrder };
