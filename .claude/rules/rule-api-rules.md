## API Rules
- Server-side filtering via query params. NEVER `.filter()` on client.
- Standard params: `page`, `size`, `orderBy`, `direction`, `search`.
- Response: `{ items, total, page, size, totalPages, hasNextPage, hasPreviousPage }`.
- Include query params in `queryKey`.