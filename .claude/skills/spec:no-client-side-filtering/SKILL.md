---
name: spec:no-client-side-filtering
description: "No Client-Side Filtering"
---

# No Client-Side Filtering

Never filter data manually on the client. Always use API query params.

## Rule

- **NEVER** use `.filter()`, `.useMemo()` with filter logic, or any client-side data filtering
- **ALWAYS** pass search/filter params to the service, which sends them as query string params to the API
- When `searchQuery` changes, re-fetch from the API with the new `search` param

## Example

```typescript
// WRONG - filtering on the client
const filteredOrders = useMemo(() => {
  return orders.filter(order =>
    order.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [orders, searchQuery]);

// CORRECT - pass search to API
const fetchOrders = useCallback(async (search?: string) => {
  const result = await ordersService.getAll({ search });
  // ...
}, []);

useEffect(() => {
  fetchOrders(searchQuery);
}, [fetchOrders, searchQuery]);
```

## Why

Server-side filtering is more efficient, consistent, and scalable. Client should never download all data just to filter locally.
