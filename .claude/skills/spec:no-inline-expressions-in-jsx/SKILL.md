---
name: spec:no-inline-expressions-in-jsx
description: "No Inline Expressions in JSX"
---

# No Inline Expressions in JSX

Never use inline expressions, array creation, or object creation directly in JSX. Always extract to named variables.

## Rule

- **NEVER** create arrays inline in JSX (`[...Array(n)]`, `[1, 2, 3]`)
- **NEVER** create objects inline in JSX (`{ key: value }`)
- **NEVER** call functions inline in JSX (except render functions like `map`)
- **NEVER** perform calculations inline in JSX (`count + 1`, `price * quantity`)
- **ALWAYS** extract to descriptive named variables or constants

## Why

- **Readability**: Named variables explain intent
- **Debuggability**: Can inspect values during debugging
- **Reusability**: Variables can be used multiple times
- **Performance**: Avoid recreating objects/arrays on each render
- **Consistency**: Clear separation between logic and presentation

## Examples

### Example 1: Array Creation

```jsx
// ❌ WRONG - inline array
<tbody>
  {[...Array(8)].map((_, i) => (
    <SkeletonRow key={i} />
  ))}
</tbody>

// ✅ CORRECT - named variable
const skeletonRows = [...Array(8)];

<tbody>
  {skeletonRows.map((_, i) => (
    <SkeletonRow key={i} />
  ))}
</tbody>

// ✅ BETTER - named constant with semantic meaning
const SKELETON_ROW_COUNT = 8;
const skeletonRows = [...Array(SKELETON_ROW_COUNT)];

<tbody>
  {skeletonRows.map((_, i) => (
    <SkeletonRow key={i} />
  ))}
</tbody>
```

### Example 2: Object Creation

```jsx
// ❌ WRONG - inline object
<UserCard user={{ name: username, role: userRole }} />

// ✅ CORRECT - named variable
const userProfile = { name: username, role: userRole };

<UserCard user={userProfile} />
```

### Example 3: Calculations

```jsx
// ❌ WRONG - inline calculation
<span>Total: {price * quantity}</span>

// ✅ CORRECT - named variable
const totalPrice = price * quantity;

<span>Total: {totalPrice}</span>
```

### Example 4: Function Calls

```jsx
// ❌ WRONG - inline function call
<div>{formatCurrency(product.price)}</div>

// ✅ CORRECT - named variable
const formattedPrice = formatCurrency(product.price);

<div>{formattedPrice}</div>
```

### Example 5: Array Literals

```jsx
// ❌ WRONG - inline array literal
<Select options={['option1', 'option2', 'option3']} />

// ✅ CORRECT - named constant
const OPTIONS = ['option1', 'option2', 'option3'];

<Select options={OPTIONS} />

// ✅ BETTER - uppercase constant at module level
const SELECT_OPTIONS = ['option1', 'option2', 'option3'];

function Component() {
  return <Select options={SELECT_OPTIONS} />;
}
```

### Example 6: String Concatenation

```jsx
// ❌ WRONG - inline concatenation
<div className={`container ${variant}`} />

// ✅ CORRECT - named variable
const containerClassName = `container ${variant}`;

<div className={containerClassName} />

// ✅ BETTER - use cn() utility
const containerClassName = cn("container", variant);

<div className={containerClassName} />
```

## Pattern for Skeleton Components

```jsx
const SKELETON_ROW_COUNT = 8;
const SKELETON_COLUMN_COUNT = 7;

export function TableSkeleton() {
  const skeletonRows = [...Array(SKELETON_ROW_COUNT)];
  const skeletonColumns = [...Array(SKELETON_COLUMN_COUNT)];

  return (
    <table>
      <thead>
        <tr>
          {skeletonColumns.map((_, i) => (
            <th key={i}>
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {skeletonRows.map((_, i) => (
          <tr key={i}>
            {skeletonColumns.map((_, j) => (
              <td key={j}>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Exceptions

**Allowed inline expressions:**
- `.map()`, `.filter()`, `.reduce()` on existing arrays
- `flexRender()` and other UI library render functions
- Simple variable references

**Everything else must be extracted to named variables.**

## Enforcement

During code review, any expression in JSX beyond simple variable references or approved render functions must be extracted to named variables.
