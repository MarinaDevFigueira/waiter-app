---
name: spec:base-entity-pattern
description: "Base Entity Pattern"
---

# Base Entity Pattern

All domain entities must extend the base entity schema for audit trail consistency.

## Rule

Every domain entity (Product, Order, Report, User, etc.) MUST extend `baseEntitySchema` from `@/shared/schemas/base-entity.schema` to include standard audit fields.

## Required Audit Fields

The base entity provides these fields automatically:

```javascript
{
  createdAt: Date,      // When the record was created
  createdBy: string,    // Who created the record
  updatedAt: Date,      // When the record was last updated
  updatedBy: string,    // Who last updated the record
  deletedAt: Date|null, // When the record was soft-deleted (null if active)
  deletedBy: string|null // Who deleted the record (null if active)
}
```

## Implementation

### Define Entity Schema

```javascript
import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  nome: z.string().min(1, { error: "Nome é obrigatório" }),
  // ... other product-specific fields
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

### Create Mock Data

```javascript
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";

export const mockProducts = [
  {
    id: "1",
    nome: "Pizza Margherita",
    // ... product fields
    ...baseEntityDefaults,
    // Override specific audit fields if needed
    createdBy: "admin",
    updatedBy: "admin",
  },
];
```

## Form Schemas

When creating forms, omit audit fields using the pattern:

```javascript
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

## Why

- **Consistency** - All entities have the same audit trail structure
- **Traceability** - Know who created/updated/deleted every record and when
- **Soft Deletes** - Support soft deletion pattern across all entities
- **Type Safety** - Zod validates audit fields automatically
- **DRY** - Define once, reuse everywhere

## Entities That Must Use Base Entity

- ✅ Product
- ✅ Order
- ✅ Report
- ✅ User
- ✅ Category
- ✅ MenuItem
- ✅ Any other domain entity

## Anti-Pattern

```javascript
// WRONG - manually defining audit fields
export const productSchema = z.object({
  id: z.string(),
  nome: z.string(),
  createdAt: z.date(),  // ❌ Don't repeat these
  createdBy: z.string(), // ❌ Use baseEntitySchema
});

// CORRECT - extending base entity
export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  nome: z.string(),
});
```

## Notes

- Always use `baseEntitySchema.extend()` to add entity-specific fields
- For forms, create a separate schema that omits audit fields
- When displaying data, show audit fields in a consistent format (date + user)
- For soft deletes, filter by `deletedAt === null` to show only active records
