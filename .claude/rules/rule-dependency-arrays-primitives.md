## Dependency Arrays — Primitives Only
```jsx
const categoryIds = categories.map(c => c.id).join(',');
useEffect(() => { ... }, [categoryIds]);
const { page, size } = queryParams;
useEffect(() => { ... }, [page, size]);
```