---
name: spec:error-handling-return-pattern
description: "Error Handling Return Pattern"
---

# Error Handling Return Pattern

ALL functions MUST return `{ data }` or `{ error }`. ALWAYS isolate in try-catch. NO EXCEPTIONS.

## Rule

- **ALWAYS** return `{ data: result }` on success
- **ALWAYS** return `{ error: message }` on failure
- **ALWAYS** wrap ALL operations in try-catch
- **NEVER** throw exceptions from your functions
- **NEVER** assume code won't throw - isolate everything
- **NEVER** return values directly - always wrap in `{ data }` or `{ error }`
- Apply to: ALL functions (services, utilities, helpers, hooks, formatters, everything)

## Why

- **Defensive programming**: Never trust that code won't throw
- **Type safety**: Guarantees return type structure
- **Explicit error handling**: Callers must check for errors
- **No uncaught exceptions**: Errors are values, not exceptions
- **Consistent API**: ALL functions follow same pattern
- **Easier testing**: No need to catch exceptions
- **Functional style**: Errors as data, not control flow

## Pattern

### ALL Functions Must Follow This

```javascript
function anyFunction(params) {
  try {
    const result = doOperation(params);
    return { data: result };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro genérico";
    return { error: errorMessage };
  }
}

async function anyAsyncFunction(params) {
  try {
    const result = await doAsyncOperation(params);
    return { data: result };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro genérico";
    return { error: errorMessage };
  }
}
```

## Examples

### Example 1: Simple Math Function

```javascript
// ❌ WRONG - no try-catch, no wrapper
function add(a, b) {
  return a + b;
}

// ✅ CORRECT - isolated with return wrapper
function add(a, b) {
  try {
    const result = a + b;
    return { data: result };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro ao somar valores";
    return { error: errorMessage };
  }
}
```

### Example 2: Formatter Function

```javascript
// ❌ WRONG - assumes won't throw
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// ✅ CORRECT - isolated and wrapped
function formatCurrency(value) {
  try {
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

    return { data: formatted };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro ao formatar moeda";
    return { error: errorMessage };
  }
}
```

### Example 3: Service Method

```javascript
// ❌ WRONG - no try-catch
async getById(productId) {
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    return { error: "Produto não encontrado" };
  }

  return { data: product };
}

// ✅ CORRECT - isolated in try-catch
async getById(productId) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));

    const product = mockProducts.find(p => p.id === productId);
    const productNotFound = !product;

    if (productNotFound) {
      return { error: "Produto não encontrado" };
    }

    return { data: product };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro ao buscar produto";
    return { error: errorMessage };
  }
}
```

### Example 4: Validation

```javascript
// ✅ CORRECT - validate with isolation
function validateEmail(email) {
  try {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      return { error: "Email inválido" };
    }

    return { data: email };
  } catch (error) {
    const errorMessage = error?.message ?? "Erro ao validar email";
    return { error: errorMessage };
  }
}
```

### Example 5: String Manipulation

```javascript
// ✅ CORRECT - even simple operations isolated
function uppercase(text) {
  try {
    const result = text.toUpperCase();
    return { data: result };
  } catch (error) {
    return { error: "Erro ao converter texto" };
  }
}
```

### Example 6: Array Operation

```javascript
// ✅ CORRECT - array methods isolated
function getFirst(array) {
  try {
    const isEmpty = array.length === 0;

    if (isEmpty) {
      return { error: "Array vazio" };
    }

    const first = array[0];
    return { data: first };
  } catch (error) {
    return { error: "Erro ao acessar array" };
  }
}
```

### Example 7: Date Formatting

```javascript
// ✅ CORRECT - date operations isolated
function formatDate(date) {
  try {
    const formatted = date.toLocaleDateString("pt-BR");
    return { data: formatted };
  } catch (error) {
    return { error: "Erro ao formatar data" };
  }
}
```

## Consumer Pattern

Always check for error property:

```javascript
// ✅ CORRECT - check for error
function handleOperation() {
  const result = add(5, 10);
  const hasError = Boolean(result.error);

  if (hasError) {
    console.error(result.error);
    return;
  }

  const sum = result.data;
  console.log(sum);
}
```

## Validation with Zod

ALWAYS use `safeParse`:

```javascript
// ✅ CORRECT - safeParse with isolation
function validateData(data) {
  try {
    const result = schema.safeParse(data);
    const validationFailed = !result.success;

    if (validationFailed) {
      return { error: "Dados inválidos" };
    }

    return { data: result.data };
  } catch (error) {
    return { error: "Erro inesperado na validação" };
  }
}
```

## Service Example

```javascript
// ✅ CORRECT - complete service with pattern
export const productsService = {
  async getAll(queryParams = {}) {
    try {
      const validated = productQueryParamsSchema.safeParse(queryParams);

      if (!validated.success) {
        return { error: "Parâmetros inválidos" };
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const items = applyMockFilters(mockProducts, validated.data.filters || {});
      const response = buildPaginatedResponse(items, validated.data);

      return { data: response };
    } catch (error) {
      return { error: "Erro ao buscar produtos" };
    }
  },

  async getById(productId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const product = mockProducts.find(p => p.id === productId);
      const productNotFound = !product;

      if (productNotFound) {
        return { error: "Produto não encontrado" };
      }

      return { data: product };
    } catch (error) {
      return { error: "Erro ao buscar produto" };
    }
  },

  async create(productData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const parseResult = productFormSchema.safeParse(productData);
      const validationFailed = !parseResult.success;

      if (validationFailed) {
        return { error: "Dados inválidos" };
      }

      const newProduct = {
        id: String(Date.now()),
        ...parseResult.data,
        createdAt: new Date(),
        createdBy: "system",
        updatedAt: new Date(),
        updatedBy: "system",
      };

      return { data: newProduct };
    } catch (error) {
      return { error: "Erro ao criar produto" };
    }
  },
};
```

## Why No Exceptions

Every operation can throw:
- **Array methods** can throw on edge cases
- **Object access** can throw on getters/proxies
- **String operations** can throw on invalid unicode
- **Number operations** can throw (NaN, Infinity edge cases)
- **Date operations** can throw
- **Formatters** (Intl) can throw on invalid locales
- **JSON operations** always can throw
- **External libs** can throw anytime
- **Future refactoring** might introduce throws

**Principle**: Isolate everything. Guarantee type structure always.

## Migration Checklist

1. ✅ Wrap entire function body in try-catch
2. ✅ Return `{ data: result }` for success
3. ✅ Return `{ error: message }` in catch
4. ✅ Return `{ error: message }` for validation failures
5. ✅ Use `safeParse` instead of `parse` for Zod
6. ✅ Update all callers to check for `error` property
7. ✅ Apply to EVERY function (no exceptions)

## Scope

This pattern applies to:
- ✅ Services (`src/services/**/*.service.js`)
- ✅ Utilities (`src/shared/utils/**/*.js`)
- ✅ Helpers (`src/lib/**/*.js`)
- ✅ Custom hooks (`src/shared/hooks/**/*.js`)
- ✅ Formatters
- ✅ Validators
- ✅ Mappers
- ✅ Transformers
- ✅ ANY function

## NO EXCEPTIONS

There are NO exceptions to this rule. ALL functions must follow this pattern:

```javascript
function anyFunction(params) {
  try {
    // your logic here
    return { data: result };
  } catch (error) {
    return { error: "Error message" };
  }
}
```

This guarantees type safety and prevents uncaught exceptions across the entire codebase.
