# Rules Compliance Audit Report

Branch: `fix/rules-compliance-audit`
Date: 2026-03-16

---

## US-002 — TypeScript & Type Safety — Eliminate Generic Types

**Rule:** `rule-prefer-build-time-errors-no-generic-types.md`
**Files scanned:** `src/**/*.ts`, `src/**/*.tsx`
**Violations found:**

- `src/pages/users/components/users-table.tsx:65` — unnecessary `as any` cast on template string passed to `t()` (removed)
- `src/components/ui/business-selector-button/business-selector-button.tsx:27` — `BusinessSelection` passed where `BusinessData` expected (added `address: null`)
- `src/shared/hooks/useBusiness.ts:45` — missing `address` field on `setBusiness` call (added `address: null`)
- `Record<string, unknown>` in `logger.ts` and `translations.ts` — legitimate uses (logger metadata, dynamic translation traversal)
- `as any` in `routeTree.gen.ts` — auto-generated file, not modified
  **Status:** fixed

---

## US-003 — Code Comments — Remove All Comments and Barrel Exports

**Rule:** `rule-no-code-comments-self-documenting.md`, `rule-no-comments-hardcoded-barrel-eslint.md`
**Files scanned:** `src/**/*.ts`, `src/**/*.tsx` (236 files)
**Violations found:** None — no comments, no eslint-disable, no barrel re-exports found
**Status:** fixed (no changes needed)

---

## US-004 — Service Layer — Error Handling and File Structure

**Rule:** `rule-error-handling-return-pattern.md`, `rule-service-structure.md`, `rule-toast-logger.md`
**Files scanned:** `src/services/**` (11 services, 10 interface files)
**Violations found:**

- `GetBusinessSettingsResponse` duplicated in `business.interface.ts` and `business-settings.interface.ts` — removed duplicate, now re-exported from `business-settings.interface.ts`
- `GetBusinessLimitsResponse` had conflicting structures in `business.interface.ts` vs `business-limits.interface.ts` — renamed to `GetBusinessDetailLimitsResponse` to clarify distinct use
- Schemas are in `src/shared/schemas/` rather than co-located — acceptable pattern (shared entities)
- All service functions use try-catch and return `{ data }` or `{ error }` — compliant
- All error paths call `logger.error()` — compliant (consumers handle toast)
  **Status:** fixed

---

## US-005 — Service Layer — Schemas, Write Operations, API Rules

**Rule:** `rule-schemas.md`, `rule-write-operations.md`, `rule-api-rules.md`
**Files scanned:** `src/services/**`, `src/**/*.ts`, `src/**/*.tsx`
**Violations found:**

- `categorySchema`, `userSchema`, `businessSchema` — did not extend `baseEntitySchema` (fixed)
- `productsService.delete()` returned `{ success, id }` instead of void (fixed)
- `categoriesService.delete()` returned `{ success, id }` instead of void (fixed)
- `foods/page.tsx` filtered categories by active client-side (fixed: added `active` API param)
- `categories.tsx` filtered categories by name client-side (fixed)
- `business.service.ts` mapping missing `updatedAt` and `deletedAt` (fixed)
  **Status:** fixed

---

## US-006 — RxJS Observable Pattern — Encapsulate BehaviorSubjects

**Rule:** `rule-rxjs-observable-pattern.md`
**Files scanned:** `src/shared/subjects/**`, `src/pages/**`
**Violations found:**

- `useCookieConsent.ts:7` — `cookieConsentObservable.getValue` missing function call parentheses (fixed)
- All 16 global subjects properly encapsulated — no violations
- All 3 component-specific observables correctly located — no violations
- All subscription useEffect cleanups present — no violations
  **Status:** fixed

---

## US-007 — Routing & Profile-Based Access

**Rule:** `rule-tanstack-router.md`, `rule-protected-routes.md`, `rule-protected-route-profile-sync.md`, `rule-profile-based-routing.md`
**Files scanned:** `src/routes/**`
**Violations found:**

- `dashboard/route.tsx` — used component-level ProtectedRoute instead of beforeLoad (fixed)
- All 5 dashboard sub-routes redirected to `/` instead of `/login` with location.href (fixed)
- All other checks (window.location, Outlet, notFoundComponent, inline roles) — compliant
  **Status:** fixed

---

## US-008 — Auth Logout — HttpOnly Cookie Handling

**Rule:** `auth-logout-httponly-cookies.md`
**Files scanned:** `src/services/auth/**`
**Violations found:** TBD
**Status:** pending

---

## US-009 — Forms — React Hook Form + Zod v4 + TanStack Query

**Rule:** `rule-forms-rhf-zod-tanstack.md`
**Files scanned:** `src/**/*.tsx` (form components)
**Violations found:** TBD
**Status:** pending

---

## US-010 — JSX — Extract Inline Conditionals to Named Variables

**Rule:** `rule-named-variables-no-inline-conditionals.md`, `rule-no-inline-expressions-jsx.md`
**Files scanned:** `src/**/*.tsx`
**Violations found:** TBD
**Status:** pending

---

## US-011 — JSX — Fix Chained Ternaries, Object Ternaries, Direct Comparisons

**Rule:** `rule-no-chained-ternaries.md`, `rule-avoid-ternary-in-object-properties.md`, `rule-never-direct-comparisons-extract-boolean-variable.md`
**Files scanned:** `src/**/*.tsx`, `src/**/*.ts`
**Violations found:** TBD
**Status:** pending

---

## US-012 — React Hooks — useMemo, useCallback, Dependency Arrays

**Rule:** `rule-usememo-derived-state.md`, `rule-usecallback-stable-references.md`, `rule-dependency-arrays-primitives.md`
**Files scanned:** `src/**/*.tsx`
**Violations found:** TBD
**Status:** pending

---

## US-013 — Variants — Data Attributes for Conditional Styling

**Rule:** `rule-variants-data-attributes.md`
**Files scanned:** `src/**/*.tsx`
**Violations found:** TBD
**Status:** pending

---

## US-014 — Composite Pattern — Multi-Section Components

**Rule:** `rule-composite-pattern.md`
**Files scanned:** `src/components/**`, `src/pages/**`
**Violations found:** TBD
**Status:** pending

---

## US-015 — Component Isolation and Misc — Extract Duplicates, Fix Buttons and Layouts

**Rule:** `rule-component-isolation.md`, `rule-component-misc.md`
**Files scanned:** `src/components/**`, `src/pages/**`
**Violations found:** TBD
**Status:** pending

---

## US-016 — Toast, Logger — Replace console.log and Fix Dual Error Reporting

**Rule:** `rule-toast-logger.md`
**Files scanned:** `src/**/*.ts`, `src/**/*.tsx`
**Violations found:** TBD
**Status:** pending

---

## US-017 — Data-TestId and Custom Scrollbar

**Rule:** `rule-data-testid.md`, `rule-custom-scrollbar.md`
**Files scanned:** `src/**/*.tsx`, `src/index.css`
**Violations found:**

- `src/index.css` — Custom scrollbar via `--scrollbar-size`, `--scrollbar-thumb`, `--scrollbar-thumb-hover` already defined in `:root` and `.dark`; scrollbar applied in `@layer base` — compliant
- `src/pages/users/components/user-form-dialog/user-form-dialog.tsx` — Missing data-testid on name, username, email, password inputs, role select, cancel and submit buttons (added)
- `src/components/ui/business-selector-button/business-selector-button.tsx` — Missing data-testid on trigger button (added)
- `src/pages/foods/components/cart-drawer/cart-drawer.tsx` — Missing data-testid on decrease, increase, remove cart item buttons; close button (added)
  **Files changed:** 3
  **Status:** fixed

---

## US-018 — i18n — Audit and Fix pt-BR Hardcoded Strings

**Rule:** `rule-i18n.md`
**Files scanned:** `src/pages/**`, `src/components/**`, `src/shared/hooks/**`
**Violations found:**

- `src/pages/users/page.tsx:65` — `toast.info("Funcionalidade de desabilitar usuário ainda não implementada")` → `t("users.actions.disableNotImplemented")`
- `src/pages/orders/components/staff-session-summary-modal/staff-session-summary-modal.tsx:211` — `"Pedido #${shortId}"` → `t("orders.admin.table.orderLabel", { id: shortId })`
- `src/shared/hooks/useCart.ts:137` — `toast.success("Item removido do carrinho")` → `t("cart.itemRemoved")`
- `src/shared/hooks/useCart.ts:172` — `toast.success("Carrinho limpo")` → `t("cart.cleared")`
- `src/shared/hooks/useCart.ts:82` — fallback `"Erro ao buscar sessão ativa"` → `t("cart.errors.fetchSession")`
- `src/shared/hooks/useCart.ts:98` — fallback `"Erro ao abrir sessão"` → `t("cart.errors.openSession")`
- `src/shared/hooks/useCart.ts:198` — fallback `"Erro ao criar pedido"` → `t("cart.errors.createOrder")`
- `src/shared/hooks/useCategories.ts:59` — `throw new Error("Nenhum dado retornado")` → `t("common.errors.noData")`
- `src/shared/hooks/useCategories.ts:70` — fallback `"Erro ao buscar categorias"` → `t("categories.errors.loadCategories")`

**New translation keys added to pt-BR.json and en-US.json:**
- `common.errors.noData`
- `cart.itemRemoved`, `cart.cleared`, `cart.errors.fetchSession`, `cart.errors.openSession`, `cart.errors.createOrder`
- `users.actions.disableNotImplemented`
- `orders.admin.table.orderLabel`

**Files changed:** 6 (useCart.ts, useCategories.ts, users/page.tsx, staff-session-summary-modal.tsx, pt-BR.json, en-US.json)
**Status:** fixed

---

## US-019 — i18n — Sync en-US Translation File

**Rule:** `rule-i18n.md`
**Files scanned:** `src/shared/translations/en-US.json`, `src/shared/translations/pt-BR.json`
**Violations found:** None — en-US.json was updated together with pt-BR.json in US-018. Both files have identical key structure with all 8 new keys already present:
- `common.errors.noData`
- `cart.itemRemoved`, `cart.cleared`, `cart.errors.fetchSession`, `cart.errors.openSession`, `cart.errors.createOrder`
- `users.actions.disableNotImplemented`
- `orders.admin.table.orderLabel`

All en-US values are correct English translations (not Portuguese text).
**Files changed:** 0 (no changes needed — already in sync)
**Status:** fixed (no changes needed)

---

## US-020 — TanStack Table — Columns, Skeleton, Sorting

**Rule:** `rule-tanstack-table.md`
**Files scanned:** `src/**/*.tsx` (table components)
**Violations found:**

- `orders-table.tsx` — used `manualSorting: true` without `getSortedRowModel()` or TanStack `SortingState`. Custom `getSortTitle`/`onColumnSort` callbacks bypassed TanStack's sort mechanism entirely. (fixed: added `getSortedRowModel()`, `SortingState`, `Updater`, `tableSorting` derived from props, `handleSortingChange` callback, updated `Header` to use `getToggleSortingHandler()` and `getIsSorted()`)
- `orders-table.interface.ts` — `OrdersTableHeaderProps` had custom sort props (`sortState`, `getSortTitle`, `onColumnSort`) (fixed: simplified to `{ headerGroups }` only)
- `src/pages/foods/page.tsx` — passed `active: true` to `useCategories` after `active` was removed from `GetCategoriesRequestQuery` interface (fixed: removed `active` option)
- All other tables (ProductsTable, CategoriesTable, UsersTable, OrdersTable) — compliant: columns defined with `useMemo`, headers/cells use `flexRender`, loading/empty in parent, skeletons with `animate-pulse`, source data length checked in parent

**Status:** fixed

---

## US-021 — Pagination — usePagination Hook and Layout

**Rule:** `rule-pagination.md`
**Files scanned:** `src/pages/**`, `src/components/ui/pagination/`
**Violations found:** None — all 5 paginated views (products, categories, users, admin-orders, kitchen-orders) already use `usePagination` hook and `<Pagination>` composite component with `.Info`, `.SizeSelect`, and `.Controls`. Table outer containers use `flex flex-col h-full`, inner containers use `flex-1 min-h-0`.
**Status:** fixed (no changes needed)

---

## US-022 — Foods Page — Responsive Grid and Category Separators

**Rule:** `rule-foods-page.md`
**Files scanned:** `src/pages/foods/components/foods.tsx`, `src/pages/foods/page.tsx`
**Violations found:** None — grid layout `flex flex-col gap-3` on mobile → `sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6` already correct. Category separator `<div class="flex items-center gap-3"><div class="flex-1 h-px bg-border" /><h2>...</h2><div class="flex-1 h-px bg-border" /></div>` already correct. Applies to both Foods component and FoodsLoadingSkeleton.
**Status:** fixed (no changes needed)

---

## US-023 — Swiper Navigation Buttons — Flexbox and RxJS

**Rule:** `rule-swiper-navigation-buttons.md`
**Files scanned:** `src/pages/**` (swiper components)
**Violations found:** TBD
**Status:** pending
