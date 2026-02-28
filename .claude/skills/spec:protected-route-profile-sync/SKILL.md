---
name: spec:protected-route-profile-sync
description: "Protected Route Profile Synchronization"
---

# Protected Route Profile Synchronization

When adding dashboard access for a profile, update BOTH route protection AND home redirect.

## Rule

Whenever a user profile gets access to dashboard routes:

1. **Add profile to `/dashboard/route.jsx`** allowedProfiles array
2. **Add profile to `/routes/index.jsx`** hasDashboardAccess check

Both must be synchronized to prevent redirect loops.

## Example

### Correct - Both Files Updated

**File: `src/routes/dashboard/route.jsx`**
```jsx
<ProtectedRoute
  allowedProfiles={[
    UserProfileEnum.ADMIN,
    UserProfileEnum.ATTENDANT,
    UserProfileEnum.COZINHA,  // ✅ Added here
  ]}
>
```

**File: `src/routes/index.jsx`**
```jsx
const hasDashboardAccess =
  profile === UserProfileEnum.ADMIN ||
  profile === UserProfileEnum.ATTENDANT ||
  profile === UserProfileEnum.COZINHA;  // ✅ AND here

if (hasDashboardAccess) {
  return <Navigate to="/dashboard" />;
}
```

### Wrong - Only One File Updated

```jsx
// ❌ Added to index.jsx but NOT to dashboard/route.jsx
// Result: Infinite redirect loop!

// src/routes/index.jsx
const hasDashboardAccess =
  profile === UserProfileEnum.ADMIN ||
  profile === UserProfileEnum.ATTENDANT ||
  profile === UserProfileEnum.COZINHA;  // ✅ Added

// src/routes/dashboard/route.jsx
<ProtectedRoute
  allowedProfiles={[
    UserProfileEnum.ADMIN,
    UserProfileEnum.ATTENDANT,
    // ❌ MISSING COZINHA - causes redirect loop!
  ]}
>
```

## Symptoms of Mismatched Profiles

**Console error:**
```
Throttling navigation to prevent the browser from hanging
```

**What happens:**
1. User logs in → Redirected to /dashboard (index.jsx)
2. ProtectedRoute blocks access (not in allowedProfiles)
3. Redirected back to / → Goes to /dashboard again
4. **Infinite loop** 🔄

## Checklist When Adding Dashboard Access

- [ ] Add profile to `src/routes/dashboard/route.jsx` allowedProfiles
- [ ] Add profile to `src/routes/index.jsx` hasDashboardAccess check
- [ ] Test login with that profile to verify no redirect loop
- [ ] Verify dashboard loads correctly

## Why

The home route (index.jsx) redirects users TO the dashboard, while the dashboard route (dashboard/route.jsx) controls WHO can access it. If these don't match, users get stuck in a redirect loop.

## Related Files

- `src/routes/index.jsx` - Home redirect logic
- `src/routes/dashboard/route.jsx` - Dashboard access control
- `src/shared/constants/user-profile.js` - Profile enum definitions
