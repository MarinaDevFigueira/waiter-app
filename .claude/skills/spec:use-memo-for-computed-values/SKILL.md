---
name: spec:use-memo-for-computed-values
description: "Always use useMemo for computed values in components"
---

# Always use useMemo for computed values in components

Derived values that depend on props or state must use `useMemo` for performance optimization.

## Rule

- Never compute derived values using functions called during render
- Always use `useMemo` with proper dependencies for computed values
- Declare computed values as `const` with `useMemo`, not function calls
- Extract values from objects before passing to dependency array (never use `object.field` in dependencies)
- Include all dependencies in the dependency array

## Example

```javascript
// WRONG — function called on every render
const getBreadcrumbs = () => {
  const path = location.pathname;
  const segments = path.split("/").filter(Boolean);
  return segments.map(segment => ({ label: segment, path: `/${segment}` }));
};
const breadcrumbs = getBreadcrumbs();

// WRONG — object.field in dependency array
const breadcrumbs = useMemo(() => {
  const path = location.pathname;
  const segments = path.split("/").filter(Boolean);
  return segments.map(segment => ({ label: segment, path: `/${segment}` }));
}, [location.pathname]); // Don't use location.pathname directly

// CORRECT — extract value first, then memoize
const pathname = location.pathname; // or const { pathname } = location
const breadcrumbs = useMemo(() => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map(segment => ({ label: segment, path: `/${segment}` }));
}, [pathname]);
```

## Why

Function calls during render execute on every component re-render, even when dependencies haven't changed. `useMemo` caches the result and only recalculates when dependencies change. Dependencies must be primitive values or direct references, not object properties, to ensure proper memoization.
