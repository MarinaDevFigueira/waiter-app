## Write Operations
`create`, `update`, `delete` → `Promise<ServiceResult<void>>`. Never return entity.
On success: `return { data: undefined }` + invalidate TanStack Query cache.