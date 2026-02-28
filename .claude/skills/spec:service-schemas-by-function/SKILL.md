# Service Schemas by Function

## Overview

Each service directory MUST have a `schemas/` subdirectory. Each file inside `schemas/` is named after the operation it supports and contains only the types relevant to that operation.

## Directory Structure

```
src/services/{service-name}/
├── {service-name}.service.ts
└── schemas/
    ├── get.schema.ts          # Single-entity read (GET /resource/:id or GET /resource)
    ├── get-all.schema.ts      # Paginated list read (GET /resource?page=...)
    ├── get-by-id.schema.ts    # Read by ID when separate from get-all shape
    ├── create.schema.ts       # Create input (POST /resource)
    ├── update.schema.ts       # Update input (PATCH /resource/:id)
    └── delete.schema.ts       # Delete output if non-trivial
```

## File Naming Convention

| Operation | File name |
|---|---|
| Fetch single resource | `get.schema.ts` |
| Fetch paginated list | `get-all.schema.ts` |
| Fetch by ID (different shape from list) | `get-by-id.schema.ts` |
| Create resource | `create.schema.ts` |
| Update resource | `update.schema.ts` |
| Delete resource | `delete.schema.ts` |

## What Each File Exports

Every schema file MUST export:

1. **Zod schema** — the runtime validator (prefix `api`)
2. **Inferred type** — `z.infer<typeof schema>` (prefix `Api`)
3. **Input interface** — form or query params shape (no `Api` prefix, descriptive name)

```typescript
// get-all.schema.ts
import { z } from "zod";

export const apiProductItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  active: z.boolean(),
  createdAt: z.string(),
});

export const apiPaginatedProductsSchema = z.object({
  items: z.array(apiProductItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export interface ProductQueryParams {
  page: number;
  size: number;
  filters?: {
    search?: string;
    active?: boolean;
  };
}

export type ApiProductItem = z.infer<typeof apiProductItemSchema>;
export type ApiPaginatedProducts = z.infer<typeof apiPaginatedProductsSchema>;
```

```typescript
// get-by-id.schema.ts
import { z } from "zod";

export const apiProductDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  categoryId: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ApiProductDetail = z.infer<typeof apiProductDetailSchema>;
```

```typescript
// update.schema.ts
export interface ProductUpdateForm {
  name?: string;
  description?: string | null;
  price?: number;
  active?: boolean;
}
```

## Service Import Pattern

Services MUST import from specific schema files, never from a single flat schema file:

```typescript
// products.service.ts
import {
  apiPaginatedProductsSchema,
  type ProductQueryParams,
  type ApiProductItem,
} from "./schemas/get-all.schema";
import { apiProductDetailSchema } from "./schemas/get-by-id.schema";
import type { ProductUpdateForm } from "./schemas/update.schema";
```

## Page Import Pattern

Pages and components MUST also import from specific schema files:

```typescript
// src/pages/products/page.tsx
import type { ApiProductDetail } from "@/services/products/schemas/get-by-id.schema";
import type { ApiProductItem } from "@/services/products/schemas/get-all.schema";
```

## Rules

- **NEVER** create a single `{service}.schema.ts` file with all schemas
- **NEVER** barrel-export from a `schemas/index.ts`
- **ALWAYS** place interfaces (input forms, query params) in the schema file matching the operation they serve
- **ALWAYS** use absolute path aliases (`@/services/...`) when importing across service boundaries
- **ALWAYS** use relative paths (`./schemas/...`) when importing within the same service

## Real Example: business service

```
src/services/business/
├── business.service.ts
└── schemas/
    ├── get-all.schema.ts      — apiBusinessItemSchema, apiPaginatedBusinessSchema, BusinessQueryParams
    ├── get-by-id.schema.ts    — apiBusinessDetailSchema (imports from business-settings and business-limits schemas)
    └── update.schema.ts       — BusinessUpdateForm

src/services/business-settings/
├── business-settings.service.ts
└── schemas/
    ├── get.schema.ts          — apiBusinessSettingsSchema, ApiBusinessSettings
    └── update.schema.ts       — BusinessSettingsUpdateForm

src/services/business-limits/
├── business-limits.service.ts
└── schemas/
    └── get.schema.ts          — apiBusinessLimitsSchema, ApiBusinessLimits
```
