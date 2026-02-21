# Shared apiClient with automatic token refresh

HTTP client lives in `src/shared/api/api-client.ts`. All services import via `src/services/api.ts` re-export.

## Rule

- The smart HTTP client is `apiClient` from `@/shared/api/api-client`
- `src/services/api.ts` re-exports `apiClient as api` — services do NOT change imports
- Token refresh logic belongs ONLY in `api-client.ts`, NEVER in service files
- On every request, `ensureFreshToken()` runs before sending
- Token is refreshed if: expired OR expires in < 5 minutes
- Concurrent refresh calls are deduplicated via a shared `ongoingRefresh` promise
- On refresh failure → `authObservable.clearAuth()` is called (logout)
- On 401 response → retry refresh + retry original request once

## Refresh endpoint

`POST /auth/refresh` with `{ refreshToken: string }` → `{ accessToken, refreshToken }`

## JWT decode

Done natively via `atob(token.split('.')[1])` — no external library needed.

## Why

- Services stay clean — no token logic leaking into business code
- Concurrent requests during refresh are serialized via a single promise lock
- 401 fallback handles cases where the client clock doesn't match server clock
