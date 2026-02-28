---
name: spec:profile-based-routing
description: "Profile-based routing with single home route"
---

# Profile-based routing with single home route

All user profiles share the same `/` home route but render different content.

## Rule

- Home route (`/`) renders different components based on user profile
- Profile groups determine shared access to specific routes
- Use `useAuth()` hook to get current profile in components
- Protected routes check profile groups, not individual profiles
- If not authenticated, home route renders LoginPage directly

## Example

```javascript
// WRONG - separate home routes per profile
export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

export const Route = createFileRoute("/kitchen")({
  component: KitchenPage,
});

// CORRECT - single home route, content varies by profile
const HomePage = () => {
  const { auth, isAuthenticated } = useAuth();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <LoginPage />;
  }

  const profile = auth?.profile;

  const isMesaOrDelivery =
    profile === UserProfileEnum.MESA || profile === UserProfileEnum.DELIVERY;
  if (isMesaOrDelivery) {
    return <FoodsPage />;
  }

  const isAdminOrAttendant =
    profile === UserProfileEnum.ADMIN || profile === UserProfileEnum.ATTENDANT;
  if (isAdminOrAttendant) {
    return <AdminPage />;
  }

  return <KitchenPage />;
};
```

## Profile Groups

```javascript
// CORRECT - define profile groups for route access
export const ProfileGroups = {
  FOODS_ACCESS: [UserProfileEnum.MESA, UserProfileEnum.DELIVERY],
  ADMIN_ACCESS: [UserProfileEnum.ADMIN, UserProfileEnum.ATTENDANT],
  KITCHEN_ACCESS: [UserProfileEnum.COZINHA],
  FULL_ADMIN: [UserProfileEnum.ADMIN],
  LIMITED_ADMIN: [UserProfileEnum.ATTENDANT],
};

// Use in protected routes
<ProtectedRoute allowedProfiles={ProfileGroups.ADMIN_ACCESS}>
  <AdminSettingsPage />
</ProtectedRoute>
```

## Why

- Simplifies navigation - all users start at `/`
- Reduces route complexity - one home instead of many
- Easier to manage permissions - profile groups instead of individual checks
- Better UX - consistent URL structure regardless of role
