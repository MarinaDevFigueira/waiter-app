## RxJS Observable Pattern
Encapsulate BehaviorSubject — never export directly.

```js
const subject = new BehaviorSubject(initialState);
export const myObservable = {
  subscribe: (cb) => subject.subscribe(cb),
  getValue: () => subject.getValue(),
  updateState: (partial) => subject.next({ ...subject.getValue(), ...partial }),
  resetState: () => subject.next(initialState),
};
```

Component usage — ALWAYS cleanup:
```jsx
useEffect(() => {
  const sub = myObservable.subscribe(setState);
  return () => sub.unsubscribe();
}, []);
```

Locations: Global → `src/shared/subjects/{name}.subject.ts` · Component-specific → `src/pages/{feature}/components/{name}/observables/`