import { BehaviorSubject } from "rxjs";
import { foodsByCategory } from "../mocks/foods";

export const foodsSubject = new BehaviorSubject(foodsByCategory.pizzas);
