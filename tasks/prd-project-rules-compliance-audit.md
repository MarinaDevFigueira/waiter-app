# PRD: Project Rules Compliance Audit & Refactor

## Introduction

Full audit and refactor of all 302 frontend source files to enforce compliance with every rule defined in `.claude/rules/`. The result is a single PR containing all fixes, preceded by a structured audit report documenting every violation found.

## Goals

- Identify every rule violation across all `src/` files
- Fix all violations in one dedicated branch/PR
- Ensure zero regressions (app must build and run after refactor)
- Produce a living audit report as part of the PR description
- Leave codebase in a state where all `.claude/rules/` are followed

## Audit Methodology

For each rule category:
1. Scan all affected files
2. List violations with file + line
3. Apply fixes
4. Verify build passes

---

## User Stories

### US-001: Audit Setup — Create Branch and Audit Report
**Description:** As a developer, I want a dedicated branch and an empty audit report file so that all fixes are tracked in one place.

**Acceptance Criteria:**
- [ ] Branch `fix/rules-compliance-audit` created from `main`
- [ ] File `tasks/audit-report.md` created with one section per rule category
- [ ] Each section has: Rule name, files scanned, violations found, status (pending/fixed)
- [ ] `yarn format` applied
- [ ] Build passes (`yarn build`)

---

### US-002: TypeScript & Type Safety
**Rules:** `rule-prefer-build-time-errors-no-generic-types`, `rules:patterns.md`

**Description:** As a developer, I want all TypeScript types to be explicit so that modifications to interfaces cause build failures instead of runtime errors.

**Violations to fix:**
- Any `Record<string, unknown>`, `any`, or `object` type usage
- Missing proper TypeScript inference on service layer interfaces
- Generic or loosely typed function parameters

**Acceptance Criteria:**
- [ ] Zero occurrences of `Record<string, unknown>`, `any`, `object` as types in `src/`
- [ ] All service function params and return types use specific interfaces
- [ ] Build passes with no TypeScript errors
- [ ] Audit report US-002 section updated with files changed
- [ ] `yarn format` applied

---

### US-003: Named Variables — No Inline Conditionals in JSX
**Rules:** `rule-named-variables-no-inline-conditionals`, `rule-no-inline-expressions-jsx`, `rule-no-chained-ternaries`, `rule-avoid-ternary-in-object-properties`, `rule-never-direct-comparisons-extract-boolean-variable`, `rule-intermediate-variables-only-when-semantic`

**Description:** As a developer, I want all conditional logic extracted to named variables so that JSX is readable and logic is self-documenting.

**Violations to fix:**
- `{isLoading && <Spinner />}` → extract to named variable
- `<Button variant={x ? "a" : "b"} />` → `const buttonVariant = ...`
- `{[...Array(8)].map(...)}` → `const rows = [...Array(8)]; {rows.map(...)}`
- Chained ternaries → object maps
- Direct comparisons in conditionals → named boolean variables
- Ternaries directly in object properties → named variables first

**Acceptance Criteria:**
- [ ] Zero inline `&&`, `? :`, or `??` directly in JSX render
- [ ] Zero `[...Array(n)]` or similar expressions inline in JSX
- [ ] Zero chained ternaries (`x ? a : y ? b : c`) — replaced with object maps
- [ ] All boolean conditions use named variables (`is*`, `has*`, `should*`, `can*` prefixes)
- [ ] Ternaries inside object literals extracted to named variables first
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-004: Code Comments & Self-Documentation
**Rules:** `rule-no-code-comments-self-documenting`, `rule-no-comments-hardcoded-barrel-eslint`

**Description:** As a developer, I want zero code comments so that the codebase is self-documenting through clear naming.

**Violations to fix:**
- Any `//` or `/* */` comments in source files (excluding `src/index.css` theme tokens)
- Commented-out code blocks
- Deprecated marker comments
- Any `eslint-disable` directives
- Barrel `index.js/ts` re-exports
- Hardcoded colors/spacing/fonts (except `w-[px]`/`h-[px]`)

**Acceptance Criteria:**
- [ ] Zero `//` comments in `.tsx`/`.ts` files
- [ ] Zero commented-out code
- [ ] Zero `eslint-disable` directives
- [ ] Zero `index.ts` barrel files that only re-export
- [ ] Hardcoded color/spacing values replaced with Tailwind classes or CSS variables
- [ ] Build passes
- [ ] `yarn format` applied

---

### US-005: React Patterns — useMemo, useCallback, Dependencies
**Rules:** `rule-usememo-derived-state`, `rule-usecallback-stable-references`, `rule-dependency-arrays-primitives`

**Description:** As a developer, I want all React hooks to follow correct patterns so that renders are predictable and dependency arrays are stable.

**Violations to fix:**
- `useEffect` used to derive/compute state → replace with `useMemo`
- Functions passed as props or used in deps without `useCallback`
- Objects/arrays in dependency arrays → extract primitives first
- Optional chaining in dependency arrays (`user?.id` → `const userId = user?.id`)

**Acceptance Criteria:**
- [ ] Zero `useEffect` used solely to compute/derive state
- [ ] All functions passed to children or used in hook deps wrapped in `useCallback` (unless module-scope)
- [ ] All dependency arrays use only primitives (strings, numbers, booleans)
- [ ] No optional chaining in dependency arrays
- [ ] Build passes
- [ ] `yarn format` applied

---

### US-006: Variants & Data Attributes
**Rules:** `rule-variants-data-attributes`

**Description:** As a developer, I want all conditional styling to use data attributes so that className strings are clean and variant logic is separated.

**Violations to fix:**
- Ternaries inside `className` props → replace with `data-*` attributes
- Boolean data attributes using camelCase → convert to lowercase (`data-isactive` not `data-isActive`)
- Parent-to-children state not using `group` + `group-data-[*]:` pattern

**Acceptance Criteria:**
- [ ] Zero ternaries inside `className` props
- [ ] All `data-*` attributes use lowercase keys
- [ ] Parent state propagation uses `group` + `group-data-[*]:` Tailwind classes
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-007: Composite Pattern
**Rules:** `rule-composite-pattern`

**Description:** As a developer, I want all multi-section components to use the composite pattern so that composition is flexible and prop-drilling is avoided.

**Violations to fix:**
- Multi-section components using props for sections instead of children
- Sub-components defined in separate files instead of co-located
- Sub-components not attached as properties (e.g., `Card.Header`)
- Sub-components not following `ParentNameSubName` naming

**Acceptance Criteria:**
- [ ] All multi-section components (Card, Modal, Panel, etc.) use composite pattern
- [ ] Sub-components co-located in same file as parent
- [ ] Sub-components attached as properties: `ComponentName.SubName`
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-008: Component Isolation
**Rules:** `rule-component-isolation`, `rule-component-misc`

**Description:** As a developer, I want shared UI patterns extracted to `src/components/ui/` so that no UI pattern is duplicated across 2+ places.

**Violations to fix:**
- Identical UI patterns repeated in 2+ files → extract to `src/components/ui/`
- Extracted components missing `className` prop
- Buttons missing `hover:cursor-pointer` + `active:scale-95` or `active:shadow-*`
- Non-interactive text missing `text-muted-foreground select-none`
- Pages not using `w-screen h-screen` outer / `max-w-7xl max-h-[720px]` inner layout

**Acceptance Criteria:**
- [ ] No UI pattern duplicated in 2+ places without a shared component
- [ ] All shared components accept `className` prop
- [ ] All buttons have hover + active states
- [ ] Page layout follows `w-screen h-screen` → inner container pattern
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-009: Service & API Layer
**Rules:** `rule-error-handling-return-pattern`, `rule-service-structure`, `rule-schemas`, `rule-write-operations`, `rule-api-rules`

**Description:** As a developer, I want the entire service layer to follow consistent structure and error handling patterns so that API failures are always handled.

**Violations to fix:**
- Functions not returning `{ data }` or `{ error }` — missing try-catch
- Error handlers missing both `toast.error()` AND `logger.error()`
- Service files not co-located with schema and interface files
- Schemas not extending `baseEntitySchema`
- Zod used in service layer (should use TypeScript interfaces only)
- `create`/`update`/`delete` returning entities instead of `Promise<ServiceResult<void>>`
- Client-side `.filter()` on API results instead of server-side query params
- Missing standard query params (`page`, `size`, `orderBy`, `direction`, `search`)
- Query keys not including query params

**Acceptance Criteria:**
- [ ] All service functions wrapped in try-catch returning `{ data }` or `{ error }`
- [ ] Every error path calls both `toast.error(message)` and `logger.error(message, error)`
- [ ] Service structure: `{entity}.service.ts` + `{entity}.schema.ts` + `interfaces/{entity}.interface.ts`
- [ ] All entities extend `baseEntitySchema`
- [ ] No Zod types used in service layer
- [ ] Write operations return `Promise<ServiceResult<void>>`
- [ ] No `.filter()` on API responses — filtering via query params only
- [ ] TanStack Query keys include all query params
- [ ] Build passes
- [ ] `yarn format` applied

---

### US-010: RxJS Observable Pattern
**Rules:** `rule-rxjs-observable-pattern`

**Description:** As a developer, I want all RxJS subjects encapsulated behind the observable pattern so that BehaviorSubjects are never exported directly.

**Violations to fix:**
- `BehaviorSubject` exported directly instead of through encapsulated object
- Missing `subscribe`, `getValue`, `updateState`, `resetState` methods
- Components not cleaning up subscriptions on unmount
- Global subjects not in `src/shared/subjects/`
- Component-specific subjects not in `src/pages/{feature}/components/{name}/observables/`

**Acceptance Criteria:**
- [ ] Zero directly exported `BehaviorSubject` instances
- [ ] All observables expose `subscribe`, `getValue`, `updateState`, `resetState`
- [ ] All component subscriptions have cleanup in `useEffect` return
- [ ] File locations match rule conventions
- [ ] Build passes
- [ ] `yarn format` applied

---

### US-011: Forms
**Rules:** `rule-forms-rhf-zod-tanstack`

**Description:** As a developer, I want all forms to follow the React Hook Form + Zod v4 + TanStack Query pattern so that form state is consistent.

**Violations to fix:**
- Forms not using `zodResolver`
- Mutations using `isLoading` instead of `isPending`
- Inputs not disabled during `mutation.isPending`
- Zod schemas using `{ message: "..." }` instead of `{ error: "..." }` (v4 syntax)
- Missing `onSuccess` cache invalidation or `form.reset()`

**Acceptance Criteria:**
- [ ] All forms use `useForm({ resolver: zodResolver(schema) })`
- [ ] All mutations use `isPending` (not `isLoading`)
- [ ] All inputs disabled when `mutation.isPending`
- [ ] All Zod error messages use `{ error: "..." }` syntax
- [ ] All successful mutations invalidate relevant queries and reset form
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-012: Routing & Profile-Based Access
**Rules:** `rule-tanstack-router`, `rule-protected-routes`, `rule-protected-route-profile-sync`, `rule-profile-based-routing`

**Description:** As a developer, I want routing to be consistent and profile-based so that access control is reliable and there are no redirect loops.

**Violations to fix:**
- Auth guards not using `beforeLoad` + `throw redirect()`
- `window.location` used for navigation → replace with `<Link>` or `useNavigate()`
- `allowedProfiles` in `route.jsx` not matching `hasDashboardAccess` in `index.jsx`
- Inline role arrays instead of `useRoles` hook
- Layout routes missing `<Outlet />`
- `notFoundComponent` not using `() => <Component />` syntax

**Acceptance Criteria:**
- [ ] All auth guards use `beforeLoad` + `throw redirect({ to: '/login', search: { redirect: location.href } })`
- [ ] Zero `window.location` usage for navigation
- [ ] `allowedProfiles` and `hasDashboardAccess` are in sync
- [ ] All role checks use `useRoles` hook — zero inline role arrays
- [ ] All layout routes have `<Outlet />`
- [ ] Build passes
- [ ] `yarn format` applied

---

### US-013: UI Components — Toast, Logger, Data-TestId, Scrollbar
**Rules:** `rule-toast-logger`, `rule-data-testid`, `rule-custom-scrollbar`

**Description:** As a developer, I want error feedback, test selectors, and scrollbars to be consistent across the entire app.

**Violations to fix:**
- `console.log` / `console.error` → replace with `logger.*`
- Errors showing only `toast.error` or only `logger.error` — both are required
- Testable elements (buttons, inputs, forms, cards) missing `data-testid="kebab-case"`
- Custom scrollbar not defined via CSS variables in `:root`/`.dark`
- `scrollbar-width: thin` missing in `@layer base`

**Acceptance Criteria:**
- [ ] Zero `console.log` or `console.error` in `src/`
- [ ] All error paths call both `toast.error()` and `logger.error()`
- [ ] All interactive/testable elements have `data-testid` in kebab-case
- [ ] Scrollbar styled via `--scrollbar-size`, `--scrollbar-thumb`, `--scrollbar-thumb-hover` CSS vars
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-014: i18n — No Hardcoded Visible Strings
**Rules:** `rule-i18n`

**Description:** As a developer, I want zero hardcoded visible strings in the UI so that the app is fully translatable.

**Violations to fix:**
- Hardcoded user-facing strings not wrapped in `useTranslation()` + `t()`
- Missing translation keys in `pt-BR` and `en-US` files
- Interpolated strings not using `{{variableName}}` syntax

**Acceptance Criteria:**
- [ ] Zero hardcoded visible strings in JSX (except internal IDs/keys)
- [ ] Every string has a corresponding key in both `pt-BR` and `en-US` translation files
- [ ] Dynamic values use `{{variableName}}` interpolation
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-015: TanStack Table
**Rules:** `rule-tanstack-table`

**Description:** As a developer, I want all data tables to follow the TanStack Table pattern so that loading states and column definitions are consistent.

**Violations to fix:**
- Columns not defined with `useMemo`
- Missing `flexRender` for headers or cells
- Tables rendering loading/empty states internally instead of parent handling it
- Missing `{name}TableSkeleton` component with `animate-pulse`
- Checking `table.getRowModel().rows.length` instead of source data in parent
- Missing `getSortedRowModel()` for sortable tables

**Acceptance Criteria:**
- [ ] All tables define columns with `useMemo`
- [ ] All header/cell renders use `flexRender`
- [ ] All loading and empty states handled in parent, not inside table
- [ ] Every table has a `{Name}TableSkeleton` with `animate-pulse`
- [ ] Sorting uses `getSortedRowModel()` + `[sorting, setSorting]` state
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-016: Pagination
**Rules:** `rule-pagination`

**Description:** As a developer, I want all paginated views to use the `usePagination` hook and `<Pagination>` composite component consistently.

**Violations to fix:**
- Custom pagination implementations not using `usePagination` hook
- Missing `<Pagination.Info>` or `<Pagination.Controls>`
- Table containers not using `flex flex-col h-full` outer / `flex-1 min-h-0` inner layout

**Acceptance Criteria:**
- [ ] All paginated views use `usePagination` hook
- [ ] All pagination UI uses `<Pagination>` composite component
- [ ] Table containers follow `flex flex-col h-full` → `flex-1 min-h-0` layout
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-017: Auth — Logout & HttpOnly Cookies
**Rules:** `auth-logout-httponly-cookies`

**Description:** As a developer, I want logout to call the backend endpoint first so that HttpOnly cookies are properly cleared.

**Violations to fix:**
- `logout()` using `document.cookie` to clear tokens instead of `POST /auth/logout`
- Missing `serverLogout()` dedicated method
- Local state cleanup not isolated from server logout result

**Acceptance Criteria:**
- [ ] `authService.logout()` calls `serverLogout()` first (POST /auth/logout)
- [ ] `serverLogout()` follows service result pattern and logs errors
- [ ] Local state cleanup happens regardless of `serverLogout()` result
- [ ] Build passes
- [ ] `yarn format` applied

---

### US-018: Foods Page Layout
**Rules:** `rule-foods-page`

**Description:** As a developer, I want the foods page to follow the correct responsive grid layout and category separator pattern.

**Violations to fix:**
- List not using `flex flex-col gap-3` mobile → `grid grid-cols-3/4/5/6` sm/md/lg/xl
- Category separators not using the horizontal divider pattern with `flex-1 h-px bg-border`

**Acceptance Criteria:**
- [ ] Foods list uses mobile flex + desktop responsive grid
- [ ] Category headers use the `<div class="flex items-center gap-3"><div class="flex-1 h-px bg-border" />...</div>` pattern
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP (375px and 1280px)

---

### US-019: Swiper Navigation Buttons
**Rules:** `rule-swiper-navigation-buttons`

**Description:** As a developer, I want Swiper navigation buttons to follow the observable + flexbox pattern.

**Violations to fix:**
- Navigation buttons using `position: absolute` instead of flexbox
- Missing RxJS observable for `{ isBeginning, isEnd }` state
- Missing `setTimeout` in `onInit`
- Buttons not using conditional rendering with named variables

**Acceptance Criteria:**
- [ ] Navigation buttons laid out with flexbox (not `position: absolute`)
- [ ] `{ isBeginning, isEnd }` managed via RxJS observable
- [ ] `setTimeout` used in `onInit` for initialization
- [ ] Buttons conditionally rendered with `shouldShowPrevButton` / `shouldShowNextButton`
- [ ] Build passes
- [ ] `yarn format` applied
- [ ] Verify in browser using Playwright MCP

---

### US-020: Final Verification & PR
**Description:** As a developer, I want the complete audit report and a clean build before opening the PR so that reviewers have full context.

**Acceptance Criteria:**
- [ ] `tasks/audit-report.md` fully populated — all sections have violations list + status "fixed"
- [ ] `yarn build` passes with zero TypeScript errors
- [ ] `yarn format` applied to all changed files
- [ ] Playwright MCP verification: navigate all main routes, check for console errors
- [ ] Single PR opened from `fix/rules-compliance-audit` → `main`
- [ ] PR description includes link to `tasks/audit-report.md` and summary of changes per category

---

## Functional Requirements

- FR-1: All 302 `src/` files audited against every `.claude/rules/` rule
- FR-2: Violations documented per rule in `tasks/audit-report.md`
- FR-3: All violations fixed in branch `fix/rules-compliance-audit`
- FR-4: `yarn build` passes after all fixes
- FR-5: Single PR targeting `main` with full audit report in description
- FR-6: No behavioral regressions — app must function identically after refactor
- FR-7: Every fix follows KISS — minimum change required to achieve compliance

## Non-Goals

- Creating new tests (tests excluded from this audit)
- Adding new features or refactoring business logic
- Changing API contracts or backend interfaces
- Modifying `.claude/rules/` files themselves
- Touching `dist/`, `public/`, or config files unless directly required by a rule

## Technical Considerations

- Work in order: TypeScript errors first (US-002) — downstream fixes depend on correct types
- After each US: run `yarn build` incrementally to catch regressions early
- Use Playwright MCP after every visual change (US-003, US-006, US-007, US-008, US-011, US-013, US-014, US-015, US-016, US-018, US-019)
- Use sequential-thinking MCP for complex refactors involving multiple interacting rules
- Use context7 MCP if unsure about library API during fixes

## Success Metrics

- `yarn build` exits with code 0 and zero TypeScript errors
- Zero violations of any `.claude/rules/` rule in `src/`
- `tasks/audit-report.md` documents every file changed and violation fixed
- Single clean PR with descriptive section-by-section summary
