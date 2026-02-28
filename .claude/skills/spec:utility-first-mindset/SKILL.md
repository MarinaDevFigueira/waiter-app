---
name: spec:utility-first-mindset
description: "Utility-First Mindset"
---

# Utility-First Mindset

Always think "Can this be a utility?" before writing code inline.

## Rule

- **ALWAYS** ask "Should this be a utility?" before writing logic
- **NEVER** write inline when pattern might be reused
- **ALWAYS** extract utilities proactively
- **NEVER** defer extraction to "later" or "when needed"

## Core Mindset Shift

```
Old: Write inline → Wait for duplication → Refactor
New: Think utility-first → Extract immediately → Never duplicate
```

## The Utility-First Question

Before writing ANY logic, ask:

**"Could I imagine using this logic somewhere else?"**

- If **YES** → Extract to utility immediately
- If **MAYBE** → Extract to utility (cheaper to extract now than refactor later)
- If **NO** → Write inline (very rare)

## Examples

### Example 1: String Formatting

```typescript
// ❌ OLD MINDSET - Write inline first
function ProductCard() {
  const formattedPrice = `R$ ${product.price.toFixed(2)}`;
  return <div>{formattedPrice}</div>;
}

// Later realize need it elsewhere → painful refactor

// ✅ UTILITY-FIRST MINDSET
// Ask: "Could I use price formatting elsewhere?"
// Answer: "Yes, prices appear everywhere"
// Action: Extract immediately

// src/lib/format.ts
export const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;

// ProductCard.tsx
function ProductCard() {
  const formattedPrice = formatPrice(product.price);
  return <div>{formattedPrice}</div>;
}

// Now ready for reuse in OrderSummary, Cart, etc.
```

### Example 2: Query Keys

```typescript
// ❌ OLD MINDSET - Write inline first
const { language } = useLanguage();
const queryKey = [`language:${language}`, "products", queryParams];

// Later copy-paste to other hooks → duplication

// ✅ UTILITY-FIRST MINDSET
// Ask: "Will I need language-prefixed keys elsewhere?"
// Answer: "Yes, all queries need language prefix"
// Action: Extract to useLanguage immediately

export function useLanguage() {
  const addLanguagePrefix = (...keys: unknown[]) => {
    return [`language:${language}`, ...keys];
  };
  return { language, addLanguagePrefix };
}

// Now ready for all hooks
const queryKey = addLanguagePrefix("products", queryParams);
```

### Example 3: Date Formatting

```typescript
// ❌ OLD MINDSET - Write inline
const createdDate = new Date(order.createdAt).toLocaleDateString('pt-BR');

// ✅ UTILITY-FIRST MINDSET
// Ask: "Will I format dates elsewhere?"
// Answer: "Yes, dates appear everywhere"
// Action: Extract immediately

// src/lib/format.ts
export const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

// Usage
const createdDate = formatDate(new Date(order.createdAt));
```

## Decision Tree

```
┌─────────────────────────────────┐
│ About to write logic            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Ask: "Could this be reused?"    │
└────────┬──────────────┬─────────┘
         │              │
    YES/MAYBE          NO
         │              │
         ▼              ▼
┌────────────────┐  ┌──────────────┐
│ Extract to     │  │ Write inline │
│ utility NOW    │  │ (very rare)  │
└────────────────┘  └──────────────┘
         │
         ▼
┌────────────────────────────────┐
│ ✅ Ready for immediate reuse    │
└────────────────────────────────┘
```

## Common Patterns to Extract Immediately

### 1. String Templates

```typescript
// Ask: "Will I format this message type elsewhere?"
// Always YES for error messages, labels, titles

// Extract immediately
const formatError = (resource: string) => `Erro ao carregar ${resource}`;
const formatSuccess = (action: string) => `${action} realizado com sucesso`;
```

### 2. Data Transformations

```typescript
// Ask: "Will I transform this data type elsewhere?"
// Always YES for API responses, entities

// Extract immediately
const transformProduct = (raw: ApiProduct) => ({
  id: raw.id,
  name: raw.nome,
  price: raw.preco,
});
```

### 3. Validation

```typescript
// Ask: "Will I validate this pattern elsewhere?"
// Always YES for emails, phones, CPF, etc.

// Extract immediately
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidCPF = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
```

### 4. Permissions

```typescript
// Ask: "Will I check this permission elsewhere?"
// Always YES for role checks, access control

// Extract immediately
const canUserEdit = (user: User) => user.role === 'admin' || user.role === 'manager';
const canUserDelete = (user: User) => user.role === 'admin';
```

### 5. Query Key Patterns

```typescript
// Ask: "Will I need this key pattern elsewhere?"
// Always YES for language, auth, pagination

// Extract immediately
const addLanguagePrefix = (...keys) => [`language:${language}`, ...keys];
const addAuthPrefix = (...keys) => [`user:${userId}`, ...keys];
```

## Benefits of Utility-First

### 1. Zero Refactoring Cost

```typescript
// OLD MINDSET: 3-step process
// 1. Write inline in File A
// 2. Later copy-paste to File B, C, D
// 3. Realize duplication → painful refactor

// UTILITY-FIRST: 1-step process
// 1. Extract to utility immediately
// Ready for use in Files A, B, C, D
```

### 2. Immediate Consistency

```typescript
// OLD: Inline in multiple files → inconsistencies
const price1 = `R$ ${value.toFixed(2)}`;
const price2 = `$ ${value.toFixed(2)}`;    // ❌ Different currency
const price3 = `R$ ${value.toFixed(3)}`;   // ❌ Different decimals

// UTILITY-FIRST: Single implementation → guaranteed consistency
const price1 = formatPrice(value);
const price2 = formatPrice(value);
const price3 = formatPrice(value);
```

### 3. Self-Documenting Code

```typescript
// Inline - unclear intent
const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

// Utility - clear intent
const valid = isValidEmail(input);
```

## When NOT to Extract

Very rare cases:
- Logic used ONLY once in entire app
- Component-specific render logic
- One-off calculations

**But even then:** If there's ANY chance of reuse, extract anyway.

## Habit to Build

### Before Writing Any Logic:

1. **PAUSE** ⏸️
2. **ASK** 🤔
   - "Could this be used elsewhere?"
   - "Is this a pattern or transformation?"
   - "Am I formatting, validating, or transforming?"
3. **IF YES** ✅
   - Extract to utility immediately
4. **IF NO** (rare)
   - Write inline
   - Mark for review

## Utility Locations

### Same File

```typescript
// If genuinely component-specific
function ProductCard() {
  const calculateDiscount = (price: number, percent: number) => {
    return price * (1 - percent / 100);
  };

  const discountedPrice = calculateDiscount(product.price, 10);
}
```

### Shared Hook

```typescript
// If related to hook's domain
export function useLanguage() {
  const addLanguagePrefix = (...keys) => [...];
  return { language, addLanguagePrefix };
}
```

### lib/ Directory

```typescript
// src/lib/format.ts
export const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;
export const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

// src/lib/validators.ts
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// src/lib/permissions.ts
export const canUserEdit = (user: User) => user.role === 'admin' || user.role === 'manager';
```

## Real-World Example

### Scenario: Building a product card

```typescript
// ❌ OLD MINDSET - Write everything inline
function ProductCard({ product }) {
  const formattedPrice = `R$ ${product.price.toFixed(2)}`;
  const formattedDate = new Date(product.createdAt).toLocaleDateString('pt-BR');
  const canEdit = user.role === 'admin' || user.role === 'manager';

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
      <p>{formattedDate}</p>
      {canEdit && <button>Edit</button>}
    </div>
  );
}

// Later need same logic in OrderCard, CategoryCard...
// Painful refactoring required

// ✅ UTILITY-FIRST MINDSET
// Before writing ProductCard, extract utilities

// src/lib/format.ts
export const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;
export const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

// src/lib/permissions.ts
export const canUserEdit = (user: User) => user.role === 'admin' || user.role === 'manager';

// ProductCard.tsx
import { formatPrice, formatDate } from '@/lib/format';
import { canUserEdit } from '@/lib/permissions';

function ProductCard({ product }) {
  const formattedPrice = formatPrice(product.price);
  const formattedDate = formatDate(new Date(product.createdAt));
  const canEdit = canUserEdit(user);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
      <p>{formattedDate}</p>
      {canEdit && <button>Edit</button>}
    </div>
  );
}

// Now OrderCard can reuse ALL utilities immediately
function OrderCard({ order }) {
  const formattedTotal = formatPrice(order.total);
  const formattedDate = formatDate(new Date(order.createdAt));
  const canEdit = canUserEdit(user);
  // ...
}
```

## Why

- **Prevents duplication** - Extract before duplicating
- **Saves refactoring time** - No need to refactor later
- **Enforces consistency** - One implementation from the start
- **Self-documenting** - Named utilities clarify intent
- **Reusability** - Ready for immediate reuse
- **Better design** - Forces you to think about abstractions early
