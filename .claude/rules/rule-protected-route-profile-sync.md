## Protected Route Profile Sync
Update BOTH when adding dashboard access to a profile:
1. `src/routes/dashboard/route.jsx` → `allowedProfiles`
2. `src/routes/index.jsx` → `hasDashboardAccess`
Mismatch = infinite redirect loop.