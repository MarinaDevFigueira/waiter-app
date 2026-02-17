import { BehaviorSubject, type Subscription } from "rxjs";
import { foodsByCategory, type FoodItem } from "../mocks/foods";

const foodsSubject = new BehaviorSubject<FoodItem[]>(foodsByCategory.pizzas);

export const foodsObservable = {
  subscribe: (callback: (value: FoodItem[]) => void): Subscription =>
    foodsSubject.subscribe(callback),
  getValue: (): FoodItem[] => foodsSubject.getValue(),
  setFoods: (foods: FoodItem[]): void => foodsSubject.next(foods),
};
