---
name: spec:prefer-use-callback
description: "Prefer useCallback for Stable Functions"
---

# Prefer useCallback for Stable Functions

## Overview
useCallback prevents functions from being recreated on every render, avoiding unnecessary re-renders and infinite loops in useEffect dependencies.

## Core Principle

**Event handlers and callbacks should have stable references.**

If a function is used in dependency arrays or passed to child components, wrap it with `useCallback`.

## Basic Pattern

### ❌ WRONG: Function Recreated Every Render
```typescript
const handleClick = () => {
  console.log(value);
};

useEffect(() => {
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [handleClick]); // Re-subscribes every render!
```

**Problems:**
- Function recreated on every render
- useEffect runs on every render
- Event listeners removed and re-added constantly
- Performance impact

### ✅ CORRECT: Stable Function Reference
```typescript
const handleClick = useCallback(() => {
  console.log(value);
}, [value]);

useEffect(() => {
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, [handleClick]); // Only re-subscribes when handleClick actually changes
```

**Benefits:**
- Function only recreated when dependencies change
- useEffect runs only when necessary
- Better performance
- Clearer intent

---

## Common Use Cases

### 1. Event Handlers in Dependencies

**❌ WRONG:**
```typescript
const handleSubmit = (data) => {
  submitForm(data);
};

useEffect(() => {
  form.on('submit', handleSubmit);
  return () => form.off('submit', handleSubmit);
}, [handleSubmit]); // Loops!
```

**✅ CORRECT:**
```typescript
const handleSubmit = useCallback((data) => {
  submitForm(data);
}, [submitForm]);

useEffect(() => {
  form.on('submit', handleSubmit);
  return () => form.off('submit', handleSubmit);
}, [handleSubmit]); // Only re-runs when needed
```

---

### 2. Callbacks Passed to Children

**❌ WRONG:**
```typescript
function Parent() {
  const handleChange = (value) => {
    setValue(value);
  };

  return <Child onChange={handleChange} />; // Child re-renders every time!
}
```

**✅ CORRECT:**
```typescript
function Parent() {
  const handleChange = useCallback((value) => {
    setValue(value);
  }, []);

  return <Child onChange={handleChange} />; // Child only re-renders when onChange actually changes
}
```

---

### 3. Functions Calling setState

**❌ WRONG:**
```typescript
const updateItem = (id, newData) => {
  setItems(items.map(item =>
    item.id === id ? { ...item, ...newData } : item
  ));
};
```

**✅ CORRECT:**
```typescript
const updateItem = useCallback((id, newData) => {
  setItems(prevItems =>
    prevItems.map(item =>
      item.id === id ? { ...item, ...newData } : item
    )
  );
}, []); // No dependencies - uses functional update
```

---

### 4. API Calls

**❌ WRONG:**
```typescript
const fetchData = async () => {
  const result = await api.get(`/users/${userId}`);
  setData(result);
};

useEffect(() => {
  fetchData();
}, [fetchData]); // Infinite loop!
```

**✅ CORRECT:**
```typescript
const fetchData = useCallback(async () => {
  const result = await api.get(`/users/${userId}`);
  setData(result);
}, [userId]);

useEffect(() => {
  fetchData();
}, [fetchData]); // Only fetches when userId changes
```

---

## Functional Updates vs Dependencies

### Pattern 1: Using Functional Updates (Preferred)

```typescript
const increment = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // No dependencies needed!
```

**Benefits:**
- Empty dependency array
- Function never recreated
- Always uses latest state via closure

### Pattern 2: Including Dependencies

```typescript
const increment = useCallback(() => {
  setCount(count + 1);
}, [count]); // Must include count
```

**Downsides:**
- Function recreated when count changes
- Can cause unnecessary re-renders

**Rule:** Prefer functional updates to minimize dependencies.

---

## Real-World Examples

### From Product Form

```typescript
// Good: Stable language switcher
const switchToLanguage = useCallback((newLanguage) => {
  const currentName = watch("translations.0.name");
  const currentDescription = watch("translations.0.description") ?? "";

  // Save current translation
  setAllTranslations(prev => {
    const withoutCurrent = prev.filter(t => t.locale !== editingLanguage);
    return [...withoutCurrent, {
      locale: editingLanguage,
      name: currentName,
      description: currentDescription
    }];
  });

  // Load new language
  setValue("translations.0.locale", newLanguage);
  setValue("translations.0.name", "");
  setValue("translations.0.description", "");

  setEditingLanguage(newLanguage);
}, [watch, setValue, editingLanguage]);

// Good: Check unsaved changes
const checkUnsavedChanges = useCallback(() => {
  const current = allTranslations.find(t => t.locale === editingLanguage);
  const currentName = watch("translations.0.name");
  const currentDescription = watch("translations.0.description") ?? "";

  if (!current) {
    return currentName.trim() !== "" || currentDescription.trim() !== "";
  }

  return currentName !== current.name ||
         currentDescription !== (current.description ?? "");
}, [allTranslations, editingLanguage, watch]);

// Good: Form submission
const onSubmit = useCallback((data) => {
  // Collect all translations
  const currentTranslation = {
    locale: editingLanguage,
    name: data.translations[0].name,
    description: data.translations[0].description ?? "",
  };

  const allTranslationsToSubmit = [
    ...allTranslations.filter(t => t.locale !== editingLanguage),
    currentTranslation,
  ].filter(t => t.name.trim() !== "");

  const payload = {
    ...data,
    translations: allTranslationsToSubmit,
  };

  if (isEditing) {
    updateMutation.mutate({ data: payload, files });
  } else {
    createMutation.mutate({ data: payload, files });
  }
}, [editingLanguage, allTranslations, isEditing, updateMutation, createMutation, files]);
```

---

## When to Use useCallback

### Always Use When:
1. **Function is in useEffect dependencies** - Prevents infinite loops
2. **Function is passed to child components** - Prevents unnecessary re-renders
3. **Function is expensive to create** - Contains complex logic
4. **Function is used in multiple places** - Maintains consistency

### Don't Use When:
1. **Function is only called in render** - No need for stability
2. **Function is defined in event handler** - Already stable per invocation
3. **Function has no dependencies** - Consider extracting outside component

---

## Anti-Patterns

### ❌ WRONG: Missing Dependencies
```typescript
const handleClick = useCallback(() => {
  console.log(value); // Using value but not in dependencies
}, []); // ESLint warning!
```

### ✅ CORRECT: Include All Dependencies
```typescript
const handleClick = useCallback(() => {
  console.log(value);
}, [value]); // All external values included
```

---

### ❌ WRONG: Unnecessary useCallback
```typescript
// Function only used in render, no need for useCallback
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);

return <button onClick={handleClick}>Click</button>;
```

### ✅ CORRECT: Inline or Direct
```typescript
// Simple case, can be inline
return <button onClick={() => setCount(c => c + 1)}>Click</button>;

// Or direct if defined once
const handleClick = () => setCount(c => c + 1);
return <button onClick={handleClick}>Click</button>;
```

---

## Combining with useMemo

Sometimes you need both:

```typescript
// Memoized value
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);

// Memoized callback that uses memoized value
const handleSelect = useCallback((id) => {
  const item = filteredItems.find(i => i.id === id);
  if (item) {
    onSelect(item);
  }
}, [filteredItems, onSelect]);
```

---

## Checklist

Before creating a function, ask:
- [ ] Is this function used in useEffect dependencies?
- [ ] Is this function passed to child components?
- [ ] Does this function depend on props/state?
- [ ] Can I use functional setState to remove dependencies?

If yes to first two → Use `useCallback`

## See Also
- `avoid-use-effect-anti-pattern.md` - Why useEffect should be minimized
- `prefer-use-memo.md` - For memoizing values
- `dependency-arrays.md` - Managing dependencies correctly
