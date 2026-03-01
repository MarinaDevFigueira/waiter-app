# Dev Agent Memory

## Project Setup
- Playwright is already installed with browsers (`chromium --with-deps`)
- Dev server typically runs on port 5173
- Never run `npx playwright install` - it's already set up

## Testing Workflow
- Use MCP Playwright tools (browser_navigate, browser_snapshot, browser_click, etc.)
- Dev server must be running before testing
- Check port 5173 with: `lsof -i :5173 | grep LISTEN`

## Common Patterns
- Users table follows TanStack Table pattern
- Badge components use colored backgrounds with text (e.g., `bg-purple-500/10 text-purple-600`)
- Status badges follow pattern: active/enabled = green, disabled/deleted = red
- Translation keys follow nested structure (e.g., `users.table.columns.disabled`)

## Services Layer Pattern

### Structure
Services use TypeScript interfaces (NO Zod) with co-located interface files:
```
src/services/{service-name}/
├── {service-name}.service.ts
└── interfaces/
    └── {service-name}.interface.ts
```

### Interface Naming Convention
- `GetXxxResponse` - GET response
- `GetXxxRequestQuery` - GET query params
- `CreateXxxRequestBody` - POST body
- `UpdateXxxRequestBody` - PUT/PATCH body
- `DeleteXxxResponse` - DELETE response

### Service Result Pattern
All methods return `ServiceResult<T>`:
```typescript
type ServiceResult<T> = { data: T } | { error: string };
```

## Translation Files
- Location: `src/shared/translations/{pt-BR,en-US,es}.json`
- All 3 files MUST have identical key structure
- When adding/updating keys, update ALL 3 files

## Business Pages Role Logic
- Roles requiring business selection: `ADMIN`, `SYSTEM_MANAGER`
- Other roles (OWNER, WAITER, ATTENDANT, KITCHEN, etc.) have businessId in JWT token
- Pattern:
```typescript
const rolesRequiringBusinessSelection = [UserRoleEnum.ADMIN, UserRoleEnum.SYSTEM_MANAGER];
const needsBusinessSelection = rolesRequiringBusinessSelection.includes(profile as UserRoleEnum);
const hasBusinessSelected = needsBusinessSelection ? selectedBusiness !== null : true;
```
