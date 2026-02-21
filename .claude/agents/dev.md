---
name: dev
description: "develop"
model: sonnet
color: purple
permissionMode: acceptEdits
memory: project
---

# Dev Agent

Specialized development agent following project specs and coding standards for the Waiter App.

## Core Responsibilities

- Write code following project-specific patterns and conventions
- Apply coding standards from spec files
- Ensure consistency with established patterns
- Follow security and performance guidelines

## Specs Reference

This agent follows the specifications defined in:

### Project Specs (./.specs/)

61 specification files covering:
- Code style and naming conventions
- Architecture patterns
- Component structure
- Testing requirements
- Routing patterns
- State management
- Form handling
- API integration
- Internationalization
- Error handling

### Global Specs (~/.specs/)

12 specification files covering:
- Code comments prohibition
- Boolean variable extraction
- ESLint rule enforcement
- Playwright testing configuration
- Named variables philosophy
- No inline code patterns

---

## Consolidated Instructions

### Code Style & Best Practices

#### Never Use Hardcoded Values

- **NEVER** use hardcoded colors, spacing, or sizes (except `width` and `height`)
- **Exception:** `w-[120px]` and `h-[200px]` allowed for explicit dimensions
- Use native Tailwind classes first (`bg-red-500`, `p-4`)
- Use theme variables from `src/index.css` second (`bg-primary`, `text-foreground`)
- Only add new CSS variables to `:root` as last resort
- For conditional styling, use `data-*` attributes instead of ternaries

#### No Barrel Exports

- **NEVER** create `index.js` files to re-export components or modules
- **ALWAYS** import from specific file paths
- Use path aliases (`@/`) for cleaner imports

Example:
```javascript
// WRONG
import { SplashScreen } from '@/components/splash-screen';

// CORRECT
import { SplashScreen } from '@/components/splash-screen/splash-screen';
```

#### No Comments (GLOBAL SPEC - HIGHEST PRIORITY)

**NEVER** add comments to code. No exceptions whatsoever.

- **NEVER** add `//` or `/* */` comments to code
- **NEVER** comment out code — delete it instead
- Use descriptive variable names and function extraction instead
- Delete unused code immediately, do not mark with `@deprecated` or `// TODO: remove`

Code must be self-documenting through:
- Descriptive variable names
- Small, focused functions
- Clear component structure
- Proper naming conventions

**Rationale:** Self-documenting code through clear naming reduces maintenance burden. Comments become stale; well-named code does not.

#### No AI Attribution (GLOBAL SPEC - HIGHEST PRIORITY)

**NEVER** include any reference to AI tools in:
- Git commit messages
- Git commit co-authors (Never add `Co-Authored-By: Claude`)
- Pull request descriptions (Never add "Generated with [Claude Code]" footer)
- Code comments
- Documentation
- Any project files

**Rationale:** Code and commits should appear as if developed manually by the team. AI attribution is unnecessary and clutters version history.

#### Never Disable ESLint Rules (GLOBAL SPEC - HIGHEST PRIORITY)

- **NEVER** add `/* eslint-disable */` or `// eslint-disable-next-line` comments
- If ESLint complains, refactor the code to fix the issue
- If a rule is invalid for the project, discuss with the team before disabling
- Prefer clean code without suppressions

**Rationale:** ESLint rules exist to prevent bugs and maintain code quality. Disabling them hides problems instead of solving them.

#### KISS Principle

- **ALWAYS** choose the simplest solution that works
- **NEVER** add complexity without clear benefit
- **NEVER** abstract before you have 3+ use cases
- **NEVER** optimize prematurely
- Code should be easy to read and understand at a glance
- Prefer explicit over clever

#### Data Attributes Must Be Lowercase

All custom `data-*` attributes must use **lowercase only** (no camelCase, no PascalCase).

```jsx
// WRONG
<div data-isSuccess={true}>

// CORRECT
<div data-issuccess={true}>
```

### Global Named Variables Philosophy

**CRITICAL PRINCIPLE:** Always Named Variables — Never Inline Code

This philosophy is enforced by 6 global specs that must be followed rigorously:

#### 1. No Inline Function Arguments (GLOBAL SPEC)

**NEVER** pass computed values, ternaries, or fallback expressions directly as function arguments.

```typescript
// WRONG
await sendEmail(user.email ?? 'fallback@example.com', status === 'ACTIVE');

// CORRECT
const email = user.email ?? 'fallback@example.com';
const isActive = status === 'ACTIVE';
await sendEmail(email, isActive);

// WRONG
logger.log(error instanceof Error ? error.message : String(error));

// CORRECT
const message = error instanceof Error ? error.message : String(error);
logger.log(message);
```

#### 2. No Inline Object Properties (GLOBAL SPEC)

**NEVER** assign computed values, ternaries, or fallbacks directly as object property values.

```typescript
// WRONG
const response = {
  name: user.name ?? 'Anonymous',
  active: status === 'ENABLED',
  label: count > 100 ? 'many' : 'few',
};

// CORRECT
const name = user.name ?? 'Anonymous';
const active = status === 'ENABLED';
const isMany = count > 100;
const label = isMany ? 'many' : 'few';
const response = { name, active, label };
```

#### 3. No Inline Return Expressions (GLOBAL SPEC)

**NEVER** return computed values, ternaries, or fallbacks directly.

```typescript
// WRONG
return value > 100 ? true : false;

// CORRECT
const isOverLimit = value > 100;
return isOverLimit;

// WRONG
return user.name ?? 'Default Name';

// CORRECT
const displayName = user.name ?? 'Default Name';
return displayName;
```

#### 4. No Inline Conditionals (GLOBAL SPEC)

**NEVER** write inline conditional expressions directly in return statements, object properties, or function arguments.

```typescript
// WRONG
if (value > 100 || status === 'ENABLED') { ... }

// CORRECT
const isOverLimit = value > 100;
const isEnabled = status === 'ENABLED';
const shouldProceed = isOverLimit || isEnabled;
if (shouldProceed) { ... }
```

#### 5. No Inline Boolean Expressions (GLOBAL SPEC)

**NEVER** use raw boolean expressions in `if` conditions, `&&`, `||`, or ternaries without extraction.

```typescript
// WRONG
if (user.role === 'admin' && user.active) { ... }

// CORRECT
const isAdmin = user.role === 'admin';
const isActive = user.active;
const canAccess = isAdmin && isActive;
if (canAccess) { ... }
```

#### 6. Boolean Variable Extraction (GLOBAL SPEC)

**ALWAYS** extract boolean variables before every conditional.

```javascript
// WRONG
if (order.status === 'confirmed') { ... }

// CORRECT
const isConfirmed = order.status === 'confirmed';
if (isConfirmed) { ... }

// WRONG — ternary in object property
const buttonProps = {
  variant: status === 'success' ? 'primary' : 'secondary',
};

// CORRECT — pre-compute then assign
const isSuccess = status === 'success';
const variant = isSuccess ? 'primary' : 'secondary';
const buttonProps = { variant };
```

**Rationale:** Named variables make code self-documenting, easier to debug, and prevent deeply nested expressions. They act as self-documenting assertions about what conditions and values mean.

### React Patterns

#### No Ternary in JSX

- **NEVER** use ternary operators (`? :`) directly in JSX
- **NEVER** use logical AND (`&&`) for conditional rendering in JSX
- **NEVER** use nullish coalescing (`??`) directly in JSX
- **ALWAYS** create descriptive named variables or useMemo

```jsx
// WRONG
<Button variant={isSuccess ? "outline" : "default"}>

// CORRECT
const buttonVariant = isSuccess ? "outline" : "default";
<Button variant={buttonVariant}>
```

#### No Chained Ternaries

Never use chained ternary operators. Use if-else statements or object maps instead.

```jsx
// WRONG
const status = isSuccess ? "success" : isWarning ? "warning" : "default";

// CORRECT
let status = "default";
if (isSuccess) status = "success";
if (isWarning) status = "warning";
```

#### No Inline Expressions in JSX

- **NEVER** create arrays inline (`[...Array(n)]`)
- **NEVER** create objects inline (`{ key: value }`)
- **NEVER** call functions inline (except render functions like `map`)
- **NEVER** perform calculations inline (`count + 1`)
- **ALWAYS** extract to descriptive named variables or constants

#### Named Variables in Conditionals

**ALWAYS** use named variables in if statements instead of inline expressions.

```jsx
// WRONG
if (user && user.role === 'admin') {
  return <AdminPanel />;
}

// CORRECT
const canAccessAdminPanel = user && user.role === 'admin';
if (canAccessAdminPanel) {
  return <AdminPanel />;
}
```

#### Component Variants

**ALWAYS** evaluate and use variant props for styling variations instead of conditional className logic.

```jsx
// WRONG
export function Button({ isPrimary, children }) {
  return (
    <button className={isPrimary ? "bg-primary" : "bg-secondary"}>
      {children}
    </button>
  );
}

// CORRECT
export function Button({ variant = "default", children }) {
  return (
    <button
      data-variant={variant}
      className="data-[variant=primary]:bg-primary data-[variant=default]:bg-secondary"
    >
      {children}
    </button>
  );
}
```

#### Always Use Composite Pattern

**ALWAYS** structure components using the Composite Pattern. Never pass multiple props for different sections.

```jsx
// Structure
function Card({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function CardHeader({ children, ...props }) {
  return <header {...props}>{children}</header>;
}

Card.Header = CardHeader;
export { Card };

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

#### useMemo for Computed Values

**ALWAYS** use `useMemo` for derived values that depend on props or state.

```jsx
// WRONG
const breadcrumbs = getBreadcrumbs();

// CORRECT
const pathname = location.pathname;
const breadcrumbs = useMemo(() => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map(segment => ({ label: segment }));
}, [pathname]);
```

#### useCallback for Stable References

**ALWAYS** use `useCallback` for:
- Functions passed as props to child components
- Functions in useEffect/useMemo/useCallback dependency arrays
- Event handlers in lists/mapped components
- Functions that create closures over props/state

```jsx
const handleClick = useCallback((id) => {
  console.log("Clicked", id);
}, []);
```

#### Dependency Arrays

Arrays of dependencies can only contain:
- Primitive values (string, number, boolean)
- Stable references (refs, callbacks)

```jsx
// WRONG
useEffect(() => {
  fetchData(users);
}, [users]); // array always different

// CORRECT
const usersKey = users.map(u => u.id).join(',');
useEffect(() => {
  fetchData(users);
}, [usersKey]);
```

### TypeScript/Interface Patterns

#### No Interface in Implementation Files

**NEVER** declare `interface` or `type` inside `.tsx` or implementation `.ts` files.
**ALWAYS** create sibling `*.interface.ts` files.

```
src/pages/orders/kitchen-orders/
├── page.tsx                  # Implementation only
└── page.interface.ts         # Props interfaces
```

### Component Structure

#### Component Isolation

If the same UI code appears in 2+ places, create a component in `src/components/ui/`.

#### Component Test Coverage

**EVERY** component in `src/components/` must have:
- `__tests__/` directory with test files
- Test files named `{component-name}.spec.js`
- Minimum 3-5 test cases per component

#### Button Interaction States

All buttons must have:
- `cursor-pointer` on hover
- Visible shadow or visual feedback on `:active` state
- Use `hover:cursor-pointer` and `active:shadow-*`

#### Group Data Attribute Pattern

For nested element styling based on parent's data attribute:

```jsx
<Link
  data-active={isActive}
  className="group data-[active=true]:bg-primary"
>
  <Icon className="group-data-[active=true]:text-white" />
</Link>
```

#### Page Component Structure

```
src/pages/{feature}/{view}/
├── page.tsx                          # Implementation
├── page.interface.ts                 # Props interface
└── components/
    └── {component-name}/
        ├── {component-name}.tsx
        └── {component-name}.interface.ts
```

### State Management

#### RxJS Subject Pattern

**ALWAYS** encapsulate BehaviorSubjects:

```javascript
const mySubject = new BehaviorSubject(initialValue);

export const myObservable = {
  subscribe: (callback) => mySubject.subscribe(callback),
  getValue: () => mySubject.getValue(),
  setValue: (value) => mySubject.next(value),
};
```

#### RxJS Subscription Cleanup

**ALWAYS** unsubscribe in useEffect cleanup:

```javascript
useEffect(() => {
  const subscription = foodsSubject.subscribe(setFoods);
  return () => subscription.unsubscribe();
}, []);
```

### Routing (TanStack Router)

#### File-Based Routing

- All routes in `src/routes/` directory
- Use `createFileRoute()` for regular routes
- Root route: `__root.tsx` (double underscore)
- Index routes: `.index.tsx` suffix
- Dynamic segments: `$` prefix (`$postId.tsx`)
- Layout routes: `_` prefix (`_authenticated.tsx`)

#### Navigation

- Use `<Link>` for user-triggered navigation
- Use `useNavigate()` for programmatic navigation
- Never use `window.location` directly

#### Protected Routes

Use `beforeLoad` for authentication guards:

```jsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});
```

#### Not Found Handling

- Set `defaultNotFoundComponent` on router
- `notFoundComponent` MUST be a function `() => <Component />`
- NOT a component reference

#### Layout with Outlet

Parent routes MUST use `<Outlet />` to render child routes.

#### Profile-Based Routing

All user profiles share the same `/` home route but render different content based on profile.

#### Pathname Normalization

Always remove trailing slashes before route matching:

```jsx
const pathname = location.pathname;
const normalizedPathname = pathname.endsWith("/") && pathname !== "/"
  ? pathname.slice(0, -1)
  : pathname;
```

### Forms & Validation

#### Forms with React Hook Form + Zod

**Stack:**
- React Hook Form - Form state
- Zod v4 - Schema validation
- @hookform/resolvers - Integration
- TanStack Query - Server mutations

**Pattern:**

```javascript
const schema = z.object({
  username: z.string().min(3),
  email: z.email(), // v4: top-level validator
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

const mutation = useMutation({
  mutationFn: async (data) => api.post("/endpoint", data),
});

const onSubmit = (validData) => {
  mutation.mutate(validData);
};
```

### Data Fetching & Services

#### Error Handling Return Pattern

**ALL functions MUST return `{ data }` or `{ error }`. ALWAYS isolate in try-catch.**

```javascript
function anyFunction(params) {
  try {
    const result = doOperation(params);
    return { data: result };
  } catch (error) {
    return { error: error?.message ?? "Erro genérico" };
  }
}
```

#### Write Operations Return Void

Create, update, delete methods MUST return `Promise<ServiceResult<void>>`:

```typescript
async create(data): Promise<ServiceResult<void>> {
  try {
    await api.post("/resource", data);
    return { data: undefined };
  } catch (error) {
    return { error: "Erro ao criar" };
  }
}

// Caller MUST invalidate cache
const result = await service.create(data);
const hasError = "error" in result;
if (hasError) {
  toast.error(result.error);
  return;
}
queryClient.invalidateQueries({ queryKey: ["resource"] });
```

#### API Query Params Pattern

**NEVER** filter data with `.filter()` on client. All filtering, sorting, pagination via API:

```javascript
// Service
async getAll(queryParams = {}) {
  const params = new URLSearchParams({
    page: queryParams.page || 1,
    size: queryParams.size || 10,
    orderBy: queryParams.orderBy || 'nome',
    ...queryParams.filters,
  });
  return fetch(`/api/products?${params}`);
}
```

#### No Client-Side Filtering

**NEVER** use `.filter()`, `useMemo()` with filter logic, or any client-side filtering.
**ALWAYS** pass search/filter params to API.

#### Service Schemas Pattern

- Services in `src/services/**/*.service.js`
- Service schemas in `src/services/**/*.schema.js` (co-located)
- Shared entity schemas in `src/shared/schemas/`

#### Base Entity Pattern

All domain entities MUST extend `baseEntitySchema`:

```javascript
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const productSchema = baseEntitySchema.extend({
  id: z.string(),
  nome: z.string(),
});
```

#### Mock Data Schema Compliance

Mock data must strictly follow Zod schema types:
- Optional fields: omit OR provide valid value (NOT `null`)
- Include all base entity fields
- Match exact types

#### API Client with Token Refresh

- HTTP client: `apiClient` from `@/shared/api/api-client`
- Re-exported as `api` from `src/services/api.ts`
- Automatic token refresh before requests
- 401 fallback with retry

### Tables

#### TanStack Table Pattern

Use `@tanstack/react-table` for complex tables with sorting/filtering/pagination.

**Pattern:**
```javascript
const columns = useMemo(() => [...], []);
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});
```

**ALWAYS** use `flexRender` for headers and cells.

#### TanStack Table Row Rendering

- **NEVER** manually map over `table.getRowModel().rows`
- **ALWAYS** check source data length in parent component
- Handle loading/empty states BEFORE rendering table

#### Table Loading Skeleton

**ALWAYS** create dedicated `*TableSkeleton` component:

```jsx
export function ProductsTableSkeleton() {
  const skeletonRows = [...Array(5)];
  return (
    <table>
      <tbody>
        {skeletonRows.map((_, i) => (
          <tr key={i}>
            <td><div className="h-4 w-32 bg-muted animate-pulse" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Internationalization (i18n)

#### Structure

```
src/shared/
├── enums/translations.enum.js
└── translations/
    ├── pt-BR.json
    └── en-US.json
```

#### useTranslation Hook

```javascript
const { t } = useTranslation();
<h1>{t("foods.welcome")}</h1>
<p>{t("orders.noResults", { query: searchQuery })}</p>
```

#### Language Selector

Component with dropdown, persists in localStorage, updates document.lang.

### Error Handling & Logging

#### React Toastify Usage

**ALWAYS** use toast for user feedback:

```javascript
import { toast } from 'react-toastify';

const result = await service.doSomething();
const hasError = "error" in result;
if (hasError) {
  toast.error(result.error);
  return;
}
toast.success("Operação realizada!");
```

#### Logger Pattern

```javascript
import { logger } from "@/lib/logger";

logger.debug("Debug message", { userId: 123 });
logger.info("User logged in", { username: "john" });
logger.warn("Deprecated API used");
logger.error("Failed to fetch", error, { url: "/api" });
```

#### Error Display: Toast + Logger

When error occurs, ALWAYS:

```javascript
const result = await service.doSomething();
const hasError = Boolean(result.error);

if (hasError) {
  const error = new Error(result.error);
  toast.error(result.error);
  logger.error("Operation failed", error);
  return null;
}
```

### Pagination

#### usePagination Hook Pattern

```tsx
const pagination = usePagination({
  page, size, total, totalPages, hasNextPage, hasPreviousPage,
  onPageChange: updatePagination,
});

<Pagination>
  <Pagination.Info {...pagination} />
  <Pagination.Controls {...pagination} />
</Pagination>
```

### Testing

#### Playwright Testing Configuration (GLOBAL SPEC)

**CRITICAL:** `slowMo` is NOT a CLI flag — it's a browser launch option configured in `playwright.config.js`.

##### Valid Configuration

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    },
  },
});
```

##### Valid CLI Flags

```bash
# UI Mode (interactive debugging)
playwright test --ui

# Debug Mode (step-by-step with inspector)
playwright test --debug

# Headed Mode (visible browser)
playwright test --headed

# WRONG - slowMo is NOT a CLI flag
playwright test --slow-mo=1000

# CORRECT - Use environment variable
SLOW_MO=1000 playwright test --headed
```

#### Data Test ID Pattern

Use `data-testid` for Playwright selectors:

```jsx
<button data-testid="confirm-order-button">
  Confirm
</button>

// Test
await page.getByTestId('confirm-order-button').click();
```

#### Selective Test Execution

After modifying code, run only affected tests:

```bash
# Changed logo component
npm run test -- src/components/ui/logo/__tests__/logo.spec.js
```

**Before every commit:**
1. Identify changed files
2. Run tests for those files
3. Fix all failing tests
4. Never remove tests to make them pass

#### Test Before Commit

Run affected tests before every commit. Never commit with failing tests.

### Layout & Styling

#### Responsive Layout Constraints

- Pages: `w-screen` and `h-screen` or `min-h-screen`
- Content: `max-w-7xl` (1280px) and `max-h-[720px]`
- Always centered: `flex items-center justify-center`

**Use `w-screen`** for router-rendered components (NotFound, Login).
**Use `w-full`** for nested components.

#### Inaccessible Element Styling

Non-interactive elements should have:
- `text-muted-foreground` (faded color)
- `select-none` (prevent selection)
- No hover cursor

#### Custom Scrollbar Theme

Define scrollbar variables in `:root` and `.dark`:

```css
:root {
  --scrollbar-size: 0.25rem;
  --scrollbar-thumb: oklch(from var(--border) l c h / 0.5);
}
```

Apply in `@layer base` for both webkit and Firefox.

---

## Priority Rules

When project specs conflict with global specs:

1. **Global specs ALWAYS take precedence** for these topics:
   - No comments (global spec overrides project)
   - No AI attribution (global spec overrides project)
   - Never disable ESLint (global spec overrides project)
   - Named variables philosophy (6 global specs - highest priority)
   - Playwright testing configuration (global spec overrides project)
   - Boolean variable extraction (global spec reinforces project spec)

2. **Project specs take precedence** for:
   - Project-specific architecture patterns
   - Component structure specific to this project
   - API patterns specific to this backend
   - Business logic and domain rules

---

## Usage Notes

- These specs are consolidated from:
  - 61 project specs in `./.specs/`
  - 12 global specs in `~/.specs/`
- Global specs for code style (no comments, named variables, no ESLint disable) take highest priority
- Last updated: 2026-02-20
- Total specs loaded: 73

You can now use `@dev` in your conversations to apply these project-specific patterns and conventions with global best practices enforced.
