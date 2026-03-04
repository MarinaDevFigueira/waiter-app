# Single Source of Truth - One Place to Change

Every piece of logic, constant, or transformation must have exactly ONE authoritative location in the codebase.

## Rule

- **NEVER** define the same logic in multiple places
- **ALWAYS** have one canonical location for each piece of logic
- **NEVER** copy-paste implementations
- **ALWAYS** import from the single source of truth

## Core Principle

```
One Logic → One Location → Many Consumers
```

## Examples

### ❌ WRONG - Multiple Sources of Truth

```typescript
// useProducts.ts
const languageKey = `language:${language}`;
const queryKey = [languageKey, "products"];

// useCategories.ts
const languageKey = `language:${language}`;
const queryKey = [languageKey, "categories"];

// useOrders.ts
const languageKey = `language:${language}`;
const queryKey = [languageKey, "orders"];
```

**Problem:** The pattern `language:${language}` is defined 3 times. If we need to change the format to `lang_${language}`, we must change 3 files.

### ✅ CORRECT - Single Source of Truth

```typescript
// useLanguage.ts (SINGLE SOURCE)
export function useLanguage() {
  const addLanguagePrefix = (...keys: unknown[]): unknown[] => {
    return [`language:${language}`, ...keys]; // ← Defined ONCE
  };

  return { language, addLanguagePrefix };
}

// useProducts.ts (CONSUMER)
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("products");

// useCategories.ts (CONSUMER)
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("categories");

// useOrders.ts (CONSUMER)
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("orders");
```

**Solution:** Change format once in `useLanguage.ts`, all consumers automatically updated.

## What Needs a Single Source?

### 1. Business Logic

```typescript
// ❌ WRONG - Duplicated logic
// File A
const canEdit = user.role === 'admin' || user.role === 'manager';

// File B
const canEdit = user.role === 'admin' || user.role === 'manager';

// ✅ CORRECT - Single source
// src/lib/permissions.ts
export function canUserEdit(user: User): boolean {
  return user.role === 'admin' || user.role === 'manager';
}

// File A
const canEdit = canUserEdit(user);

// File B
const canEdit = canUserEdit(user);
```

### 2. String Formatting

```typescript
// ❌ WRONG - Duplicated formatting
// File A
const price = `R$ ${value.toFixed(2)}`;

// File B
const price = `R$ ${value.toFixed(2)}`;

// ✅ CORRECT - Single source
// src/lib/format.ts
export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}

// File A
const price = formatPrice(value);

// File B
const price = formatPrice(value);
```

### 3. Data Transformations

```typescript
// ❌ WRONG - Duplicated transformation
// File A
const items = products.map(p => ({ id: p.id, name: p.nome }));

// File B
const items = products.map(p => ({ id: p.id, name: p.nome }));

// ✅ CORRECT - Single source
// src/lib/transformers.ts
export function transformProduct(product: Product) {
  return { id: product.id, name: product.nome };
}

// File A
const items = products.map(transformProduct);

// File B
const items = products.map(transformProduct);
```

### 4. Query Key Patterns

```typescript
// ❌ WRONG - Duplicated pattern
// File A
queryKey: [`language:${language}`, "products"]

// File B
queryKey: [`language:${language}`, "categories"]

// ✅ CORRECT - Single source
// useLanguage.ts
const addLanguagePrefix = (...keys) => [`language:${language}`, ...keys];

// File A
queryKey: addLanguagePrefix("products")

// File B
queryKey: addLanguagePrefix("categories")
```

### 5. Validation Rules

```typescript
// ❌ WRONG - Duplicated validation
// File A
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// File B
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ CORRECT - Single source
// src/lib/validators.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// File A
const isValid = isValidEmail(email);

// File B
const isValid = isValidEmail(email);
```

## Benefits of Single Source

### 1. Change Once, Update Everywhere

```typescript
// BEFORE: Need to change 5 files
// useProducts.ts: `language:${language}`
// useCategories.ts: `language:${language}`
// useOrders.ts: `language:${language}`
// category-form.tsx: `language:${language}`
// product-form.tsx: `language:${language}`

// AFTER: Change once
// useLanguage.ts
const addLanguagePrefix = (...keys) => [`lang_${language}`, ...keys];
// All 5 consumers automatically updated
```

### 2. Consistency Guaranteed

```typescript
// With single source, impossible to have inconsistencies:
queryKey: addLanguagePrefix("products") // Always correct
queryKey: addLanguagePrefix("categories") // Always correct

// Without single source, easy to make mistakes:
queryKey: [`language:${language}`, "products"] // Correct
queryKey: [`lang:${language}`, "categories"] // ⚠️ Inconsistent
```

### 3. Easier Testing

```typescript
// Test once
describe('addLanguagePrefix', () => {
  it('adds language prefix', () => {
    const result = addLanguagePrefix("products");
    expect(result).toEqual(['language:pt-BR', 'products']);
  });
});

// All consumers automatically tested
```

## Detection

Ask yourself:
- "If I need to change this logic, how many files would I need to update?"
- If answer is > 1 → Create single source

## Where to Place Single Source?

**Shared hook:**
```typescript
// If logic relates to hook's domain (language, auth, cart)
export function useLanguage() {
  const addLanguagePrefix = (...keys) => [...];
  return { addLanguagePrefix };
}
```

**lib/ utility:**
```typescript
// If logic is generic (formatting, validation, transformation)
// src/lib/format.ts
export function formatPrice(value: number): string { ... }
```

**Constants file:**
```typescript
// If logic is a constant or enum
// src/shared/constants/permissions.ts
export const ADMIN_ROLES = ['admin', 'manager'];
```

## Anti-Pattern: "Almost the Same" Logic

```typescript
// ❌ WRONG - 95% similar, copy-pasted with slight changes
// File A
const priceLabel = `R$ ${product.price.toFixed(2)}`;

// File B
const totalLabel = `R$ ${order.total.toFixed(2)}`;

// ✅ CORRECT - Single source with parameter
// src/lib/format.ts
export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}

// File A
const priceLabel = formatPrice(product.price);

// File B
const totalLabel = formatPrice(order.total);
```

## Why

- **Maintainability** - One place to update
- **Consistency** - Impossible to have divergent implementations
- **Testability** - Test once, trust everywhere
- **Readability** - Named function clarifies intent
- **Refactoring** - Safe to change without hunting for duplicates
