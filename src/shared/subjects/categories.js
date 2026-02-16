import { BehaviorSubject } from "rxjs";

const categorySubject = new BehaviorSubject("pizzas");

export const categoryObservable = {
  subscribe: (callback) => categorySubject.subscribe(callback),
  getValue: () => categorySubject.getValue(),
  setCategory: (category) => categorySubject.next(category),
};
