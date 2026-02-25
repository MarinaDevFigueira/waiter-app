---
name: dev
description: "develop"
model: sonnet
color: purple
permissionMode: acceptEdits
memory: project
tools: AskUserQuestion,Bash,Edit,Glob,Grep,LSP,MCPSearch,Read,Skill,Task,WebFetch,Write,WebSearch
---

# Dev Agent

Specialized development agent following project specs and coding standards for the Waiter App.

## Core Responsibilities

- Write code following project-specific patterns and conventions
- Apply coding standards from spec files
- Ensure consistency with established patterns
- Follow security and performance guidelines

## ⚠️ CRITICAL: useEffect Anti-Pattern

**useEffect is an ANTI-PATTERN and creates confusing, hard-to-maintain code.**

### Default to useMemo/useCallback

Before using useEffect, ask:
1. **Is this derived state?** → Use `useMemo`
2. **Is this an event handler?** → Use `useCallback`
3. **Is this initialization?** → Use `useRef` + minimal `useEffect`
4. **Is this synchronization?** → OK to use `useEffect` (document why)

### Problems with useEffect
- Creates circular dependencies and infinite loops
- Makes code hard to debug and understand
- Causes performance issues with unnecessary re-renders
- Scatters side effects throughout component

### When useEffect is Actually Needed
- Subscribing to external data sources (WebSocket, RxJS observables)
- Setting up/cleaning up browser APIs (addEventListener, timers)
- Synchronizing with non-React systems (DOM manipulation, third-party libraries)

**See specs:**
- `avoid-use-effect-anti-pattern.md` - Full anti-pattern guide
- `prefer-use-memo.md` - Using useMemo for derived state
- `prefer-use-callback.md` - Using useCallback for stable functions

## Specs Reference

This agent follows the specifications defined in:

### Project Specs (./.specs/)

72 specification files:

**Code Style & Principles:**
- `no-comments.spec.md` - Never add code comments
- `no-hardcoded-values.spec.md` - Use Tailwind classes/theme variables
- `no-barrel-exports.spec.md` - Import from specific file paths
- `data-attributes-lowercase.spec.md` - Lowercase data-* attributes
- `kiss-principle.spec.md` - Keep It Simple, Stupid
- `dry-principle.spec.md` - Don't Repeat Yourself
- `single-source-of-truth.spec.md` - One authoritative source
- `utility-first-mindset.spec.md` - Utility-first approach
- `extract-before-second-use.spec.md` - Extract on second use
- `dont-replicate-logic.spec.md` - No logic duplication
- `no-copy-paste-coding.spec.md` - Avoid copy-paste

**Named Variables:**
- `named-variables-in-conditionals.spec.md` - Extract conditionals
- `named-variables-over-inline-ternaries.spec.md` - No inline ternaries

**React Patterns:**
- `no-ternary-in-jsx.spec.md` - Extract ternaries from JSX
- `no-chained-ternaries.spec.md` - Use if-else or maps
- `no-inline-expressions-in-jsx.spec.md` - No inline arrays/objects/calculations
- `component-variants.spec.md` - data-variant pattern
- `conditional-rendering-with-data-attributes.spec.md` - **data-* attributes for conditional styling**
- `always-use-composite-pattern.spec.md` - Composite component structure
- `composite-component-pattern.spec.md` - Card.Header pattern
- `use-memo-for-computed-values.spec.md` - useMemo for derived values
- `use-callback-for-stable-references.spec.md` - useCallback for functions
- `dependency-arrays.spec.md` - Only primitives/stable refs
- `avoid-use-effect-anti-pattern.md` - **CRITICAL: Minimize useEffect usage**
- `prefer-use-memo.md` - **Prefer useMemo for derived state**
- `prefer-use-callback.md` - **Prefer useCallback for stable functions**

**TypeScript/Interfaces:**
- `no-interface-in-implementation.spec.md` - Sibling *.interface.ts files

**Component Structure:**
- `component-isolation-no-duplication.spec.md` - Reusable UI components
- `component-test-coverage.spec.md` - __tests__/ with 3-5 tests
- `button-interaction-states.spec.md` - cursor-pointer + active shadow
- `group-data-attribute-pattern.spec.md` - group-data-[active=true] pattern
- `page-component-structure.spec.md` - page.tsx + components/ folder

**State Management (RxJS):**
- `rxjs-subject-pattern.spec.md` - Encapsulated BehaviorSubjects
- `rxjs-subscription-cleanup.spec.md` - Unsubscribe in useEffect cleanup
- `observable-state-management.spec.md` - **Observable pattern for shared/component state**

**Routing (TanStack Router):**
- `tanstack-router-file-based-routing.spec.md` - File-based routes
- `tanstack-router-navigation.spec.md` - Link vs useNavigate
- `tanstack-router-protected-routes.spec.md` - beforeLoad guards
- `tanstack-router-not-found-handling.spec.md` - defaultNotFoundComponent
- `tanstack-router-layout-outlet-pattern.spec.md` - <Outlet /> for children
- `tanstack-router-context.spec.md` - Router context patterns
- `profile-based-routing.spec.md` - Same / route, different content
- `protected-route-profile-sync.spec.md` - Profile-based protection
- `normalize-pathname-trailing-slash.spec.md` - Remove trailing slashes

**Forms & Validation:**
- `forms-rhf-tanstack-zod.spec.md` - React Hook Form + Zod v4
- `product-form-translations.md` - Multi-language product translations
- `product-form-structure.md` - Product form component organization
- `product-form-state-management.md` - Product form state patterns

**Data Fetching & Services:**
- `error-handling-return-pattern.spec.md` - Return {data} or {error}
- `write-operations-return-void.spec.md` - Create/update return void
- `api-query-params-pattern.spec.md` - API filtering/sorting/pagination
- `no-client-side-filtering.spec.md` - No .filter() on client
- `service-schemas-pattern.spec.md` - Co-located schemas
- `base-entity-pattern.spec.md` - Extend baseEntitySchema
- `mock-data-schema-compliance.spec.md` - Mock data follows schemas
- `api-client-refresh-token.spec.md` - Automatic token refresh
- `auth-service-pattern.spec.md` - Authentication service patterns

**Tables (TanStack Table):**
- `tanstack-table-pattern.spec.md` - useReactTable pattern
- `tanstack-table-row-rendering.spec.md` - Check data length in parent
- `table-loading-skeleton.spec.md` - Dedicated skeleton component

**Internationalization (i18n):**
- `i18n-pattern.spec.md` - useTranslation hook
- `use-translation-pattern.spec.md` - Translation patterns
- `language-selector-pattern.spec.md` - Language selector component

**Error Handling & Logging:**
- `react-toastify-usage.spec.md` - toast.error/success
- `logger-pattern.spec.md` - logger.debug/info/warn/error
- `error-display-toast-logger.spec.md` - Toast + logger on error

**Pagination:**
- `pagination-hook-pattern.spec.md` - usePagination hook

**Testing (MCP Playwright):**
- `component-test-coverage.spec.md` - Minimum test coverage
- `data-testid-pattern.spec.md` - data-testid selectors
- `selective-test-execution.spec.md` - Run affected tests
- `test-before-commit.spec.md` - Test before commit using MCP Playwright

**Layout & Styling:**
- `responsive-layout-constraints.spec.md` - w-screen, max-w-7xl
- `inaccessible-element-styling.spec.md` - text-muted, select-none
- `custom-scrollbar-theme.spec.md` - Scrollbar CSS variables

**Git:**
- `no-ai-attribution.spec.md` - No AI attribution in commits/PRs

**Other:**
- `foods-page.spec.md` - Foods page specific patterns
- `README.md` - Project README

### Global Specs (~/.specs/)

21 specification files:

**Code Style Fundamentals:**
- `no-code-comments.spec.md` - Never add code comments
- `eslint-no-disable.spec.md` - Never disable ESLint rules
- `boolean-variable-extraction.spec.md` - Extract booleans before conditionals

**Named Variables Philosophy (6 specs):**
- `always-named-variables-never-inline-code.spec.md` - Core principle
- `no-inline-function-arguments.spec.md` - Extract function arguments
- `no-inline-object-properties.spec.md` - Extract object property values
- `no-inline-return-expressions.spec.md` - Extract return expressions
- `no-inline-conditionals.spec.md` - Extract conditional expressions
- `no-inline-boolean-expressions.spec.md` - Extract boolean expressions

**Git Practices:**
- `git-commit-no-coauthor.spec.md` - No co-author attribution
- `no-coauthor-attribution.spec.md` - No AI attribution in commits/PRs

**Internationalization (5 specs):**
- `i18n-translations-structure.spec.md` - Identical key structure across languages
- `i18n-translations-enum.spec.md` - TypeScript enum for languages
- `i18n-language-cookie-pattern.spec.md` - Language via HTTP cookie
- `i18n-query-cache-invalidation.spec.md` - Language prefix in query keys
- `i18n-backend-translations-array.spec.md` - translations[] array in DTOs

**Testing:**
- `playwright-testing.spec.md` - Playwright E2E testing configuration

**SwiperJS (Carousels/Sliders - 5 specs):**
- `swiperjs-basics.spec.md` - Installation, core concepts, configuration
- `swiperjs-react.spec.md` - React components, hooks, events
- `swiperjs-modules.spec.md` - Modular architecture (Navigation, Pagination, Effects, etc.)
- `swiperjs-advanced-patterns.spec.md` - Performance, accessibility, best practices
- `swiper-navigation-buttons.spec.md` - **Navigation arrows with conditional visibility pattern**

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

#### Product Form Multi-Language Translations

**Component Structure:**
Product forms MUST follow this structure:
- Main component file: `[component-name]/[component-name].tsx`
- Interfaces file: `[component-name]/[component-name].interface.ts`
- Sub-components: Separate files in same directory

Example structure:
```
src/pages/products/components/product-form-dialog/
├── product-form-dialog.tsx - Main form logic
├── product-form-dialog.interface.ts - TypeScript interfaces
├── language-switcher.tsx - Language selection UI
├── unsaved-changes-dialog.tsx - Confirmation dialog
├── fields.tsx - Form field wrappers
└── footer.tsx - Form footer with buttons
```

**Translation Management:**
- Use `allTranslations` state to store all language translations
- Use `editingLanguage` to track current editing language
- Implement `UnsavedChangesDialog` before allowing language switch
- Use TanStack Query to fetch existing translations from backend

**State Management Rules:**
- Use `hasInitializedRef` to prevent re-initialization loops
- NEVER add `language` to useEffect dependencies that call reset()
- Use `setValue()` for language switching (not reset())
- Validate at least one translation exists before submit

**Backend Integration:**
- Endpoint: GET /products/:id/translations
- Returns: { translations: [{ locale, name, description }] }
- Submit sends all translations in translations[] array

**Specs Location:**
- Translation specs: ./.specs/product-form-translations.md
- Structure specs: ./.specs/product-form-structure.md
- State management specs: ./.specs/product-form-state-management.md

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

#### Translations Structure (GLOBAL SPEC - HIGHEST PRIORITY)

**CRITICAL:** All translation files must have identical key structure across all languages.

- **ALWAYS** maintain identical key structure across all language files (pt-BR.json, en-US.json, es.json)
- **NEVER** add a key to one language without adding to ALL languages
- **ALWAYS** use nested objects for logical grouping
- **NEVER** use flat key structures like `"auth.login"` - use nested objects

```json
// ✅ CORRECT - All languages have identical structure
// pt-BR.json
{
  "auth": {
    "login": "Entrar",
    "logout": "Sair",
    "forgotPassword": "Esqueci a senha"
  }
}

// en-US.json
{
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "forgotPassword": "Forgot Password"
  }
}

// es.json
{
  "auth": {
    "login": "Iniciar Sesión",
    "logout": "Cerrar Sesión",
    "forgotPassword": "Olvidé mi Contraseña"
  }
}
```

**Adding New Translations:**
1. Add to primary language (pt-BR.json) first
2. Immediately add to ALL other languages
3. Verify key parity across all files

**Why:** Prevents missing translations, easier maintenance, type safety.

#### Translations Enum (GLOBAL SPEC - HIGHEST PRIORITY)

**ALWAYS** use TypeScript enum for supported languages, **NEVER** hardcode language codes.

```typescript
// ✅ CORRECT - src/shared/enums/translations.enum.ts
export enum TranslationsEnum {
  PT_BR = "pt-BR",
  EN_US = "en-US",
  ES = "es",
}

export type TranslationLanguage =
  | TranslationsEnum.PT_BR
  | TranslationsEnum.EN_US
  | TranslationsEnum.ES;
```

**Usage:**
```typescript
// ✅ CORRECT - Using enum
import { TranslationsEnum, type TranslationLanguage } from '@/shared/enums/translations.enum';

const [language, setLanguage] = useState<TranslationLanguage>(
  TranslationsEnum.PT_BR // ✅ Enum value
);

if (language === TranslationsEnum.PT_BR) { // ✅ Enum comparison
  // ...
}

// ❌ WRONG - Hardcoded strings
const [language, setLanguage] = useState("pt-BR"); // ❌ Hardcoded
if (language === "pt-BR") { // ❌ String literal
```

**Why:** Type safety, autocomplete, refactor-safe, single source of truth.

#### Language Cookie Pattern (GLOBAL SPEC - HIGHEST PRIORITY)

**ALWAYS** send user's selected language to backend via HTTP cookie, **NEVER** via headers or query params.

- **ALWAYS** send language preference via HTTP cookie named `user_language`
- **NEVER** send language in custom headers (e.g., `Accept-Language`, `X-Language`)
- **NEVER** send language in query parameters (e.g., `?lang=pt-BR`)
- **ALWAYS** configure HTTP client with `credentials: "include"`

```typescript
// ✅ CORRECT - Set cookie when language changes
import { cookies } from '@/lib/cookies';

export function useLanguage() {
  const setLanguage = (language: string) => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    cookies.set('user_language', language); // ✅ Cookie set
  };
}

// ✅ CORRECT - Configure HTTP client
const response = await fetch(`${API_URL}/products`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ✅ Sends cookies
});
```

**Cookie Utility:**
```typescript
// src/lib/cookies.ts
export const cookies = {
  set: (name: string, value: string, days = 365): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  },
  get: (name: string): string | null => { /* ... */ },
  remove: (name: string): void => { /* ... */ },
};
```

**Why:** Automatic transmission, backend compatibility, persistence, clean URLs.

#### Query Cache Invalidation (GLOBAL SPEC - HIGHEST PRIORITY)

**ALWAYS** invalidate cached queries when language changes by including language in query keys.

- **ALWAYS** include language prefix in all TanStack Query keys
- **NEVER** share cache between different languages
- **ALWAYS** create utility function for adding language prefix
- **NEVER** duplicate language prefix logic across files

```typescript
// ✅ CORRECT - Language prefix utility in useLanguage.ts
export function useLanguage() {
  const [language, setLanguage] = useState('pt-BR');

  const addLanguagePrefix = (...keys: unknown[]): unknown[] => {
    return [`language:${language}`, ...keys];
  };

  return {
    language,
    setLanguage,
    addLanguagePrefix, // ✅ Utility function
  };
}

// ✅ CORRECT - Use in all query hooks
const { addLanguagePrefix } = useLanguage();

const { data } = useQuery({
  queryKey: addLanguagePrefix('products', queryParams),
  // Result: ['language:pt-BR', 'products', queryParams]
  queryFn: () => fetchProducts(queryParams),
});

// ✅ CORRECT - Use in cache invalidations
queryClient.invalidateQueries({
  queryKey: addLanguagePrefix('categories'), // ✅ With language
});
```

**How It Works:**
- User viewing in Portuguese: `queryKey: ['language:pt-BR', 'products', { page: 1 }]`
- User switches to English: `queryKey: ['language:en-US', 'products', { page: 1 }]` → Cache EMPTY → Triggers refetch
- User switches back to Portuguese: `queryKey: ['language:pt-BR', 'products', { page: 1 }]` → Cache HIT → Returns cached data

**Why:** Prevents stale translations, automatic invalidation, cache efficiency, single source of truth.

#### Backend Translations Array (GLOBAL SPEC - HIGHEST PRIORITY)

Backend entities with translatable fields MUST use `translations[]` array, never top-level translated fields.

- **ALWAYS** use `translations[]` array in DTOs for multilingual entities
- **NEVER** use top-level fields like `name`, `description` that should be translated
- **ALWAYS** include `locale` field in each translation object
- **NEVER** send different structure than backend expects

```typescript
// ✅ CORRECT - Backend DTO Pattern
interface CreateCategoryRequestDTO {
  translations: Array<{
    locale: 'pt-BR' | 'en-US' | 'es';
    name: string;
    description?: string;
  }>;
  sortOrder: number;
  active: boolean;
}

// Request body
{
  "translations": [
    {
      "locale": "pt-BR",
      "name": "Pizzas",
      "description": "Nossas deliciosas pizzas"
    },
    {
      "locale": "en-US",
      "name": "Pizzas",
      "description": "Our delicious pizzas"
    }
  ],
  "sortOrder": 1,
  "active": true
}
```

**Frontend Schema:**
```typescript
// category.schema.ts
export const categoryTranslationSchema = z.object({
  locale: z.enum(['pt-BR', 'en-US', 'es']),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export const categoryFormSchema = z.object({
  translations: z.array(categoryTranslationSchema).min(1), // ✅ Array
  sortOrder: z.number().int().min(0),
  active: z.boolean().default(true),
});
```

**Form Component:**
```typescript
const { language } = useLanguage();

const form = useForm<CategoryForm>({
  defaultValues: {
    translations: [
      {
        locale: language, // ✅ Current app language
        name: '',
        description: '',
      },
    ],
    sortOrder: 0,
    active: true,
  },
});

// Form fields use translations.0.name and translations.0.description
<input type="hidden" {...form.register('translations.0.locale')} value={language} />
<input {...form.register('translations.0.name')} />
<textarea {...form.register('translations.0.description')} />
```

**Why:** Backend compatibility, multilingual support, type safety, scalability.

#### useTranslation Hook

```javascript
const { t } = useTranslation();
<h1>{t("foods.welcome")}</h1>
<p>{t("orders.noResults", { query: searchQuery })}</p>
```

#### Language Selector

Component with dropdown, persists in localStorage and cookie, updates document.lang.

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

### Testing via MCP Playwright

#### MCP Playwright (OBRIGATÓRIO)

**CRITICAL:** Usar o MCP Playwright integrado ao Claude Code para testar implementações. **NUNCA** usar `npm run test` ou `npm run test:ui` para validar durante o desenvolvimento.

##### Ferramentas MCP Disponíveis

- `browser_navigate` - Navegar para URL do app (`http://localhost:5173`)
- `browser_snapshot` - Capturar snapshot de acessibilidade (preferir sobre screenshot)
- `browser_click` - Clicar em elementos usando refs do snapshot
- `browser_type` - Digitar texto em campos
- `browser_fill_form` - Preencher múltiplos campos de formulário
- `browser_take_screenshot` - Capturar screenshot visual
- `browser_evaluate` - Executar JavaScript na página
- `browser_console_messages` - Verificar erros no console
- `browser_network_requests` - Monitorar requisições de rede
- `browser_wait_for` - Aguardar texto aparecer/desaparecer

##### Fluxo de Teste

1. Garantir que o dev server está rodando (`npm run dev`)
2. Usar `browser_navigate` para acessar `http://localhost:5173`
3. Usar `browser_snapshot` para verificar o estado da página
4. Interagir com elementos via `browser_click`, `browser_type`, etc.
5. Verificar resultados com `browser_snapshot` ou `browser_take_screenshot`
6. Checar `browser_console_messages` para erros

#### Data Test ID Pattern

Use `data-testid` para selecionar elementos:

```jsx
<button data-testid="confirm-order-button">
  Confirm
</button>
```

No MCP Playwright, usar `browser_snapshot` para obter refs dos elementos e interagir via `browser_click`.

#### Validação Antes de Finalizar

**Antes de finalizar qualquer implementação:**
1. Navegar até a página afetada via MCP Playwright
2. Verificar que os elementos renderizam corretamente (snapshot)
3. Testar interações (clicks, formulários, navegação)
4. Checar console por erros
5. Nunca finalizar com erros visuais ou de console

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

### SwiperJS (Carousels & Sliders) - GLOBAL SPEC

**CRITICAL:** SwiperJS is the standard library for touch sliders, carousels, and galleries. Always use the modular architecture with React components.

#### Installation & Setup

```bash
npm i swiper
```

#### Basic React Pattern

```jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCarousel({ products }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      onSlideChange={() => console.log('slide change')}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id}>
          <ProductCard data={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

#### Core Principles

**ALWAYS:**
- Import only needed modules to reduce bundle size
- Import module-specific CSS (`import 'swiper/css/navigation'`)
- Use `modules` prop to register modules
- Use `useSwiper()` hook for imperative control inside slides
- Use `useSwiperSlide()` for slide-specific state
- Add `virtualIndex` for virtual slides (100+ items)

**NEVER:**
- Import entire Swiper bundle
- Forget CSS imports (modules won't render correctly)
- Use vanilla JS version in React (`new Swiper()`)
- Render 100+ slides without Virtual module
- Mix multiple effects (fade + cube)

#### Common Modules

```javascript
import {
  Navigation,      // Prev/Next buttons
  Pagination,      // Dots/bullets/progressbar
  Scrollbar,       // Draggable scrollbar
  A11y,            // Accessibility (ALWAYS include)
  Autoplay,        // Auto-advance slides
  Keyboard,        // Keyboard navigation
  Mousewheel,      // Mouse wheel control
  EffectFade,      // Fade transition
  EffectCoverflow, // iTunes coverflow
  EffectCube,      // 3D cube rotation
  Virtual,         // Virtual slides (performance)
  Lazy,            // Lazy loading images
  Zoom,            // Image zoom
  Thumbs,          // Thumbnail navigation
} from 'swiper/modules';
```

#### Responsive Breakpoints

```jsx
<Swiper
  breakpoints={{
    320: { slidesPerView: 1, spaceBetween: 10 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 },
  }}
>
```

#### Virtual Slides Pattern (100+ Items)

```jsx
import { Virtual } from 'swiper/modules';

const slides = Array.from({ length: 1000 });

<Swiper modules={[Virtual]} virtual>
  {slides.map((_, index) => (
    <SwiperSlide key={index} virtualIndex={index}>
      Slide {index}
    </SwiperSlide>
  ))}
</Swiper>
```

**Benefits:**
- Only renders visible slides (~3-5 DOM nodes)
- Essential for large datasets (1000+ items)
- Massive performance improvement

#### Custom Navigation with Hooks

```jsx
import { useSwiper, useSwiperSlide } from 'swiper/react';

function CustomNav() {
  const swiper = useSwiper();
  const { isActive } = useSwiperSlide();

  return (
    <div>
      <button onClick={() => swiper.slidePrev()}>Prev</button>
      <button onClick={() => swiper.slideNext()}>Next</button>
    </div>
  );
}

<Swiper>
  <CustomNav />
  {slides.map(slide => <SwiperSlide key={slide.id}>{slide}</SwiperSlide>)}
</Swiper>
```

#### Common Patterns

**Product Gallery with Thumbnails:**
```jsx
const [thumbsSwiper, setThumbsSwiper] = useState(null);

<Swiper modules={[Thumbs, Zoom]} thumbs={{ swiper: thumbsSwiper }}>
  {images.map(img => <SwiperSlide key={img.id}><img src={img.url} /></SwiperSlide>)}
</Swiper>

<Swiper onSwiper={setThumbsSwiper} slidesPerView={4}>
  {images.map(img => <SwiperSlide key={img.id}><img src={img.thumb} /></SwiperSlide>)}
</Swiper>
```

**Auto-play Hero Slider:**
```jsx
<Swiper
  modules={[Autoplay, Pagination, EffectFade]}
  effect="fade"
  autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
  pagination={{ clickable: true }}
  loop
>
```

#### Accessibility (ALWAYS Include)

```jsx
import { A11y, Keyboard } from 'swiper/modules';

<Swiper
  modules={[A11y, Keyboard]}
  keyboard={{ enabled: true }}
  a11y={{
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  }}
>
```

#### Common Pitfalls

**Pitfall 1: Missing CSS Imports**
```jsx
// ❌ WRONG
import { Navigation } from 'swiper/modules';

// ✅ CORRECT
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
```

**Pitfall 2: Loop with Duplicate Keys**
```jsx
// ❌ WRONG
<Swiper loop>
  {items.map(item => <SwiperSlide key={item.id}>{item.name}</SwiperSlide>)}
</Swiper>

// ✅ CORRECT
<Swiper loop>
  {items.map((item, index) => (
    <SwiperSlide key={`${item.id}-${index}`}>{item.name}</SwiperSlide>
  ))}
</Swiper>
```

**Pitfall 3: No Cleanup**
```jsx
// ❌ WRONG
const [swiper, setSwiper] = useState(null);

// ✅ CORRECT
const [swiper, setSwiper] = useState(null);
useEffect(() => {
  return () => swiper?.destroy(true, true);
}, [swiper]);
```

**Rationale:** SwiperJS is the industry-standard carousel library with superior performance, touch support, and modular architecture. The module system ensures minimal bundle size and only loads needed features.

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
  - 66 project specs in `./.specs/`
  - 21 global specs in `~/.specs/`
- Global specs for code style (no comments, named variables, no ESLint disable, i18n patterns, SwiperJS patterns) take highest priority
- Last updated: 2026-02-22
- Total specs loaded: 90

You can now use `@dev` in your conversations to apply these project-specific patterns and conventions with global best practices enforced.
