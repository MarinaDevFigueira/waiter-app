## Protected Routes
```jsx
beforeLoad: ({ context, location }) => {
  if (!context.auth.isAuthenticated)
    throw redirect({ to: '/login', search: { redirect: location.href } });
}
```