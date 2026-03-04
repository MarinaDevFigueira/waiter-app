# React Hook Optional Chaining Spec

## Rule

**NEVER** use optional chaining (`?.`) directly inside React hook dependency arrays.

## Why

Optional chaining expressions like `value?.id` do not work correctly as hook dependencies. React's dependency comparison cannot properly track changes when optional chaining is used inline in the array.

## Pattern

### Incorrect

```tsx
// ❌ BAD - Optional chaining in dependency array
const memoized = useMemo(() => {
  return items.filter(item => item.id === value?.id);
}, [items, value?.id]);

// ❌ BAD - Multiple optional chains
const callback = useCallback(() => {
  return user?.profile?.name;
}, [user?.profile?.name]);

// ❌ BAD - In useEffect
useEffect(() => {
  if (data?.items) {
    setItems(data.items);
  }
}, [data?.items]);
```

### Correct

```tsx
// ✅ GOOD - Extract to named constant first
const valueId = value?.id;
const memoized = useMemo(() => {
  return items.filter(item => item.id === valueId);
}, [items, valueId]);

// ✅ GOOD - Extract nested optional chains
const profileName = user?.profile?.name;
const callback = useCallback(() => {
  return profileName;
}, [profileName]);

// ✅ GOOD - Extract before useEffect
const dataItems = data?.items;
useEffect(() => {
  if (dataItems) {
    setItems(dataItems);
  }
}, [dataItems]);
```

## Applies To

- `useMemo` dependency arrays
- `useCallback` dependency arrays
- `useEffect` dependency arrays
- `useLayoutEffect` dependency arrays
- Any custom hook with dependency arrays

## Variable Naming

Use descriptive names that reflect the extracted value:

```tsx
// Good naming
const userId = user?.id;
const profileName = user?.profile?.name;
const selectedItemId = selectedItem?.id;
const businessName = auth?.business?.name;
```
