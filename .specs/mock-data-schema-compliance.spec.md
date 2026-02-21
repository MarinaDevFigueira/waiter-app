# Mock Data Schema Compliance

Mock data must strictly follow their corresponding Zod schema types.

## Rule

Every mock data file must:
1. Match the exact types defined in the schema
2. Include all required fields (non-optional fields)
3. Handle optional fields correctly (omit or use valid values, never `null` unless schema allows)
4. Use proper base entity fields for entities extending `baseEntitySchema`

## Schema Type Mapping

### Optional Fields
- `z.string().optional()` → omit field OR provide string value (NOT `null`)
- `z.number().optional()` → omit field OR provide number value (NOT `null`)
- `.nullable()` → allows `null` explicitly

### Required Fields
All fields without `.optional()` or `.nullable()` must be present with valid values.

### Base Entity Fields
Entities extending `baseEntitySchema` must include:
```javascript
{
  createdAt: new Date(),
  createdBy: "string",
  updatedAt: new Date(),
  updatedBy: "string",
  deletedAt: null,  // null for active records
  deletedBy: null,  // null for active records
}
```

## Examples

### Product Schema
```javascript
// Schema
export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  imagemUrl: z.string().url().optional(),
  preco: z.number().positive(),
  ativo: z.boolean(),
});
```

```javascript
// ✅ CORRECT - optional fields omitted
{
  id: "1",
  nome: "Pizza",
  preco: 35.9,
  ativo: true,
  createdAt: new Date(),
  createdBy: "admin",
  updatedAt: new Date(),
  updatedBy: "admin",
  deletedAt: null,
  deletedBy: null,
}

// ✅ CORRECT - optional fields with valid values
{
  id: "1",
  nome: "Pizza",
  descricao: "Deliciosa pizza",
  imagemUrl: "https://example.com/pizza.jpg",
  preco: 35.9,
  ativo: true,
  createdAt: new Date(),
  createdBy: "admin",
  updatedAt: new Date(),
  updatedBy: "admin",
  deletedAt: null,
  deletedBy: null,
}

// ❌ WRONG - optional fields with null
{
  id: "1",
  nome: "Pizza",
  descricao: null,  // ❌ Should omit or provide string
  imagemUrl: null,  // ❌ Should omit or provide URL
  preco: 35.9,
  ativo: true,
}

// ❌ WRONG - missing base entity fields
{
  id: "1",
  nome: "Pizza",
  preco: 35.9,
  ativo: true,
  // ❌ Missing createdAt, createdBy, updatedAt, etc.
}
```

### Order Schema
```javascript
// Schema with nested objects
export const orderItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  preco: z.number().positive(),
});

export const orderSchema = baseEntitySchema.extend({
  id: z.string(),
  items: z.array(orderItemSchema).min(1),
  status: z.enum(["pending", "preparing", "ready"]),
});
```

```javascript
// ✅ CORRECT
{
  id: "order-1",
  items: [
    { name: "Pizza", quantity: 2, preco: 35.9 },
    { name: "Coca-Cola", quantity: 1, preco: 12.5 },
  ],
  status: "pending",
  createdAt: new Date(),
  createdBy: "garcom-1",
  updatedAt: new Date(),
  updatedBy: "garcom-1",
  deletedAt: null,
  deletedBy: null,
}

// ❌ WRONG - missing required field in nested object
{
  id: "order-1",
  items: [
    { name: "Pizza", quantity: 2 },  // ❌ Missing preco
  ],
  status: "pending",
}
```

## Why

- **Type Safety** - Ensures mock data can be validated by schema
- **Consistency** - Same data structure in mocks and production
- **Early Detection** - Schema validation catches type errors in development
- **Documentation** - Mocks serve as examples of correct data structure

## Verification

Before using mock data, verify it matches the schema:
```javascript
import { productSchema } from "@/shared/schemas/product.schema";

// This should pass without errors
mockProducts.forEach(product => {
  productSchema.parse(product);
});
```
