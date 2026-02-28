---
name: spec:no-interface-in-implementation
description: "No Interface Declarations Inside Implementation Code"
---

# No Interface Declarations Inside Implementation Code

Never declare TypeScript interfaces/types inside implementation files (.tsx/.ts). Always use dedicated interface files.

## Rule

- **NEVER** declare `interface` or `type` aliases inside `.tsx` or implementation `.ts` files
- **ALWAYS** create a sibling `*.interface.ts` file for component/page props and local types
- **ALWAYS** create enums in `src/shared/enums/*.enum.ts`
- **ALWAYS** create observable state in `src/shared/subjects/*.subject.ts`
- **ALWAYS** create hooks in `src/shared/hooks/*.ts`

## File Structure

```
src/pages/orders/kitchen-orders/
├── page.tsx                  # Implementation only — imports from page.interface.ts
└── page.interface.ts         # Props interfaces for page.tsx

src/pages/orders/kitchen-orders/components/search-bar/
├── search-bar.tsx            # Implementation only
└── search-bar.interface.ts   # SearchBarProps interface
```

## Example

```typescript
// WRONG - interface declared inside .tsx
export function KitchenOrdersPage({ canSwitchOrdersView }: { canSwitchOrdersView: boolean }) {
  // ...
}

// CORRECT - interface in dedicated file
// page.interface.ts
export interface KitchenOrdersPageProps {
  canSwitchOrdersView: boolean;
}

// page.tsx
import type { KitchenOrdersPageProps } from "./page.interface";
export function KitchenOrdersPage({ canSwitchOrdersView }: KitchenOrdersPageProps) {
  // ...
}
```

## Why

- Implementation files should only contain rendering/logic code
- Interfaces are documentation and contracts — they belong in dedicated files
- Keeps files focused and easy to navigate
