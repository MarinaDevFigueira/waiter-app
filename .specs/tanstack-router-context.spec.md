# TanStack Router context for dependency injection

Use router context for auth, query clients, and shared dependencies.

## Rule

- Define router context interface on root route with `createRootRouteWithContext<T>()`
- Provide context when creating router instance
- Access context in route `beforeLoad` and `loader` functions via `context` parameter
- Access context in components via `Route.useRouteContext()`
- Include auth utilities, query client, and other shared dependencies in context
- Never use global singletons when context can be used instead

## Example

```jsx
// WRONG — global singletons
import { queryClient } from './global-query-client'
import { authService } from './global-auth'

// CORRECT — router context

// routes/__root.tsx
import { createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
  auth: {
    user: User | null
    isAuthenticated: boolean
    login: (credentials: Credentials) => Promise<void>
    logout: () => Promise<void>
  }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

// router.tsx
import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: createAuthContext(),
  },
})

// Using context in routes
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async ({ context }) => {
    return context.queryClient.fetchQuery({
      queryKey: ['dashboard'],
      queryFn: fetchDashboard,
    })
  },
  component: Dashboard,
})

function Dashboard() {
  const { auth } = Route.useRouteContext()
  return <h1>Welcome, {auth.user?.name}</h1>
}
```

## Why

Context provides type-safe dependency injection, makes dependencies explicit, enables testing with mock contexts, and avoids global state issues. Router context is accessible throughout the route tree without prop drilling.
