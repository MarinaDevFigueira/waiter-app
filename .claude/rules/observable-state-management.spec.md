# Observable State Management Pattern

## When to Use

Use RxJS BehaviorSubject observables for state management when:

- State needs to be shared across multiple components
- State changes need to be reactive and propagate automatically
- You need to maintain a centralized source of truth
- State requires subscription/unsubscription lifecycle

**Do NOT use observables for:**
- Component-local state that doesn't need sharing
- Simple derived values (use `useMemo` instead)
- One-time data fetching (use TanStack Query)

## Observable Structure

### File Location

**For global/shared state:**
`/src/shared/subjects/{name}.subject.ts`

Examples: `cart.subject.ts`, `foods.subject.ts`, `categories.subject.ts`

**For component-specific state:**
`/src/pages/{feature}/components/{component}/observables/{component}.subject.ts`

Examples:
- `/src/pages/foods/components/categories/observables/categories-swiper.subject.ts`
- `/src/pages/orders/components/filters/observables/filters.subject.ts`

### Naming Convention
- File: `kebab-case.subject.ts` (e.g., `cart.subject.ts`)
- Interface: `PascalCase + State` (e.g., `CartState`)
- Observable export: `camelCase + Observable` (e.g., `cartObservable`)

### Template

```typescript
import { BehaviorSubject } from "rxjs";

// 1. Define state interface
interface MyFeatureState {
  property1: string;
  property2: number;
  isLoading: boolean;
}

// 2. Define initial state with explicit types
const initialState: MyFeatureState = {
  property1: "",
  property2: 0,
  isLoading: false,
};

// 3. Create private BehaviorSubject
const subject = new BehaviorSubject<MyFeatureState>(initialState);

// 4. Export encapsulated observable (do NOT export subject directly)
export const myFeatureObservable = {
  /**
   * Subscribe to state changes
   */
  subscribe: (callback: (state: MyFeatureState) => void) =>
    subject.subscribe(callback),

  /**
   * Get current state value
   */
  getValue: (): MyFeatureState => subject.getValue(),

  /**
   * Update state (partial update)
   */
  updateState: (newState: Partial<MyFeatureState>): void => {
    const currentState = subject.getValue();
    const updatedState = { ...currentState, ...newState };
    subject.next(updatedState);
  },

  /**
   * Reset to initial state
   */
  resetState: (): void => {
    subject.next(initialState);
  },
};
```

## Component Subscription Pattern

### Basic Subscription

```tsx
import { useState, useEffect } from "react";
import { myFeatureObservable } from "@/shared/subjects/my-feature.subject";

function MyComponent() {
  // 1. Initialize with current value
  const [state, setState] = useState(myFeatureObservable.getValue());

  // 2. Subscribe to changes
  useEffect(() => {
    const subscription = myFeatureObservable.subscribe(setState);

    // 3. Cleanup subscription
    return () => subscription.unsubscribe();
  }, []); // Empty deps - subscribe once

  // 4. Use state
  const { property1, property2, isLoading } = state;

  return <div>{property1}</div>;
}
```

### Updating State

```tsx
// Update partial state
myFeatureObservable.updateState({ property1: "new value" });

// Update multiple properties
myFeatureObservable.updateState({
  property1: "new value",
  isLoading: true,
});

// Reset to initial state
myFeatureObservable.resetState();
```

## Best Practices

### ✅ DO

- **Encapsulate BehaviorSubject** - Never expose `subject` directly
- **Type everything** - Use TypeScript interfaces for state
- **Initialize with getValue()** - `useState(observable.getValue())`
- **Always cleanup** - Return `subscription.unsubscribe()` in useEffect
- **Partial updates** - Use `updateState()` for partial state changes
- **Named extraction** - Extract properties before use: `const { isLoading } = state;`

### ❌ DON'T

- **Don't expose BehaviorSubject** - Export encapsulated object only
- **Don't forget cleanup** - Always unsubscribe to prevent memory leaks
- **Don't mutate state** - Use `updateState()`, never mutate `getValue()` result
- **Don't subscribe in render** - Only subscribe in `useEffect`
- **Don't use for server state** - Use TanStack Query instead

## Examples from Codebase

### Global State Observables

**Cart Observable**
`/src/shared/subjects/cart.subject.ts` - Shopping cart state with items, session ID

**Foods Observable**
`/src/shared/subjects/foods.subject.ts` - Products list state

**Categories Observable**
`/src/shared/subjects/categories.subject.ts` - Categories data

### Component-Specific Observables

**Categories Swiper Observable**
`/src/pages/foods/components/categories/observables/categories-swiper.subject.ts` - Swiper navigation state (isBeginning, isEnd)

## Migration from useState

When migrating from `useState` to observable:

```tsx
// BEFORE (useState)
const [value, setValue] = useState(initialValue);

// Update
setValue(newValue);

// AFTER (Observable)
// 1. Create observable in /src/shared/subjects/
export const featureObservable = {
  subscribe: (cb) => subject.subscribe(cb),
  getValue: () => subject.getValue(),
  updateState: (newState) => subject.next({ ...subject.getValue(), ...newState }),
};

// 2. Use in component
const [state, setState] = useState(featureObservable.getValue());

useEffect(() => {
  const subscription = featureObservable.subscribe(setState);
  return () => subscription.unsubscribe();
}, []);

// Update
featureObservable.updateState({ value: newValue });
```

## Testing

When testing components that use observables:

```tsx
import { myFeatureObservable } from "@/shared/subjects/my-feature.subject";

beforeEach(() => {
  // Reset state before each test
  myFeatureObservable.resetState();
});

test("component updates when observable changes", () => {
  // Arrange
  render(<MyComponent />);

  // Act
  myFeatureObservable.updateState({ property1: "test" });

  // Assert
  expect(screen.getByText("test")).toBeInTheDocument();
});
```
