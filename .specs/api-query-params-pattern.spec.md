# API Query Params Pattern

NEVER filter data manually with `.filter()` on the client. All filtering, sorting, and pagination must be handled by the API through query string parameters.

## Rule

API endpoints must accept standardized query parameters for:
- **Pagination**: `page` (1 to infinite), `size` (number of items per page)
- **Sorting**: `orderBy` (field name), `direction` (`ASC` | `DESC`)
- **Filtering**: Specific filter fields relevant to the entity

## Standard Query Parameters

### Pagination

```javascript
{
  page: 1,        // Current page (starts at 1)
  size: 10,       // Items per page
}
```

### Sorting

```javascript
{
  orderBy: 'name',      // Field to sort by
  direction: 'ASC',     // 'ASC' or 'DESC'
}
```

### Filtering

Filter parameters are entity-specific but should follow consistent naming:

```javascript
{
  search: 'termo',           // Global search
  categoria: ['pizzas'],     // Array filters
  precoMin: 10.0,           // Range filters (min)
  precoMax: 50.0,           // Range filters (max)
  status: ['ativo'],        // Status filters
  dataInicio: '2024-01-01', // Date range (start)
  dataFim: '2024-12-31',    // Date range (end)
}
```

## Service Implementation

### ✅ CORRECT - Pass query params to API

```javascript
export const productsService = {
  async getAll(queryParams = {}) {
    const params = new URLSearchParams({
      page: queryParams.page || 1,
      size: queryParams.size || 10,
      orderBy: queryParams.orderBy || 'nome',
      direction: queryParams.direction || 'ASC',
      ...queryParams.filters,
    });

    const response = await fetch(`/api/products?${params}`);
    return response.json();
  },
};
```

### ❌ WRONG - Manual filtering on client

```javascript
// NEVER DO THIS
export function useProducts() {
  const { data } = useQuery(['products'], fetchProducts);

  // ❌ Wrong: manual filtering
  const filtered = data.filter(p => p.nome.includes(search));

  return filtered;
}
```

## Hook Implementation

Hooks should manage query params state and pass them to the service:

```javascript
export function useProducts() {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    size: 10,
    orderBy: 'nome',
    direction: 'ASC',
    filters: {},
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productsService.getAll(queryParams),
  });

  const updateFilters = (newFilters) => {
    setQueryParams(prev => ({
      ...prev,
      page: 1, // Reset to page 1 when filters change
      filters: newFilters,
    }));
  };

  return {
    products: data?.items || [],
    total: data?.total || 0,
    isLoading,
    queryParams,
    setQueryParams,
    updateFilters,
  };
}
```

## API Response Format

APIs should return paginated responses with metadata:

```javascript
{
  items: [...],           // Array of items
  total: 100,            // Total count (all pages)
  page: 1,               // Current page
  size: 10,              // Page size
  totalPages: 10,        // Total pages
  hasNextPage: true,     // Has more pages
  hasPreviousPage: false // Has previous page
}
```

## TanStack Query Integration

Use query params in the queryKey for proper caching:

```javascript
const { data } = useQuery({
  queryKey: ['products', queryParams], // Include params in key
  queryFn: () => productsService.getAll(queryParams),
  keepPreviousData: true, // Maintain previous data during refetch
});
```

## Mock Implementation (Temporary)

When mocking (before API is ready), simulate the API behavior:

```javascript
export const productsService = {
  async getAll(queryParams = {}) {
    const { page = 1, size = 10, orderBy = 'nome', direction = 'ASC', filters = {} } = queryParams;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let items = [...mockProducts];

    // Apply filters (simulating API behavior)
    if (filters.search) {
      items = items.filter(p =>
        p.nome.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    items.sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      return direction === 'ASC'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

    // Apply pagination
    const start = (page - 1) * size;
    const paginatedItems = items.slice(start, start + size);

    return {
      items: paginatedItems,
      total: items.length,
      page,
      size,
      totalPages: Math.ceil(items.length / size),
      hasNextPage: page < Math.ceil(items.length / size),
      hasPreviousPage: page > 1,
    };
  },
};
```

## Why

- **Performance**: Server-side filtering is more efficient for large datasets
- **Consistency**: Same filtering logic for all clients
- **Caching**: TanStack Query can cache different filter combinations
- **Scalability**: Client doesn't download all data
- **Backend Control**: Filtering logic centralized and optimized

## Related Patterns

- Always use schemas for service input/output (see `service-schemas-pattern.spec.md`)
- Use TanStack Query for data fetching (see `tanstack-table-pattern.spec.md`)
- Use RxJS Subject for filter state management (see `rxjs-subject-pattern.spec.md`)
