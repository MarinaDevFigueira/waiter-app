# TanStack Router layout routes with Outlet

Layout routes must use Outlet to render child routes and handle not-found errors correctly.

## Rule

- Parent routes with children MUST use `<Outlet />` instead of hardcoded components
- Create `route.jsx` for the layout (with `<Outlet />`)
- Create `index.jsx` for the index route content
- `notFoundComponent` on layout routes renders INSIDE the layout (no layout wrappers needed)
- `notFoundComponent` MUST be a function `() => <Component />`, NOT a component reference

## Example

```jsx
// WRONG — hardcoded content in layout route
// src/routes/dashboard/route.jsx
export const Route = createFileRoute("/dashboard")({
  component: () => (
    <DashboardLayout>
      <AdminPage />  {/* ❌ Hardcoded, prevents child routes */}
    </DashboardLayout>
  ),
  notFoundComponent: DashboardNotFoundPage, // ❌ Component reference
});

// WRONG — notFoundComponent with layout wrappers
// src/pages/dashboard/not-found-page.jsx
export function DashboardNotFoundPage() {
  return (
    <ProtectedRoute>  {/* ❌ Layout already provided by parent */}
      <DashboardLayout>  {/* ❌ Duplicates layout */}
        <div>404 content</div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// CORRECT — layout route with Outlet
// src/routes/dashboard/route.jsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute allowedProfiles={[UserProfileEnum.ADMIN, UserProfileEnum.ATTENDANT]}>
      <DashboardLayout>
        <Outlet />  {/* ✅ Renders child routes */}
      </DashboardLayout>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <DashboardNotFoundPage />,  {/* ✅ Function wrapper */}
});

// CORRECT — index route for /dashboard
// src/routes/dashboard/index.jsx
export const Route = createFileRoute("/dashboard/")({
  component: () => <AdminPage />,
});

// CORRECT — notFoundComponent without layout wrappers
// src/pages/dashboard/not-found-page.jsx
export function DashboardNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {/* ✅ Just content, layout provided by parent route */}
      <h1>404</h1>
      <p>Página não encontrada</p>
    </div>
  );
}
```

## Why

- `<Outlet />` allows TanStack Router to render child routes dynamically
- Without Outlet, the parent route can't handle child route matching or not-found errors
- Layout routes provide the wrapper (ProtectedRoute, DashboardLayout), child routes provide content only
- `notFoundComponent` renders inside the layout's Outlet, so it shouldn't duplicate layout wrappers
- Function wrapper for `notFoundComponent` is required by TanStack Router API
