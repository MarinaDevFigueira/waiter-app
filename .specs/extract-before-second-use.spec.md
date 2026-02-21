# Extract Before Second Use

When you find yourself writing the same logic for the second time, STOP and extract it to a utility function immediately.

## Rule

- **NEVER** copy-paste logic into a second location
- **ALWAYS** extract to a utility when writing the same code a second time
- **STOP** the moment you recognize duplication
- **REFACTOR** immediately, don't defer to "later"

## The "Second Use" Principle

```
1st use: Write inline (acceptable)
2nd use: STOP → Extract to utility → Use utility in both places
3rd+ use: Prevented by having utility from step 2
```

## Example Flow

### Step 1: First Use (Acceptable)

```typescript
// useProducts.ts (first file)
const { language } = useLanguage();
const queryKey = [`language:${language}`, "products", queryParams];
```

**Status:** ✅ OK - First occurrence, inline is acceptable.

### Step 2: Second Use (STOP HERE)

```typescript
// useCategories.ts (second file)
const { language } = useLanguage();
const queryKey = [`language:${language}`, "categories", queryParams]; // ⚠️ DUPLICATION DETECTED
```

**Status:** ⛔ STOP - This is duplication. Do NOT proceed.

**Action Required:**
1. STOP writing new code
2. Go back to `useLanguage.ts`
3. Extract the pattern to a utility function
4. Use the utility in BOTH files

### Step 3: Refactored (Correct)

```typescript
// useLanguage.ts
export function useLanguage() {
  const addLanguagePrefix = (...keys: unknown[]): unknown[] => {
    return [`language:${language}`, ...keys];
  };

  return { language, addLanguagePrefix };
}

// useProducts.ts
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("products", queryParams);

// useCategories.ts
const { addLanguagePrefix } = useLanguage();
const queryKey = addLanguagePrefix("categories", queryParams);
```

**Status:** ✅ CORRECT - Single source of truth, reusable.

## Detection Signals

Stop immediately when you:

1. **Think "I've done this before"**
   - If you remember writing similar code, extract it

2. **Copy-paste from another file**
   - The moment you paste → STOP → Extract → Use utility

3. **Write similar string templates**
   - `Erro ao ${action} ${resource}` appearing twice → Extract

4. **Repeat transformations**
   - `new Date(...).toLocaleDateString(...)` twice → Extract

5. **Duplicate conditionals**
   - `user.role === 'admin' || user.role === 'manager'` twice → Extract

## Workflow

```
┌─────────────────────────────────────┐
│ Writing code in File A              │
│ (first use - inline is OK)          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Need same logic in File B           │
│ ⚠️  DUPLICATION DETECTED             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ STOP - Do NOT write duplicated code │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Extract to utility function         │
│ (useLanguage, lib/format, etc.)     │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Use utility in BOTH File A and B    │
│ ✅ No duplication                    │
└─────────────────────────────────────┘
```

## Common Patterns That Need Extraction

### Pattern 1: Prefixed Keys

```typescript
// ❌ WRONG - Second use without extraction
queryKey: [`language:${language}`, "products"]
queryKey: [`language:${language}`, "categories"] // STOP HERE

// ✅ CORRECT - Extracted on second use
const { addLanguagePrefix } = useLanguage();
queryKey: addLanguagePrefix("products")
queryKey: addLanguagePrefix("categories")
```

### Pattern 2: String Templates

```typescript
// ❌ WRONG - Second use without extraction
const msg1 = `Erro ao carregar produtos`;
const msg2 = `Erro ao carregar categorias`; // STOP HERE

// ✅ CORRECT - Extracted on second use
const formatErrorMessage = (resource: string) => `Erro ao carregar ${resource}`;
const msg1 = formatErrorMessage("produtos");
const msg2 = formatErrorMessage("categorias");
```

### Pattern 3: Date Formatting

```typescript
// ❌ WRONG - Second use without extraction
const date1 = new Date(order.createdAt).toLocaleDateString('pt-BR');
const date2 = new Date(product.createdAt).toLocaleDateString('pt-BR'); // STOP HERE

// ✅ CORRECT - Extracted on second use
const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');
const date1 = formatDate(new Date(order.createdAt));
const date2 = formatDate(new Date(product.createdAt));
```

## Why Extract on Second Use?

**Not on first use:**
- Premature abstraction is wasteful
- Pattern may not be reused
- Over-engineering before needed

**But always on second use:**
- Pattern is now proven to be reusable
- Third use would create real duplication debt
- Refactoring 2 places is easy, refactoring 5+ places is hard

## Exceptions

The ONLY exception is:
- Code is genuinely different despite looking similar
- Different business rules
- Different contexts

**But:** If you're unsure, extract anyway. Better to have a small utility than duplicated logic.

## Why

- **Prevents technical debt** - Stops duplication before it spreads
- **Cheaper to refactor** - 2 places easier than 5+ places
- **Enforces discipline** - Builds habit of immediately extracting utilities
- **Faster iteration** - No large refactoring sessions needed later
