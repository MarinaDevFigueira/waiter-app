## Schemas
- Service schemas → co-located `{entity}.schema.ts`. Shared → `src/shared/schemas/`.
- All entities extend `baseEntitySchema`. Forms: omit audit fields.
- TypeScript interfaces in services — never Zod in service layer.
- Mock data: no `null` for optional fields (omit instead).