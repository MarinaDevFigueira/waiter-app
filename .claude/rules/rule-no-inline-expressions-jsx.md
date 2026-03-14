## No Inline Expressions in JSX
```jsx
// ❌ {[...Array(8)].map(...)}
// ✅ const rows = [...Array(8)]; {rows.map(...)}
```