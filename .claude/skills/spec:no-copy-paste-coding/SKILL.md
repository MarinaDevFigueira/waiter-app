---
name: spec:no-copy-paste-coding
description: "No Copy-Paste Coding"
---

# No Copy-Paste Coding

Never copy and paste code. Always extract to a utility function instead.

## Rule

- **NEVER** use copy-paste (Ctrl+C → Ctrl+V) to duplicate code
- **NEVER** manually retype the same logic in multiple places
- **ALWAYS** extract repeated code to a utility function
- **ALWAYS** import and reuse existing utilities

## The Copy-Paste Trap

```
Copy-Paste = Technical Debt Creator
Extract & Reuse = Maintainable Code
```

## Examples

### ❌ WRONG - Copy-Paste Between Files

```typescript
// Step 1: Write code in useProducts.ts
const { language } = useLanguage();
const queryKey = [`language:${language}`, "products", queryParams];

// Step 2: ⚠️ Copy-paste to useCategories.ts
const { language } = useLanguage();
const queryKey = [`language:${language}`, "categories", queryParams]; // PASTED

// Step 3: ⚠️ Copy-paste to useOrders.ts
const { language } = useLanguage();
const queryKey = [`language:${language}`, "orders", queryParams]; // PASTED AGAIN
```

**Problem:** Now have 3 copies of `language:${language}` pattern. Any change requires updating 3 files.

### ✅ CORRECT - Extract & Reuse

```typescript
// Step 1: Write code in useProducts.ts
const { language } = useLanguage();
const queryKey = [`language:${language}`, "products", queryParams];

// Step 2: About to copy-paste → STOP
// Instead, extract to useLanguage.ts
export function useLanguage() {
  const addLanguagePrefix = (...keys: unknown[]) => {
    return [`language:${language}`, ...keys];
  };
  return { language, addLanguagePrefix };
}

// Step 3: Refactor useProducts.ts to use utility
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("products", queryParams);

// Step 4: Reuse in useCategories.ts
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("categories", queryParams);

// Step 5: Reuse in useOrders.ts
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("orders", queryParams);
```

**Solution:** One source of truth, reused everywhere.

## When You're Tempted to Copy-Paste

### Scenario 1: Writing Similar Code in New File

```typescript
// You're in ComponentB.tsx
// You remember ComponentA.tsx has similar code
// ⚠️ TEMPTATION: Open ComponentA, copy code, paste here

// ✅ CORRECT APPROACH:
// 1. Open ComponentA
// 2. Extract logic to shared utility
// 3. Use utility in BOTH ComponentA and ComponentB
```

### Scenario 2: Reusing String Template

```typescript
// File A has: `Erro ao carregar produtos`
// File B needs: `Erro ao carregar categorias`

// ❌ WRONG: Copy-paste and modify
const errorMessage = `Erro ao carregar categorias`; // PASTED & CHANGED

// ✅ CORRECT: Extract pattern
// src/lib/messages.ts
export const formatLoadError = (resource: string) => `Erro ao carregar ${resource}`;

// File A
const errorMessage = formatLoadError("produtos");

// File B
const errorMessage = formatLoadError("categorias");
```

### Scenario 3: Reusing Transformation

```typescript
// File A has: new Date(item.createdAt).toLocaleDateString('pt-BR')
// File B needs same transformation

// ❌ WRONG: Copy-paste
const formattedDate = new Date(item.createdAt).toLocaleDateString('pt-BR'); // PASTED

// ✅ CORRECT: Extract function
// src/lib/format.ts
export const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

// File A
const formattedDate = formatDate(new Date(item.createdAt));

// File B
const formattedDate = formatDate(new Date(item.createdAt));
```

## Copy-Paste Detection

You're about to copy-paste when:

1. **Ctrl+C followed by Ctrl+V** on code blocks
2. **Manually retyping** similar code from another file
3. **Thinking** "I did this before in FileX"
4. **Referencing** another file while writing new code

**Action:** STOP → Extract → Reuse

## The Right Workflow

```
┌──────────────────────────────┐
│ Need similar code in File B  │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│ ⚠️ STOP - Don't copy-paste    │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│ Extract to utility function  │
│ (lib/, hook, or local)       │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│ Import utility in File A     │
│ (refactor existing code)     │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│ Import utility in File B     │
│ (use instead of pasting)     │
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│ ✅ Single source of truth     │
└──────────────────────────────┘
```

## Common Copy-Paste Scenarios

### Scenario: Query Keys

```typescript
// ❌ WRONG - Copy-paste pattern
// useProducts.ts
queryKey: [`language:${language}`, "products"]

// useCategories.ts (copy-pasted)
queryKey: [`language:${language}`, "categories"]

// ✅ CORRECT - Extract & reuse
// useLanguage.ts
const addLanguagePrefix = (...keys) => [`language:${language}`, ...keys];

// useProducts.ts
queryKey: addLanguagePrefix("products")

// useCategories.ts
queryKey: addLanguagePrefix("categories")
```

### Scenario: Error Messages

```typescript
// ❌ WRONG - Copy-paste message
toast.error("Erro ao criar produto");
toast.error("Erro ao criar categoria"); // PASTED & CHANGED

// ✅ CORRECT - Extract formatter
const formatCreateError = (entity: string) => `Erro ao criar ${entity}`;
toast.error(formatCreateError("produto"));
toast.error(formatCreateError("categoria"));
```

### Scenario: Date Formatting

```typescript
// ❌ WRONG - Copy-paste transformation
const date1 = new Date(order.createdAt).toLocaleDateString('pt-BR');
const date2 = new Date(product.createdAt).toLocaleDateString('pt-BR'); // PASTED

// ✅ CORRECT - Extract formatter
const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
const date1 = formatDate(new Date(order.createdAt));
const date2 = formatDate(new Date(product.createdAt));
```

### Scenario: Validation

```typescript
// ❌ WRONG - Copy-paste validation
const isValidEmail1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email1);
const isValidEmail2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2); // PASTED

// ✅ CORRECT - Extract validator
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValid1 = isValidEmail(email1);
const isValid2 = isValidEmail(email2);
```

## Why Copy-Paste is Harmful

### 1. Maintenance Nightmare

```typescript
// Change requirement: Use USD instead of BRL
// WET (copied 5 times):
// File1.ts: `R$ ${value}` → `$ ${value}` ✏️
// File2.ts: `R$ ${value}` → `$ ${value}` ✏️
// File3.ts: `R$ ${value}` → `$ ${value}` ✏️
// File4.ts: `R$ ${value}` → Forgot to update ❌
// File5.ts: `R$ ${value}` → Forgot to update ❌

// DRY (extracted once):
// format.ts: `R$ ${value}` → `$ ${value}` ✏️
// All 5 files automatically updated ✅
```

### 2. Bug Multiplication

```typescript
// Original code has bug
const price = `R$ ${value.toFixed(3)}`; // ❌ Should be 2 decimals

// Copy-pasted to 4 files
// Now bug exists in 5 places ❌❌❌❌❌

// With extracted utility
const formatPrice = (value) => `R$ ${value.toFixed(3)}`; // ❌ Bug
// Fix once: .toFixed(3) → .toFixed(2)
// All 5 usages fixed ✅
```

### 3. Inconsistency

```typescript
// Copy-paste with modifications → inconsistency
const price1 = `R$ ${value.toFixed(2)}`;    // Correct
const price2 = `$ ${value.toFixed(2)}`;     // ❌ Different currency
const price3 = `R$ ${value.toFixed(3)}`;    // ❌ Different decimals
const price4 = `BRL ${value.toFixed(2)}`;   // ❌ Different format

// With utility → guaranteed consistency
const price1 = formatPrice(value);  // R$ X.XX
const price2 = formatPrice(value);  // R$ X.XX
const price3 = formatPrice(value);  // R$ X.XX
const price4 = formatPrice(value);  // R$ X.XX
```

## Acceptable Copy-Paste

The ONLY acceptable copy-paste is:
- **Boilerplate file templates** (creating new component from template)
- **Test setup** (describe blocks, it blocks)

**NOT acceptable:**
- Logic implementation
- String patterns
- Transformations
- Conditionals
- Calculations

## Habit to Build

When you reach for Ctrl+C:
1. **PAUSE** ⏸️
2. **Ask:** "Should this be a utility?"
3. **If YES:** Extract instead of paste
4. **If NO:** Paste, but mark for review

## Why

- **Prevents duplication** - No repeated code
- **Easier maintenance** - Change once, update everywhere
- **Reduces bugs** - Fix once, fixed everywhere
- **Enforces discipline** - Builds good coding habits
- **Saves time** - Refactoring 2 places easier than 10
