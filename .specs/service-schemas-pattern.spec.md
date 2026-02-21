# Service Schemas Pattern

ALWAYS use Zod schemas to validate input and output of service methods. Schemas for services should be co-located with the service.

## Rule

1. All services MUST be in `src/services/**/*.service.js`
2. Service-specific schemas MUST be in `src/services/**/*.schema.js` (same folder as service)
3. Shared entity schemas can be in `src/shared/schemas/` (base entities, common types)
4. Every service method must validate input and output

## Directory Structure

```
src/
├── services/
│   ├── products/
│   │   ├── products.service.js    # Service implementation
│   │   └── products.schema.js     # Service schemas (query params, responses)
│   ├── orders/
│   │   ├── orders.service.js
│   │   └── orders.schema.js
│   └── auth/
│       ├── auth.service.js
│       └── auth.schema.js
└── shared/
    └── schemas/
        ├── base-entity.schema.js   # Shared across all entities
        └── product.schema.js       # Product entity schema (if shared)
```

## Schema Definition

### Service Schemas (co-located)

```javascript
// src/services/products/products.schema.js
import { z } from "zod";
import { productSchema } from "@/shared/schemas/product.schema";

// Query params schema
export const productQueryParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().max(100).default(10),
  orderBy: z.enum(["nome", "preco", "estoque", "createdAt"]).default("nome"),
  direction: z.enum(["ASC", "DESC"]).default("ASC"),
  filters: z.object({
    search: z.string().optional(),
    categoria: z.array(z.string()).optional(),
    precoMin: z.number().optional(),
    precoMax: z.number().optional(),
  }).optional(),
});

// Paginated response schema
export const paginatedProductsSchema = z.object({
  items: z.array(productSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  size: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
```

### Entity Schemas (shared)

```javascript
// src/shared/schemas/product.schema.js
import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  estoque: z.number().int().nonnegative(),
  ativo: z.boolean(),
});

export const productFormSchema = productSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  deletedAt: true,
  deletedBy: true,
});
```

## Service Implementation

```javascript
// src/services/products/products.service.js
import {
  productQueryParamsSchema,
  paginatedProductsSchema,
} from "./products.schema";
import { productSchema, productFormSchema } from "@/shared/schemas/product.schema";

export const productsService = {
  /**
   * Lista produtos com filtros e paginação
   */
  async getAll(queryParams = {}) {
    // ✅ Validate input
    const validated = productQueryParamsSchema.parse(queryParams);

    const response = await fetch(`/api/products?${new URLSearchParams(validated)}`);
    const data = await response.json();

    // ✅ Validate output
    return paginatedProductsSchema.parse(data);
  },

  /**
   * Busca produto por ID
   */
  async getById(productId) {
    // ✅ Validate input
    const id = z.string().parse(productId);

    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();

    // ✅ Validate output
    return productSchema.parse(data);
  },

  /**
   * Cria novo produto
   */
  async create(productData) {
    // ✅ Validate input
    const validated = productFormSchema.parse(productData);

    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(validated),
    });
    const data = await response.json();

    // ✅ Validate output
    return productSchema.parse(data);
  },
};
```

## Why Co-locate Service Schemas

- **Cohesion**: Everything related to the service in one place
- **Easier to find**: Schemas next to the code that uses them
- **Isolated changes**: Service changes don't affect shared schemas
- **Clear separation**: Service I/O vs entity structure

## When to Use Shared Schemas

Use `src/shared/schemas/` for:
- ✅ Entity schemas used across multiple services
- ✅ Base schemas (baseEntitySchema)
- ✅ Common types and enums
- ✅ Form schemas used in multiple components

Use `src/services/*/` for:
- ✅ Query params schemas
- ✅ Response/request schemas specific to service endpoints
- ✅ Service-specific validation rules

## Anti-Patterns

### ❌ WRONG - Service in wrong location

```javascript
// ❌ src/shared/services/products.service.js
// ❌ src/utils/products.service.js
```

### ❌ WRONG - Schema in wrong location

```javascript
// ❌ src/shared/schemas/product-query-params.schema.js
// Service-specific schema should be with the service!
```

### ✅ CORRECT - Co-located

```
src/services/products/
├── products.service.js
└── products.schema.js    # Query params, responses, etc.
```

## Related Patterns

- API query params pattern (`api-query-params-pattern.spec.md`)
- Base entity pattern (`base-entity-pattern.spec.md`)
- Service files must be in `src/services/**/*.service.js`
