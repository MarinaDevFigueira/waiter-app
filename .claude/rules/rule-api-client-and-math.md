## API Client & Math
- Import: `@/services/api.ts` as `api`. Token refresh ONLY in `api-client.ts` (`POST /auth/refresh`).
- Auth state via RxJS. Persist in `sessionStorage`.
- ALWAYS use `src/lib/math.ts` helpers (`add`, `subtract`, `multiply`, `divide`, `toFixed`, `sumProducts`). Never native operators.