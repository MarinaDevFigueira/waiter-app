import { BehaviorSubject, type Subscription } from "rxjs";

const categorySubject = new BehaviorSubject<string>("pizzas");

export const categoryObservable = {
  subscribe: (callback: (value: string) => void): Subscription =>
    categorySubject.subscribe(callback),
  getValue: (): string => categorySubject.getValue(),
  setCategory: (category: string): void => categorySubject.next(category),
};
