# TanStack Router 404 not found handling

Handle not found errors at router, route, and loader levels.

## Rule

- Set `defaultNotFoundComponent` on router for global 404 handling
- Use `notFoundComponent` on root route for route-level 404s
- Use `notFoundComponent` on specific routes for custom not found pages
- Throw `notFound()` in loaders when resources don't exist
- Not found components should provide navigation back to valid routes
- **CRITICAL**: `notFoundComponent` MUST be a function `() => <Component />`, NOT a component reference `Component`

## Example

```jsx
// WRONG — no not found handling
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await getPost(params.postId)
    return { post } // post might be null
  },
})

// WRONG — component reference instead of function
export const Route = createFileRoute('/dashboard')({
  component: () => <AdminPage />,
  notFoundComponent: DashboardNotFoundPage, // ❌ Will not work correctly
})

// CORRECT — global not found
const router = createRouter({
  defaultNotFoundComponent: () => (
    <div>
      <p>Not found!</p>
      <Link to="/">Go home</Link>
    </div>
  ),
})

// CORRECT — route-level not found
export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
})

// CORRECT — loader with not found
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await getPost(params.postId)
    if (!post) throw notFound()
    return { post }
  },
  notFoundComponent: () => <p>Post not found!</p>,
})
```

## Why

Proper not found handling prevents null reference errors, provides better UX, and allows graceful degradation when resources don't exist. Throwing `notFound()` in loaders catches missing data before rendering.
