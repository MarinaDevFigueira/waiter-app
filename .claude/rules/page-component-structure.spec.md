# Page Component Structure

Pages must follow a strict directory structure with components, interfaces, and page logic separated.

## Rule

Each page feature lives in its own folder:

```
src/pages/{feature}/{view}/
├── page.tsx                          # Implementation
├── page.interface.ts                 # Props interface for page.tsx (if needed)
└── components/
    └── {component-name}/
        ├── {component-name}.tsx      # Implementation
        └── {component-name}.interface.ts  # Props interface (if needed)
```

**NEVER** create components directly inside page files. Always extract them to the `components/` subdirectory.
**NEVER** declare interfaces inside `.tsx` files — always use a sibling `.interface.ts` file.

## Structure for Orders

```
src/pages/orders/
├── page.tsx                          # Dispatcher — reads auth/view and renders correct page
├── kitchen-orders/
│   ├── page.tsx                      # Kitchen view (cards grid)
│   ├── page.interface.ts             # KitchenOrdersPageProps
│   └── components/
│       ├── order-card/
│       │   ├── order-card.tsx
│       │   └── order-card.interface.ts
│       ├── search-bar/
│       │   ├── search-bar.tsx
│       │   └── search-bar.interface.ts
│       ├── orders-grid/
│       │   ├── orders-grid.tsx
│       │   └── orders-grid.interface.ts
│       └── orders-view-toggle/
│           ├── orders-view-toggle.tsx
│           └── orders-view-toggle.interface.ts
└── admin-orders/
    ├── page.tsx                      # Admin view (table + toggle)
    ├── page.interface.ts             # AdminOrdersPageProps (if needed)
    └── components/
        └── orders-table/
            ├── orders-table.tsx
            ├── orders-table.interface.ts
            └── orders-table-skeleton.tsx
```

## Naming Convention for Multiple Views of the Same Feature

When a feature has multiple role-based views, use the pattern:

```
{feature}/page.tsx               ← dispatcher (reads auth/view observable, renders correct page)
{feature}/{role}-{feature}/page.tsx  ← role-specific page implementation
```

- `page.tsx` — only contains dispatch logic, no rendering
- Role-specific pages contain all rendering logic for that view
- The route file imports only the top-level `page.tsx`

## Why

- **Separation of concerns**: Page handles orchestration, components handle rendering
- **Interface isolation**: Contracts separated from implementation
- **Reusability**: Components can be reused across different pages
- **Testability**: Components can be tested in isolation
- **Maintainability**: Changes to component structure don't affect page logic
