# TanStack Table Row Rendering Pattern

Never manually iterate over table.getRowModel().rows. Let the table handle its own rendering through proper separation of concerns.

## Rule

- **NEVER** manually map over `table.getRowModel().rows`
- **NEVER** check `table.getRowModel().rows.length` for empty state
- **ALWAYS** check source data length in parent component
- **ALWAYS** handle loading/empty states BEFORE rendering table
- Table component assumes it has data and renders it

## Why

- Separation of concerns - parent handles states, table renders data
- Single source of truth - check original data, not table internals
- Cleaner code - table doesn't need conditional logic
- Easier testing - table component has single responsibility

## Pattern

### Parent Component - Handle States

```jsx
function ProductsPage() {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  if (products.length === 0) {
    return <EmptyProductsState />;
  }

  return <ProductsTable products={products} />;
}
```

### Table Component - Render Data

```jsx
function ProductsTable({ products }) {
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Anti-Pattern

```jsx
// ❌ WRONG - checking table rows and conditional rendering inside table
function ProductsTable({ products, isLoading }) {
  const table = useReactTable({ data: products, columns });

  const tableBody = useMemo(() => {
    if (isLoading) {
      return <tr><td>Loading...</td></tr>;
    }

    if (table.getRowModel().rows.length === 0) {
      return <tr><td>No data</td></tr>;
    }

    return table.getRowModel().rows.map(row => (
      <tr key={row.id}>...</tr>
    ));
  }, [isLoading, table]);

  return <tbody>{tableBody}</tbody>;
}
```

## Loading States

Create separate skeleton components:

```jsx
function ProductsTableSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="animate-pulse">
        <div className="h-12 bg-muted" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-t bg-card" />
        ))}
      </div>
    </div>
  );
}
```

Use in parent:

```jsx
if (isLoading) return <ProductsTableSkeleton />;
if (products.length === 0) return <EmptyState />;
return <ProductsTable products={products} />;
```
