---
name: spec:prefer-use-memo
description: "Prefer useMemo for Derived State"
---

# Prefer useMemo for Derived State

## Overview
useMemo is the correct tool for computing values based on other values. It prevents unnecessary recalculations and avoids the useEffect anti-pattern.

## Core Principle

**Derived state should be computed, not synchronized.**

If a value can be calculated from existing state/props, use `useMemo` instead of `useState` + `useEffect`.

## Basic Pattern

### ❌ WRONG: useState + useEffect
```typescript
const [total, setTotal] = useState(0);

useEffect(() => {
  const calculated = items.reduce((sum, item) => sum + item.price, 0);
  setTotal(calculated);
}, [items]);
```

**Problems:**
- Extra state variable
- useEffect creates delay (runs after render)
- Can cause infinite loops
- Hard to understand data flow

### ✅ CORRECT: useMemo
```typescript
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

**Benefits:**
- No extra state
- Synchronous computation
- Clear data flow
- Cannot create loops

---

## Common Use Cases

### 1. Filtering/Sorting Lists

**❌ WRONG:**
```typescript
const [filteredUsers, setFilteredUsers] = useState([]);

useEffect(() => {
  const filtered = users.filter(u => u.active);
  setFilteredUsers(filtered);
}, [users]);
```

**✅ CORRECT:**
```typescript
const filteredUsers = useMemo(
  () => users.filter(u => u.active),
  [users]
);
```

---

### 2. Complex Calculations

**❌ WRONG:**
```typescript
const [discountedPrice, setDiscountedPrice] = useState(0);

useEffect(() => {
  const discount = price * (discountPercent / 100);
  setDiscountedPrice(price - discount);
}, [price, discountPercent]);
```

**✅ CORRECT:**
```typescript
const discountedPrice = useMemo(() => {
  const discount = price * (discountPercent / 100);
  return price - discount;
}, [price, discountPercent]);
```

---

### 3. Data Transformations

**❌ WRONG:**
```typescript
const [options, setOptions] = useState([]);

useEffect(() => {
  const transformed = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));
  setOptions(transformed);
}, [categories]);
```

**✅ CORRECT:**
```typescript
const options = useMemo(
  () => categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  })),
  [categories]
);
```

---

### 4. Object/Array Creation

**❌ WRONG:**
```typescript
const [config, setConfig] = useState({});

useEffect(() => {
  setConfig({
    apiUrl: baseUrl,
    timeout: 5000,
    headers: { Authorization: token },
  });
}, [baseUrl, token]);
```

**✅ CORRECT:**
```typescript
const config = useMemo(() => ({
  apiUrl: baseUrl,
  timeout: 5000,
  headers: { Authorization: token },
}), [baseUrl, token]);
```

---

### 5. Combining Multiple Values

**❌ WRONG:**
```typescript
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

**✅ CORRECT:**
```typescript
const fullName = useMemo(
  () => `${firstName} ${lastName}`,
  [firstName, lastName]
);
```

---

## When to Use useMemo

### Always Use When:
1. **Filtering/sorting arrays** - Expensive operations
2. **Transforming data** - Creating new objects/arrays
3. **Complex calculations** - Math, string manipulation
4. **Combining values** - Deriving from multiple sources
5. **Creating stable references** - Objects/arrays used in dependencies

### Example: Stable Reference
```typescript
// ❌ WRONG: New object every render
const queryParams = {
  page,
  size,
  orderBy,
};

useEffect(() => {
  fetchData(queryParams); // Runs every render!
}, [queryParams]);

// ✅ CORRECT: Stable reference
const queryParams = useMemo(() => ({
  page,
  size,
  orderBy,
}), [page, size, orderBy]);

useEffect(() => {
  fetchData(queryParams); // Only runs when params actually change
}, [queryParams]);
```

---

## Performance Considerations

### Don't Overuse useMemo

**❌ WRONG: Premature optimization**
```typescript
// Simple value, no need for useMemo
const isActive = useMemo(() => status === "active", [status]);
```

**✅ CORRECT: Direct computation**
```typescript
// Simple comparison is cheap
const isActive = status === "active";
```

### Use useMemo When:
- Computation is expensive (loops, filtering, transforming)
- Value is used in dependency arrays
- Creating objects/arrays that shouldn't change reference

### Don't Use useMemo When:
- Computation is trivial (simple boolean, string concatenation)
- Value is only used in render (not in dependencies)
- Premature optimization without profiling

---

## Real-World Examples

### From Product Form

```typescript
// Good: Stable default values
const defaultTranslation = useMemo(() => ({
  locale: language,
  name: "",
  description: "",
}), []); // Created once, never changes

// Good: Computed validation state
const hasValidTranslation = useMemo(
  () => allTranslations.some(t => t.name.trim() !== ""),
  [allTranslations]
);

// Good: Transformed data for UI
const languageOptions = useMemo(() => [
  { value: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { value: "en-US", label: "English (US)", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
], []); // Constants, never change
```

### From Category Form

```typescript
// Good: Stable key for dependency arrays
const allTranslationsKey = useMemo(
  () => allTranslations.map(t => `${t.locale}:${t.name}`).join("|"),
  [allTranslations]
);

// Good: Current translation lookup
const currentTranslation = useMemo(
  () => allTranslations.find(t => t.locale === editingLanguage),
  [allTranslations, editingLanguage]
);
```

---

## Checklist

Before using useState + useEffect, ask:
- [ ] Is this value computed from other values?
- [ ] Can I calculate it during render?
- [ ] Do I need to "remember" the result between renders?
- [ ] Is the computation expensive or creates new references?

If yes to all → Use `useMemo`

## See Also
- `avoid-use-effect-anti-pattern.md` - Why useEffect should be avoided
- `prefer-use-callback.md` - For memoizing functions
- `dependency-arrays.md` - Managing dependencies correctly
