# Write Operations Return Void

Write operations (create, update, delete) in services MUST return `Promise<ServiceResult<void>>` instead of returning the modified entity.

## Rule

- `create`, `update`, `updateStatus`, `delete` methods MUST return `Promise<ServiceResult<void>>`
- On success: `return { data: undefined }`
- On error: `return { error: message }`
- NEVER map or validate response body from write operations
- Callers MUST invalidate cache after a successful write to obtain fresh data

## Why

- **Cache consistency**: Returning stale data from mutation response causes cache/UI drift
- **Forced revalidation**: Invalidating queries guarantees fresh data from server
- **Reduced payload**: Server does not need to serialize and send back the full entity
- **Single responsibility**: Mutations mutate; queries query
- **Simpler service code**: No response parsing or mapping needed

## Pattern

### Service

```typescript
type ServiceResult<T> = { data: T } | { error: string };

async create(data: CreateRequest): Promise<ServiceResult<void>> {
  try {
    const validated = createRequestSchema.safeParse(data);
    const validationFailed = !validated.success;
    if (validationFailed) {
      return { error: "Dados inválidos" };
    }

    const result = await api.post<unknown>("/resource", validated.data);
    const hasError = "error" in result;
    if (hasError) {
      return { error: result.error };
    }

    return { data: undefined };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao criar recurso";
    return { error: errorMessage };
  }
}

async updateStatus(id: string, status: StatusEnum): Promise<ServiceResult<void>> {
  try {
    const validated = updateStatusSchema.safeParse({ status });
    const validationFailed = !validated.success;
    if (validationFailed) {
      return { error: "Status inválido" };
    }

    const result = await api.patch<unknown>(`/resource/${id}/status`, { status: validated.data.status });
    const hasError = "error" in result;
    if (hasError) {
      return { error: result.error };
    }

    return { data: undefined };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar status";
    return { error: errorMessage };
  }
}
```

### Hook / Consumer

```typescript
const updateStatus = useCallback(async (id: string, status: StatusEnum) => {
  const result = await service.updateStatus(id, status);
  const hasError = "error" in result;

  if (hasError) {
    toast.error(result.error);
    return;
  }

  queryClient.invalidateQueries({ queryKey: ["resource"] });
}, [queryClient]);
```

## Anti-Patterns

```typescript
// ❌ WRONG — returns entity from write operation
async create(data: CreateRequest): Promise<ServiceResult<Order>> {
  const result = await api.post<unknown>("/orders", data);
  const parsed = apiOrderSchema.safeParse(result.data);
  return { data: mapApiOrderToOrder(parsed.data) };
}

// ❌ WRONG — caller uses return data instead of invalidating
const result = await ordersService.create(data);
setOrders(prev => [...prev, result.data]);

// ✅ CORRECT — caller invalidates cache
const result = await ordersService.create(data);
const hasError = "error" in result;
if (hasError) {
  toast.error(result.error);
  return;
}
queryClient.invalidateQueries({ queryKey: ["orders"] });
```

## Scope

Applies to all service methods that mutate server state:
- `create` / `add`
- `update` / `updateStatus` / `updateName` / etc.
- `delete` / `remove`

Does NOT apply to read operations:
- `getAll` / `list`
- `getById` / `findById`
