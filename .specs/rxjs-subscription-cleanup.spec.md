# Always cleanup RxJS subscriptions in useEffect

BehaviorSubject subscriptions must be unsubscribed on component unmount.

## Rule

- Subscribe to BehaviorSubjects inside `useEffect`
- Always return cleanup function that unsubscribes
- Store subscription reference before returning cleanup

## Example

```javascript
// WRONG — no cleanup, causes memory leak
useEffect(() => {
  foodsSubject.subscribe(setFoods);
}, []);

// WRONG — subscription not stored
useEffect(() => {
  foodsSubject.subscribe(setFoods);
  return () => {}; // nothing to unsubscribe
}, []);

// CORRECT
useEffect(() => {
  const subscription = foodsSubject.subscribe(setFoods);
  return () => subscription.unsubscribe();
}, []);
```

## Why

RxJS subscriptions persist after component unmount unless explicitly unsubscribed. This causes memory leaks and unwanted side effects. The cleanup function prevents this.
