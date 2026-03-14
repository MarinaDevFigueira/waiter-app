## Named Variables — No Inline Conditionals in JSX
NEVER use `? :`, `&&`, or `??` directly in JSX. ALWAYS extract to named variables.

Prefixes: `should` (render) · `has` (data) · `is` (state) · `can` (permissions)

```jsx
// ❌ {isLoading && <Spinner />} / <Button variant={x ? "a" : "b"} />
// ✅
const buttonVariant = isSuccess ? "outline" : "default";
const content = useMemo(() => {
  if (shouldShowLoading) return <Loading />;
  if (shouldShowEmpty) return <Empty />;
  return <List />;
}, [shouldShowLoading, shouldShowEmpty]);
```