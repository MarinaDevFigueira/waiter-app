## Pagination
```jsx
const pagination = usePagination({ page, size, total, totalPages, hasNextPage, hasPreviousPage, onPageChange });
<Pagination>
  <Pagination.Info startItem={pagination.startItem} endItem={pagination.endItem} total={pagination.total} />
  <Pagination.Controls {...pagination} />
</Pagination>
```
Table containers: `flex flex-col h-full` outer → `flex-1 min-h-0` inner.