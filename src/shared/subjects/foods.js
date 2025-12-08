import { BehaviorSubject } from "rxjs";
import { pizzasMock } from "../mocks/pizzas";

export const foodsSubject = new BehaviorSubject(pizzasMock);
