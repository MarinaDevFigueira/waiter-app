# Always Use big.js for Mathematical Calculations

All mathematical operations involving money, quantities, or any numeric computation MUST use big.js via `src/lib/math.ts` helpers.

## Rule

- **NEVER** use native JavaScript operators (`+`, `-`, `*`, `/`) for numeric calculations
- **ALWAYS** import from `@/lib/math` (`add`, `subtract`, `multiply`, `divide`, `toFixed`, `sumProducts`)
- Applies to: prices, totals, quantities, discounts, taxes, percentages, any arithmetic

## Why

JavaScript floating-point arithmetic produces incorrect results for monetary values:
```
0.1 + 0.2 === 0.30000000000000004  // wrong
35.90 * 2 === 71.80000000000001     // wrong
```

big.js provides arbitrary-precision decimal arithmetic that produces exact results.

## Available Helpers (`src/lib/math.ts`)

| Function | Usage | Example |
|----------|-------|---------|
| `add(a, b)` | Addition | `add(0.1, 0.2) → 0.3` |
| `subtract(a, b)` | Subtraction | `subtract(10, 3.5) → 6.5` |
| `multiply(a, b)` | Multiplication | `multiply(35.90, 2) → 71.80` |
| `divide(a, b)` | Division | `divide(100, 3) → 33.333...` |
| `toFixed(value, decimals)` | Format decimals | `toFixed(35.9, 2) → "35.90"` |
| `sumProducts(items)` | Sum price*qty | `sumProducts([{price: 10, quantity: 2}]) → 20` |

## Examples

```typescript
// WRONG - native operators
const total = price * quantity;
const withTax = subtotal + tax;
const discount = total * 0.1;

// CORRECT - big.js via math helpers
import { multiply, add } from "@/lib/math";

const total = multiply(price, quantity);
const withTax = add(subtotal, tax);
const discount = multiply(total, 0.1);
```

## Scope

Applies to ALL files in the codebase:
- Services
- Hooks
- Components
- Utilities
- Schemas
- Any file performing arithmetic
