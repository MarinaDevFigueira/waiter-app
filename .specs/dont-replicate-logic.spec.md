# Don't Replicate Logic - Always Create Utility Functions

Never duplicate the same logic across multiple files. Always extract to a shared utility function.

## Rule

- **NEVER** copy-paste the same logic in multiple places
- **ALWAYS** create a utility function when the same logic appears 2+ times
- **ALWAYS** place utilities in the most appropriate location (same file, shared hook, or lib/)
- **NEVER** inline repeated computations, string templates, or transformations

## Examples

### ❌ WRONG - Duplicated Logic

```typescript
// useProducts.ts
const { language } = useLanguage();
queryKey: [`language:${language}`, "products", queryParams]

// useCategories.ts
const { language } = useLanguage();
queryKey: [`language:${language}`, "categories", queryParams]

// useOrders.ts
const { language } = useLanguage();
queryKey: [`language:${language}`, "orders", queryParams]
```

**Problem:** The pattern `language:${language}` is repeated in 3+ files.

### ✅ CORRECT - Utility Function

```typescript
// useLanguage.ts
export function useLanguage(): UseLanguageReturn {
  const [language, setLanguageState] = useState(languageObservable.getValue());

  const addLanguagePrefix = (...keys: unknown[]): unknown[] => {
    return [`language:${language}`, ...keys];
  };

  return {
    language,
    setLanguage: languageObservable.setLanguage,
    toggleLanguage: languageObservable.toggleLanguage,
    addLanguagePrefix, // ✅ Shared utility
  };
}

// useProducts.ts
const { addLanguagePrefix } = useLanguage();
queryKey: addLanguagePrefix("products", queryParams)

// useCategories.ts
const { addLanguagePrefix } = useLanguage();
queryKey: addLanguagePrefix("categories", queryParams)
```

**Solution:** Single source of truth, reusable across all files.

## When to Create a Utility

Create a utility function when you find yourself:
1. Copy-pasting the same code into a second file
2. Using the same string template pattern 2+ times
3. Performing the same transformation/computation in multiple places
4. Writing similar conditional logic repeatedly

## Where to Place Utilities

**Same file:**
```typescript
// If only used within one file, create helper at top
function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}

export function ProductCard() {
  const price = formatPrice(product.price);
  // ...
}
```

**Shared hook:**
```typescript
// If used across hooks that share context (e.g., language-related)
// Add to useLanguage, useAuth, etc.
export function useLanguage() {
  // ...
  const addLanguagePrefix = (...keys) => [`language:${language}`, ...keys];
  return { language, addLanguagePrefix };
}
```

**lib/ or shared/utils/:**
```typescript
// src/lib/format.ts
// If used across unrelated files or components
export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}
```

## Anti-Patterns to Avoid

### ❌ Duplicated String Templates

```typescript
// File 1
const message = `Erro ao carregar ${resource}`;

// File 2
const message = `Erro ao carregar ${resource}`;

// File 3
const message = `Erro ao carregar ${resource}`;
```

**Fix:** Create `formatErrorMessage(resource)` utility.

### ❌ Duplicated Transformations

```typescript
// File 1
const formattedDate = new Date(item.createdAt).toLocaleDateString('pt-BR');

// File 2
const formattedDate = new Date(item.createdAt).toLocaleDateString('pt-BR');
```

**Fix:** Create `formatDate(date)` utility.

### ❌ Duplicated Conditionals

```typescript
// File 1
const canEdit = user.role === 'admin' || user.role === 'manager';

// File 2
const canEdit = user.role === 'admin' || user.role === 'manager';
```

**Fix:** Create `canUserEdit(user)` utility.

## Why

- **Single source of truth** - Changes in one place update everywhere
- **Easier maintenance** - Fix bugs once, not N times
- **Better testability** - Test utility once instead of testing duplicated logic
- **Prevents drift** - No risk of logic becoming inconsistent across files
- **Self-documenting** - Named functions clarify intent better than raw code

## Detection

Ask yourself:
- "Have I written this exact code before?"
- "Would this code need to change in multiple places if requirements change?"
- "Is this logic tied to a specific concept (language, auth, formatting)?"

If yes to any → Extract to utility.
