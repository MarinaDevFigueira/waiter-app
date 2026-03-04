# Always normalize pathnames to remove trailing slashes

URLs with trailing slashes should be treated the same as without for routing logic.

## Rule

- Extract pathname from `location.pathname`
- Normalize by removing trailing slash (except for root `/`)
- Use normalized pathname for all route matching, breadcrumbs, and active state checks
- Apply normalization once at the top of the component
- Use the normalized value consistently throughout

## Example

```jsx
// WRONG — comparing pathnames without normalization
const pathname = location.pathname // Could be "/dashboard/"
const isActive = pathname === "/dashboard" // False when pathname is "/dashboard/"

// WRONG — normalizing in multiple places
const isActive = pathname.replace(/\/$/, '') === item.path
const breadcrumb = pathname.replace(/\/$/, '').split('/')

// CORRECT — normalize once at the top
const pathname = location.pathname
const normalizedPathname = pathname.endsWith("/") && pathname !== "/"
  ? pathname.slice(0, -1)
  : pathname

// Use normalized value everywhere
const isActive = normalizedPathname === item.path
const breadcrumbs = useMemo(() => {
  const segments = normalizedPathname.split("/").filter(Boolean)
  // ...
}, [normalizedPathname])
```

## Why

Trailing slashes create inconsistent behavior - `/dashboard` and `/dashboard/` are the same route but won't match with strict equality. Normalizing once ensures consistent route matching, active state detection, and breadcrumb generation.
