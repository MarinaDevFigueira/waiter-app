---
name: spec:tanstack-router-file-based-routing
description: "TanStack Router file-based routing conventions"
---

# TanStack Router file-based routing conventions

Follow TanStack Router conventions for file-based routing structure and naming.

## Rule

- All routes must be in `src/routes/` directory
- Use `createFileRoute()` for regular routes, `createRootRoute()` for `__root.tsx`
- Root route file: `src/routes/__root.tsx` (double underscore prefix)
- Index routes: use `.index.tsx` suffix (e.g., `dashboard.index.tsx`)
- Dynamic segments: use `$` prefix (e.g., `$postId.tsx` for `:postId` param)
- Layout routes: use `_` prefix (e.g., `_authenticated.tsx`)
- Export route as `Route` constant from each file
- Route path is automatically managed by TanStack Router plugin

## Example

```jsx
// WRONG — manual route configuration
const routes = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: DashboardPage }
]

// CORRECT — file structure
src/routes/
  __root.tsx          // Root layout
  index.tsx           // Home page (/)
  dashboard.tsx       // /dashboard
  dashboard.index.tsx // /dashboard (index)
  $userId.tsx         // /:userId (dynamic)
  _authenticated/     // Layout route
    profile.tsx       // /_authenticated/profile

// CORRECT — route file
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})
```

## Why

File-based routing provides automatic route generation, type safety, and explicit file-to-route mapping. The naming conventions enable dynamic segments, layouts, and nested routes without manual configuration.
