---
name: spec:tanstack-router-navigation
description: "TanStack Router navigation patterns"
---

# TanStack Router navigation patterns

Use Link for declarative navigation and useNavigate for programmatic navigation.

## Rule

- Use `<Link>` component for user-triggered navigation (clicks)
- Use `useNavigate()` hook for programmatic navigation (side-effects, form submissions)
- Always specify `to` parameter with route path
- Use `params` for dynamic route parameters
- Use `search` for query parameters (function or object)
- Use `replace: true` to replace history entry instead of pushing
- Never use `window.location` or `history.pushState` directly

## Example

```jsx
// WRONG — manual history manipulation
<button onClick={() => window.location.href = '/dashboard'}>
  Go to Dashboard
</button>

// CORRECT — Link for user clicks
<Link to="/dashboard" search={{ tab: 'settings' }}>
  Dashboard
</Link>

// CORRECT — useNavigate for programmatic navigation
function CreatePostForm() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    const { id } = await createPost(formData)

    await navigate({
      to: '/posts/$postId',
      params: { postId: id },
      replace: true,
    })
  }
}

// CORRECT — update search params
const navigate = useNavigate()

navigate({
  search: (prev) => ({ ...prev, page: prev.page + 1 }),
})
```

## Why

Link components provide accessibility, preloading, and type safety. useNavigate ensures navigation works with TanStack Router's state management and doesn't bypass the router. Search parameter updates preserve other params when using function syntax.
