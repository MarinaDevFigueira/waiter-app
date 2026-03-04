# TanStack Router protected routes with beforeLoad

Use beforeLoad for authentication guards and route protection.

## Rule

- Never check authentication in component render (causes flash of protected content)
- Use `beforeLoad` on routes to check authentication before rendering
- Throw `redirect()` in beforeLoad to redirect unauthenticated users
- Include current location in redirect search params for post-login redirect
- Use layout routes (`_authenticated`) to protect multiple child routes at once
- Access auth context via `context` parameter in beforeLoad
- Return data from beforeLoad to pass to route context

## Example

```jsx
// WRONG — auth check in component
function ProtectedPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" /> // Flash of content before redirect
  }

  return <div>Protected content</div>
}

// CORRECT — beforeLoad auth guard (single route)
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: DashboardComponent,
})

// CORRECT — layout route for multiple protected routes
// routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.auth.getCurrentUser()

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { user } // Pass to child routes
  },
})

// routes/_authenticated/dashboard.tsx
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useRouteContext()
  return <h1>Welcome, {user.name}</h1>
}
```

## Why

beforeLoad runs before component render, preventing protected content from flashing before redirect. Layout routes allow protecting multiple routes with single auth check. Throwing redirect ensures navigation happens before any rendering.
