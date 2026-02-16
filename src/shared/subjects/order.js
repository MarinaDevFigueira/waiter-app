import { BehaviorSubject } from "rxjs";

const orderSubject = new BehaviorSubject({
  id: crypto.randomUUID(),
  table: null,
  products: [],
});

const ordersSubject = new BehaviorSubject([]);

export const orderObservable = {
  subscribe: (callback) => orderSubject.subscribe(callback),
  getValue: () => orderSubject.getValue(),
  setOrder: (order) => orderSubject.next(order),
  resetOrder: () => orderSubject.next({
    id: crypto.randomUUID(),
    table: null,
    products: [],
  }),
};

export const ordersObservable = {
  subscribe: (callback) => ordersSubject.subscribe(callback),
  getValue: () => ordersSubject.getValue(),
  setOrders: (orders) => ordersSubject.next(orders),
  addOrder: (order) => {
    const currentOrders = ordersSubject.getValue();
    ordersSubject.next([...currentOrders, order]);
  },
};
