---
name: spec:test-before-commit
description: "Run tests of changed files before committing"
---

# Run tests of changed files before committing

Verify tests of modified files pass before creating commits using selective execution.

## Rule

**Before every commit, run only the tests related to changed files:**

1. **Identify changed files** using `git status` or `git diff`
2. **Map files to their test files** (see mapping table below)
3. **Run only those specific tests** using `npm run test -- <test-file-path>`
4. **Fix all failing tests** before committing
5. **Never commit with failing tests**
6. **Never remove or simplify tests to make them pass** — fix the actual code

## File-to-Test Mapping

| Changed File Pattern | Test File to Run |
|---------------------|------------------|
| `src/components/ui/{name}/{name}.jsx` | `src/components/ui/{name}/__tests__/{name}.spec.js` |
| `src/pages/{path}/page.jsx` | `src/pages/{path}/__tests__/page.spec.js` |
| `src/pages/{path}/components/{name}.jsx` | `src/pages/{path}/components/__tests__/{name}.spec.js` |
| `src/shared/hooks/{name}.js` | `src/shared/hooks/__tests__/{name}.spec.js` |
| `src/components/layouts/{name}.jsx` | `src/components/layouts/__tests__/{name}.spec.js` |
| `src/routes/{name}.jsx` | `src/routes/__tests__/{name}.spec.js` |

## Example Workflow

```bash
# 1. Check what files changed
git status

# Example output:
# M  src/components/ui/button/button.jsx
# M  src/pages/products/page.jsx
# M  src/shared/hooks/useProducts.js

# 2. Run tests for EACH changed file individually
npm run test -- src/components/ui/button/__tests__/button.spec.js
npm run test -- src/pages/products/__tests__/page.spec.js
npm run test -- src/shared/hooks/__tests__/useProducts.spec.js

# 3. All tests pass? Now commit
git add .
git commit -m "feat: improve product filtering"
```

## Detailed Examples

### ✅ CORRECT — Selective test execution

```bash
# Scenario: Modified logo component only
git status
# M  src/components/ui/logo/logo.jsx

# Run only logo tests
npm run test -- src/components/ui/logo/__tests__/logo.spec.js
# ✅ 5 passed (2.1s)

# Commit
git add .
git commit -m "style: update logo colors"
```

### ✅ CORRECT — Multiple files changed

```bash
# Scenario: Modified auth hook and protected route
git status
# M  src/shared/hooks/useAuth.js
# M  src/components/auth/protected-route.jsx

# Run both test files
npm run test -- src/shared/hooks/__tests__/useAuth.spec.js
# ✅ 18 passed (3.2s)

npm run test -- src/components/auth/__tests__/protected-route.spec.js
# ✅ 5 passed (1.8s)

# All pass? Commit
git add .
git commit -m "feat: add session expiration check"
```

### ❌ WRONG — Committing without running tests

```bash
git add .
git commit -m "feat: add product modal"
# ❌ No tests run - could be introducing bugs
```

### ❌ WRONG — Running full suite unnecessarily

```bash
# Changed only 1 file
git status
# M  src/components/ui/input/input.jsx

# Running all 436 tests (4.8 minutes)
npm run test
# ❌ Wastes time - only need to run 5 input tests (~2s)

# Should run:
npm run test -- src/components/ui/input/__tests__/input.spec.js
# ✅ 5 passed (2.1s)
```

## Special Cases

### New Component (no test exists yet)
```bash
# Created new component
git status
# A  src/components/ui/tooltip/tooltip.jsx

# 1. Create test file first
touch src/components/ui/tooltip/__tests__/tooltip.spec.js

# 2. Write tests
# 3. Run tests
npm run test -- src/components/ui/tooltip/__tests__/tooltip.spec.js

# 4. Then commit
git add .
git commit -m "feat: add tooltip component"
```

### Modified Multiple Related Files
```bash
# Changed entire module
git status
# M  src/pages/products/page.jsx
# M  src/pages/products/components/products-table.jsx
# M  src/pages/products/components/products-filters.jsx

# Run all tests in that module
npm run test -- src/pages/products/__tests__/
# Or run each individually:
npm run test -- src/pages/products/__tests__/page.spec.js
npm run test -- src/pages/products/components/__tests__/products-table.spec.js
npm run test -- src/pages/products/components/__tests__/products-filters.spec.js
```

## Quick Reference Commands

```bash
# Single test file
npm run test -- path/to/__tests__/component.spec.js

# All tests in directory
npm run test -- path/to/__tests__/

# Check which files changed
git status
git diff --name-only

# Pattern: if changed X, test X
# src/components/ui/button/button.jsx → src/components/ui/button/__tests__/button.spec.js
# src/shared/hooks/useAuth.js → src/shared/hooks/__tests__/useAuth.spec.js
```

## When to Run Full Suite

Only run `npm run test` (all 436 tests) when:
- Creating a Pull Request
- After major refactoring across multiple modules
- When explicitly requested
- **Not** for routine commits of focused changes

## Why

**Efficiency**: Running 5 relevant tests (2s) vs 436 tests (4.8min) = 144x faster feedback

**Focus**: Immediate feedback on the code you actually changed

**Cost-effective**: Full suite is valuable but expensive - reserve it for PRs and major changes

**Best practice**: Tests must pass, but you only need to verify tests related to your changes before each commit

Tests document expected behavior and prevent regressions. Committing failing tests breaks CI/CD and hides bugs. Tests must always pass, but selective execution makes this fast and practical.
