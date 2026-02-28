---
name: spec:table-loading-skeleton
description: "Table Loading Skeleton Pattern"
---

# Table Loading Skeleton Pattern

Always create dedicated skeleton components for table loading states. Never show loading text inside table rows.

## Rule

- **ALWAYS** create separate `*TableSkeleton` component for loading state
- **NEVER** render loading message inside table tbody
- **ALWAYS** match skeleton structure to actual table layout
- **ALWAYS** use `animate-pulse` for skeleton animation
- Skeleton should visually match the table it represents

## Why

- Better user experience - visual feedback that matches final layout
- Prevents layout shift when data loads
- Professional appearance
- Consistent loading pattern across all tables

## Pattern

### Create Skeleton Component

```jsx
export function ProductsTableSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Use in Parent Component

```jsx
function ProductsPage() {
  const { products, isLoading } = useProducts();

  const isLoadingData = isLoading;
  const hasNoProducts = products.length === 0;

  if (isLoadingData) {
    return <ProductsTableSkeleton />;
  }

  if (hasNoProducts) {
    return <EmptyProductsState />;
  }

  return <ProductsTable products={products} />;
}
```

## File Structure

Co-locate skeleton with table component:

```
src/pages/products/components/
├── products-table.jsx
└── products-table-skeleton.jsx
```

Or export from same file:

```jsx
// products-table.jsx
export function ProductsTable({ products }) {
  // table implementation
}

export function ProductsTableSkeleton() {
  // skeleton implementation
}
```

## Skeleton Details

### Match Table Structure
- Same border radius and borders
- Same padding values
- Same number of columns
- Similar row heights

### Skeleton Rows
- Show 5-10 skeleton rows (typical viewport)
- Use `[...Array(5)].map((_, i) => ...)` pattern
- Each row should have unique key

### Animation
- Always use `animate-pulse` utility
- Apply to individual skeleton elements, not wrapper
- Keep animation subtle

### Dimensions
- Header cells: `h-4` height, vary widths
- Body cells: `h-4` height, vary widths
- Rounded corners: `rounded` or `rounded-md`
- Use `bg-muted` for skeleton color

## Anti-Patterns

```jsx
// ❌ WRONG - loading text in table
function ProductsTable({ products, isLoading }) {
  if (isLoading) {
    return (
      <table>
        <tbody>
          <tr>
            <td colSpan={7}>Carregando...</td>
          </tr>
        </tbody>
      </table>
    );
  }
  // ...
}

// ❌ WRONG - generic spinner
if (isLoading) {
  return <Spinner />;
}

// ❌ WRONG - skeleton inside table component
function ProductsTable({ products, isLoading }) {
  const tableBody = useMemo(() => {
    if (isLoading) return <SkeletonRows />;
    return <DataRows />;
  }, [isLoading]);
  // ...
}
```

## Correct Pattern

```jsx
// ✅ CORRECT - dedicated skeleton component
export function ProductsTableSkeleton() {
  return <table>...</table>;
}

// ✅ CORRECT - table only renders data
export function ProductsTable({ products }) {
  return <table>...</table>;
}

// ✅ CORRECT - parent handles loading
function ProductsPage() {
  const isLoadingData = isLoading;

  if (isLoadingData) return <ProductsTableSkeleton />;

  return <ProductsTable products={products} />;
}
```
