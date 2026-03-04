# RxJS Subject Pattern

All RxJS BehaviorSubjects must follow the encapsulated pattern for consistency and safety.

## Rule

**ALWAYS** encapsulate BehaviorSubjects in an observable object that exposes only necessary methods. **NEVER** export subjects directly.

## Pattern

```javascript
import { BehaviorSubject } from "rxjs";

const mySubject = new BehaviorSubject(initialValue);

export const myObservable = {
  subscribe: (callback) => mySubject.subscribe(callback),
  getValue: () => mySubject.getValue(),
  setValue: (value) => mySubject.next(value),
};
```

## Complete Example

```javascript
import { BehaviorSubject } from "rxjs";
import { kitchenOrdersMock } from "@/shared/mocks/kitchen-orders";

const kitchenOrdersSubject = new BehaviorSubject(kitchenOrdersMock);

export const kitchenOrdersObservable = {
  subscribe: (callback) => kitchenOrdersSubject.subscribe(callback),
  getValue: () => kitchenOrdersSubject.getValue(),
  setOrders: (orders) => kitchenOrdersSubject.next(orders),
  updateOrderStatus: (orderId, status) => {
    const currentOrders = kitchenOrdersSubject.getValue();
    const updatedOrders = currentOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    kitchenOrdersSubject.next(updatedOrders);
  },
};
```

## Why

- **Encapsulation**: Subject is private, preventing direct manipulation
- **API consistency**: All subjects expose the same base interface (subscribe, getValue)
- **Safety**: Can't accidentally call `.next()` directly on the subject
- **Testability**: Easy to mock the observable object

## Naming Convention

- Subject variable: `{name}Subject` (private)
- Exported object: `{name}Observable`
- Methods: descriptive verbs (`getValue`, `setValue`, `updateX`, `addX`)
