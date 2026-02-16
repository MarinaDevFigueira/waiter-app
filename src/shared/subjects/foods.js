import { BehaviorSubject } from "rxjs";
import { foodsByCategory } from "../mocks/foods";

const foodsSubject = new BehaviorSubject(foodsByCategory.pizzas);

export const foodsObservable = {
  subscribe: (callback) => foodsSubject.subscribe(callback),
  getValue: () => foodsSubject.getValue(),
  setFoods: (foods) => foodsSubject.next(foods),
};
