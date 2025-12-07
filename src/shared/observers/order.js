import { BehaviorSubject } from "rxjs";

export const orderObserver = new BehaviorSubject({
  id: crypto.randomUUID(),
  table: null,
  products: [],
});

export const ordersObserver = new BehaviorSubject([]);
