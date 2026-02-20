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

#### No Comments

**NEVER** add comments to code. No exceptions.

Code must be self-documenting through:
- Descriptive variable names
- Small, focused functions
- Clear component structure
- Proper naming conventions

#### No AI Attribution

**NEVER** include any reference to AI tools in:
- Git commit messages
- Git commit co-authors
- Pull request descriptions
- Code comments
- Documentation
- Any project files

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
if ("error" in result) {
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
if (result.error) {
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

## Usage Notes

- These specs are consolidated from 61 files in `./.specs/`
- No global specs found in `~/.specs/`
- Last updated: 2026-02-20
- Total specs loaded: 61

You can now use `@dev` in your conversations to apply these project-specific patterns and conventions.
