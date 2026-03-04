# DRY Principle - Don't Repeat Yourself

Never repeat yourself. Every piece of knowledge must have a single, unambiguous representation in the system.

## Rule

- **NEVER** write the same code twice
- **NEVER** copy-paste logic between files
- **ALWAYS** extract repeated patterns to utilities
- **ALWAYS** reuse existing utilities instead of reimplementing

## Core Principle: DRY

**DRY = Don't Repeat Yourself**

```
Duplication = Technical Debt
Abstraction = Maintainability
```

## Examples

### ❌ WRONG - WET Code (Write Everything Twice)

```typescript
// useProducts.ts
const { language } = useLanguage();
const productKey = `language:${language}`;
const queryKey = [productKey, "products", queryParams];

// useCategories.ts
const { language } = useLanguage();
const categoryKey = `language:${language}`;
const queryKey = [categoryKey, "categories", queryParams];

// useOrders.ts
const { language } = useLanguage();
const orderKey = `language:${language}`;
const queryKey = [orderKey, "orders", queryParams];
```

**Problem:** Pattern `language:${language}` repeated 3 times. This is WET code.

### ✅ CORRECT - DRY Code

```typescript
// useLanguage.ts (DRY - Single implementation)
export function useLanguage() {
  const addLanguagePrefix = (...keys: unknown[]): unknown[] => {
    return [`language:${language}`, ...keys];
  };

  return { language, addLanguagePrefix };
}

// useProducts.ts (Reuse)
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("products", queryParams);

// useCategories.ts (Reuse)
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("categories", queryParams);

// useOrders.ts (Reuse)
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("orders", queryParams);
```

**Solution:** One implementation, multiple consumers. This is DRY.

## What Makes Code WET?

### 1. Copy-Pasted Logic

```typescript
// ❌ WET
function ComponentA() {
  const formattedPrice = `R$ ${price.toFixed(2)}`;
}

function ComponentB() {
  const formattedPrice = `R$ ${price.toFixed(2)}`; // COPY-PASTE
}

// ✅ DRY
// src/lib/format.ts
export const formatPrice = (price: number) => `R$ ${price.toFixed(2)}`;

function ComponentA() {
  const formattedPrice = formatPrice(price);
}

function ComponentB() {
  const formattedPrice = formatPrice(price);
}
```

### 2. Duplicated String Templates

```typescript
// ❌ WET
const errorMsg1 = `Erro ao carregar produtos`;
const errorMsg2 = `Erro ao carregar categorias`;
const errorMsg3 = `Erro ao carregar pedidos`;

// ✅ DRY
const formatError = (resource: string) => `Erro ao carregar ${resource}`;
const errorMsg1 = formatError("produtos");
const errorMsg2 = formatError("categorias");
const errorMsg3 = formatError("pedidos");
```

### 3. Repeated Transformations

```typescript
// ❌ WET
const date1 = new Date(order.createdAt).toLocaleDateString('pt-BR');
const date2 = new Date(product.createdAt).toLocaleDateString('pt-BR');
const date3 = new Date(user.createdAt).toLocaleDateString('pt-BR');

// ✅ DRY
const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
const date1 = formatDate(new Date(order.createdAt));
const date2 = formatDate(new Date(product.createdAt));
const date3 = formatDate(new Date(user.createdAt));
```

### 4. Duplicated Conditionals

```typescript
// ❌ WET
const canEditProduct = user.role === 'admin' || user.role === 'manager';
const canEditCategory = user.role === 'admin' || user.role === 'manager';
const canEditOrder = user.role === 'admin' || user.role === 'manager';

// ✅ DRY
const canUserEdit = (user: User) => user.role === 'admin' || user.role === 'manager';
const canEditProduct = canUserEdit(user);
const canEditCategory = canUserEdit(user);
const canEditOrder = canUserEdit(user);
```

### 5. Repeated API Patterns

```typescript
// ❌ WET
// File A
const result = await fetch(`${API_URL}/products`);
if (!result.ok) throw new Error("Failed");

// File B
const result = await fetch(`${API_URL}/categories`);
if (!result.ok) throw new Error("Failed");

// ✅ DRY
// src/lib/api.ts
export async function fetchResource(path: string) {
  const result = await fetch(`${API_URL}${path}`);
  if (!result.ok) throw new Error("Failed");
  return result.json();
}

// File A
const data = await fetchResource("/products");

// File B
const data = await fetchResource("/categories");
```

## How to Apply DRY

### Step 1: Identify Repetition

Look for:
- Same variable names
- Same string patterns
- Same calculations
- Same conditionals
- Same transformations

### Step 2: Extract to Function

```typescript
// Before
const price1 = `R$ ${product.price.toFixed(2)}`;
const price2 = `R$ ${order.total.toFixed(2)}`;

// After
const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;
const price1 = formatPrice(product.price);
const price2 = formatPrice(order.total);
```

### Step 3: Replace All Occurrences

```typescript
// Find all copies
const price = `R$ ${value.toFixed(2)}`;
const total = `R$ ${amount.toFixed(2)}`;
const cost = `R$ ${expense.toFixed(2)}`;

// Replace with utility
const price = formatPrice(value);
const total = formatPrice(amount);
const cost = formatPrice(expense);
```

## Benefits of DRY

### 1. Change Once

```typescript
// WET: Need to change 5 files
// File1: `R$ ${value.toFixed(2)}`
// File2: `R$ ${value.toFixed(2)}`
// File3: `R$ ${value.toFixed(2)}`
// File4: `R$ ${value.toFixed(2)}`
// File5: `R$ ${value.toFixed(2)}`

// DRY: Change once
// format.ts: `R$ ${value.toFixed(2)}` → `BRL ${value.toFixed(2)}`
// All 5 usages automatically updated
```

### 2. No Bugs from Drift

```typescript
// WET: Easy to have inconsistencies
const price1 = `R$ ${value.toFixed(2)}`; // Correct
const price2 = `R$ ${value.toFixed(3)}`; // Bug: 3 decimals
const price3 = `$ ${value.toFixed(2)}`;  // Bug: wrong currency

// DRY: Impossible to have inconsistencies
const price1 = formatPrice(value);
const price2 = formatPrice(value);
const price3 = formatPrice(value);
// All guaranteed to be consistent
```

### 3. Testability

```typescript
// WET: Must test same logic 5 times
describe('ComponentA price formatting', () => { ... });
describe('ComponentB price formatting', () => { ... });
describe('ComponentC price formatting', () => { ... });
// Redundant tests

// DRY: Test once
describe('formatPrice', () => {
  it('formats Brazilian currency', () => {
    expect(formatPrice(1234.5)).toBe('R$ 1234.50');
  });
});
// All components automatically tested
```

## DRY Levels

### Level 1: Extract to Local Function (Same File)

```typescript
function ProductCard() {
  const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;

  return (
    <>
      <div>{formatPrice(product.price)}</div>
      <div>{formatPrice(product.discount)}</div>
    </>
  );
}
```

**Use when:** Only used within one component.

### Level 2: Extract to Shared Hook

```typescript
export function useLanguage() {
  const addLanguagePrefix = (...keys) => [`language:${language}`, ...keys];
  return { addLanguagePrefix };
}
```

**Use when:** Used across hooks/components that share context.

### Level 3: Extract to lib/

```typescript
// src/lib/format.ts
export const formatPrice = (value: number) => `R$ ${value.toFixed(2)}`;
export const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
```

**Use when:** Generic utilities used across unrelated files.

## Warning: Don't DRY Too Early

```typescript
// ❌ WRONG - Premature abstraction
// Used only once but extracted anyway
const formatThing = (x) => doComplexStuff(x);
const result = formatThing(input);

// ✅ CORRECT - Wait for second use
const result = doComplexStuff(input);

// Later, when needed second time, THEN extract
const formatThing = (x) => doComplexStuff(x);
const result1 = formatThing(input1);
const result2 = formatThing(input2);
```

**Rule of Three:**
- 1st use: Inline
- 2nd use: Extract
- 3rd+ use: Already extracted

## Detection Questions

Ask yourself:
1. "Have I written this exact code before?"
2. "If requirements change, would I need to update multiple files?"
3. "Is this logic copy-pasted from another file?"

If **YES** → Apply DRY principle.

## Why

- **Maintainability** - One place to change
- **Consistency** - No drift between copies
- **Testability** - Test once, use everywhere
- **Readability** - Named functions clarify intent
- **Bug reduction** - Fix once, fixed everywhere
