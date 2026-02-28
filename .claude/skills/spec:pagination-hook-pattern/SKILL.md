---
name: spec:pagination-hook-pattern
description: "Plug-and-play pagination via usePagination hook"
---

# Plug-and-play pagination via usePagination hook

Pagination state and UI are decoupled. The hook is the single source of helpers.

## Rule

- Use `usePagination` from `@/shared/hooks/usePagination` for any paginated list
- Feed it the raw pagination state from the data hook (`useProducts`, etc.)
- Use `Pagination` composite component from `@/components/ui/pagination/pagination`
- Table containers must use `flex flex-col h-full` + inner `flex-1 min-h-0`
- `Pagination.Controls` accepts spread of pagination return: `{...pagination}`

## Hook Interface

```ts
usePagination({
  page, size, total, totalPages,
  hasNextPage, hasPreviousPage,
  onPageChange: (page: number, size: number) => void,
})
// Returns: goToPage, nextPage, prevPage, setPageSize, pageRange, startItem, endItem
```

## Pattern

```tsx
const pagination = usePagination({
  page, size, total, totalPages, hasNextPage, hasPreviousPage,
  onPageChange: updatePagination,
});

<div className="flex-1 min-h-0 flex flex-col gap-3">
  <div className="flex-1 min-h-0">
    <ProductsTable ... />
  </div>
  <Pagination>
    <Pagination.Info startItem={pagination.startItem} endItem={pagination.endItem} total={pagination.total} />
    <Pagination.Controls {...pagination} />
  </Pagination>
</div>
```

## Pagination Component

`Pagination` is a composite component:
- `Pagination` — flex row container with `justify-between`
- `Pagination.Info` — "X–Y de Z" label (text-sm, muted)
- `Pagination.Controls` — prev/next + page number buttons with ellipsis

## Why

- `min-h-0` on flex children allows them to shrink below their content size (fixes overflow)
- Separating state (hook) from UI (component) allows reuse across pages
- Composite pattern keeps consumer code minimal and declarative
