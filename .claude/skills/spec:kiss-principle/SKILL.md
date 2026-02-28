---
name: spec:kiss-principle
description: "KISS Principle - Keep It Simple, Stupid"
---

# KISS Principle - Keep It Simple, Stupid

Write simple, straightforward code. Avoid over-engineering, premature abstraction, and unnecessary complexity.

## Rule

- **ALWAYS** choose the simplest solution that works
- **NEVER** add complexity without clear benefit
- **NEVER** abstract before you have 3+ use cases
- **NEVER** optimize prematurely
- Code should be easy to read and understand at a glance
- Prefer explicit over clever

## Why

- **Maintainability**: Simple code is easier to modify
- **Debugging**: Simple code is easier to debug
- **Onboarding**: New developers understand simple code faster
- **Reliability**: Simple code has fewer bugs
- **Performance**: Simple code is often faster

## Examples

### Example 1: Variable Assignment

```jsx
// ❌ WRONG - unnecessary complexity
const sortTitle = !canSort ? undefined
  : nextSortOrder === "asc" ? "Ordenar crescente"
  : nextSortOrder === "desc" ? "Ordenar decrescente"
  : "Remover ordenação";

// ✅ CORRECT - simple and clear
const SORT_TITLES = {
  asc: "Ordenar crescente",
  desc: "Ordenar decrescente",
  default: "Remover ordenação",
};

const defaultTitle = SORT_TITLES.default;
const sortTitle = canSort ? (SORT_TITLES[nextSortOrder] || defaultTitle) : undefined;
```

### Example 2: Conditional Rendering

```jsx
// ❌ WRONG - over-complicated
const content = useMemo(() => {
  const states = [
    { condition: isLoading, component: <LoadingState /> },
    { condition: hasError, component: <ErrorState /> },
    { condition: isEmpty, component: <EmptyState /> },
  ];

  const activeState = states.find(s => s.condition);
  const defaultContent = <DataContent />;
  return activeState?.component || defaultContent;
}, [isLoading, hasError, isEmpty]);

// ✅ CORRECT - straightforward
if (isLoading) return <LoadingState />;
if (hasError) return <ErrorState />;
if (isEmpty) return <EmptyState />;

return <DataContent />;
```

### Example 3: Data Transformation

```jsx
// ❌ WRONG - premature abstraction
const transformers = {
  currency: (v) => formatCurrency(v),
  date: (v) => formatDate(v),
  percentage: (v) => `${v}%`,
};

const applyTransformer = (value, type) => {
  const transformer = transformers[type];
  const hasTransformer = Boolean(transformer);
  return hasTransformer ? transformer(value) : value;
};

const price = applyTransformer(product.price, 'currency');

// ✅ CORRECT - direct and simple
const price = formatCurrency(product.price);
```

### Example 4: Function Composition

```jsx
// ❌ WRONG - over-engineered
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const transform = compose(trim, toLowerCase, removeSpaces);
const result = transform(input);

// ✅ CORRECT - explicit steps
const trimmed = input.trim();
const lowercase = trimmed.toLowerCase();
const result = lowercase.replace(/\s/g, '');
```

## When to Add Abstraction

Only abstract when you have:
1. **3+ identical use cases** - Rule of Three
2. **Clear, proven benefit** - Measured improvement
3. **Stable requirements** - Not changing frequently

## Simplicity Checklist

Before submitting code, ask:
- Can I remove any code without losing functionality?
- Can a junior developer understand this in 30 seconds?
- Am I solving a real problem or an imagined future problem?
- Is this the simplest solution that works?

## Principles

### Do
- Write obvious code
- Use clear variable names
- Keep functions small and focused
- Prefer duplication over wrong abstraction
- Optimize for readability

### Don't
- Use clever tricks
- Abstract prematurely
- Optimize prematurely
- Add unnecessary indirection
- Build frameworks for simple problems

## Remember

Write code for humans first, computers second.
