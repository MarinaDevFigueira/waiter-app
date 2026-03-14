## useMemo for Derived State
- Never `useEffect` to derive state. Always `useMemo`.
- Extract object properties before dependency arrays — no optional chaining in deps:
```jsx
const pathname = location.pathname; // not location.pathname in deps
const userId = user?.id;            // not user?.id in deps
```