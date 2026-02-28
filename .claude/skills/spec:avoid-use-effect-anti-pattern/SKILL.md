---
name: spec:avoid-use-effect-anti-pattern
description: "Avoid useEffect Anti-Pattern"
---

# Avoid useEffect Anti-Pattern

## Overview
useEffect is often overused and creates confusing, hard-to-maintain code with circular dependencies and infinite loops. Prefer derived state, useMemo, and useCallback instead.

## Why useEffect is an Anti-Pattern

### Problems with useEffect
1. **Circular Dependencies** - Easy to create infinite loops
2. **Hard to Debug** - Execution order is unclear
3. **Performance Issues** - Triggers unnecessary re-renders
4. **Confusing Code** - Side effects scattered throughout component
5. **Testing Difficulty** - Hard to test and mock

### When useEffect is Actually Needed
- Subscribing to external data sources (WebSocket, RxJS observables)
- Setting up/cleaning up browser APIs (addEventListener, timers)
- Synchronizing with non-React systems (DOM manipulation, third-party libraries)

## Preferred Patterns

### ❌ WRONG: Using useEffect for Derived State
```typescript
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  const filtered = items.filter(item => item.active);
  setFilteredItems(filtered);
}, [items]);
```

### ✅ CORRECT: Use useMemo for Derived State
```typescript
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

---

### ❌ WRONG: Using useEffect to Update State on Prop Change
```typescript
const [internalValue, setInternalValue] = useState(externalValue);

useEffect(() => {
  setInternalValue(externalValue);
}, [externalValue]);
```

### ✅ CORRECT: Use Props Directly or Key Reset
```typescript
// Option 1: Use prop directly
const displayValue = externalValue;

// Option 2: If truly need internal state, use key to reset
<Component key={externalValue} initialValue={externalValue} />
```

---

### ❌ WRONG: Using useEffect for Event Handlers
```typescript
useEffect(() => {
  const handleClick = () => {
    console.log(someValue);
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [someValue]); // Re-subscribes on every change!
```

### ✅ CORRECT: Use useCallback + useEffect with Empty Deps
```typescript
const handleClick = useCallback(() => {
  console.log(someValue);
}, [someValue]);

useEffect(() => {
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []); // Subscribe once, handler updates via closure
```

---

### ❌ WRONG: Chaining useEffects
```typescript
const [step1, setStep1] = useState(null);
const [step2, setStep2] = useState(null);
const [step3, setStep3] = useState(null);

useEffect(() => {
  setStep1(processData(rawData));
}, [rawData]);

useEffect(() => {
  if (step1) {
    setStep2(transformData(step1));
  }
}, [step1]);

useEffect(() => {
  if (step2) {
    setStep3(finalizeData(step2));
  }
}, [step2]);
```

### ✅ CORRECT: Chain with useMemo
```typescript
const step1 = useMemo(() => processData(rawData), [rawData]);
const step2 = useMemo(() => transformData(step1), [step1]);
const step3 = useMemo(() => finalizeData(step2), [step2]);
```

---

## Real-World Examples

### Form Initialization (Anti-Pattern Fixed)

**❌ WRONG:**
```typescript
useEffect(() => {
  if (open && isEditing && product) {
    reset({
      name: product.name,
      price: product.price,
    });
  }
}, [open, isEditing, product, reset]); // Runs every time product changes!
```

**✅ CORRECT:**
```typescript
const hasInitializedRef = useRef(false);

useEffect(() => {
  if (!open) {
    hasInitializedRef.current = false;
    return;
  }

  if (hasInitializedRef.current) return;

  if (isEditing && product) {
    reset({
      name: product.name,
      price: product.price,
    });
    hasInitializedRef.current = true;
  }
}, [open, isEditing, product]); // Reset only controlled via ref
```

---

### Translation Management

**❌ WRONG:**
```typescript
useEffect(() => {
  if (language === 'pt-BR') {
    setValue('translations.0.locale', 'pt-BR');
  } else if (language === 'en-US') {
    setValue('translations.0.locale', 'en-US');
  }
}, [language, setValue]); // Creates loop!
```

**✅ CORRECT:**
```typescript
const switchToLanguage = useCallback((newLanguage) => {
  setValue('translations.0.locale', newLanguage);
  setValue('translations.0.name', '');
}, [setValue]);

// Call directly from event handler, no useEffect
<button onClick={() => switchToLanguage('en-US')}>English</button>
```

---

## Rules

1. **Default to useMemo/useCallback** - Start with these, only use useEffect if truly needed
2. **One useEffect per concern** - Don't combine unrelated logic
3. **Empty dependencies preferred** - Use refs/callbacks to avoid re-running
4. **Question every useEffect** - Ask "Can this be derived state?" first
5. **Document necessity** - If useEffect is needed, add comment explaining why

## Migration Guide

When you see useEffect, ask:

1. **Is this derived state?** → Use `useMemo`
2. **Is this an event handler?** → Use `useCallback`
3. **Is this initialization?** → Use `useRef` + minimal `useEffect`
4. **Is this synchronization?** → OK to use `useEffect` (document why)

## Examples from Codebase

### Product Form (Good Example)
```typescript
// Good: useMemo for stable value
const defaultTranslation = useMemo(() => ({
  locale: language,
  name: "",
  description: "",
}), []); // Created once

// Good: useCallback for handlers
const switchToLanguage = useCallback((newLanguage) => {
  setValue("translations.0.locale", newLanguage);
  // ...
}, [setValue]);

// Good: useEffect only for external subscription
useEffect(() => {
  const subscription = translationsQuery.subscribe(handleData);
  return () => subscription.unsubscribe();
}, []); // Subscribe once
```

## Anti-Pattern Checklist

Before writing useEffect, check:
- [ ] Can this be `useMemo`? (derived state)
- [ ] Can this be `useCallback`? (event handler)
- [ ] Can this be direct prop usage? (no state needed)
- [ ] Can this use `useRef` for initialization control?
- [ ] Is this truly external synchronization? (if no, don't use useEffect)

## See Also
- `prefer-use-memo.md` - Using useMemo for derived state
- `prefer-use-callback.md` - Using useCallback for stable functions
- `dependency-arrays.md` - Managing dependencies correctly
