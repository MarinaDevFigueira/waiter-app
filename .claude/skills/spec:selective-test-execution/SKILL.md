---
name: spec:selective-test-execution
description: "Selective Test Execution After Code Changes"
---

# Selective Test Execution After Code Changes

Run only relevant tests after implementation changes, not the entire test suite.

## Rule

**After modifying code, identify and run only the tests affected by the changes.**

Never run the entire test suite (`npm run test`) after focused implementation work. Instead:

1. **Identify affected areas** based on what was changed
2. **Run specific test files** related to those areas
3. **Run full suite only** before commits/PRs or when requested

## Examples

### ✅ CORRECT - Targeted Test Execution

```bash
# Modified logo component
npm run test:headed -- src/components/ui/logo/__tests__/logo.spec.js

# Modified auth logic
npm run test:headed -- src/components/auth/__tests__/

# Modified multiple related components
npm run test:headed -- src/components/ui/

# Modified a hook
npm run test:headed -- src/shared/hooks/__tests__/useCategory.spec.js
```

### ❌ WRONG - Running All Tests After Small Change

```bash
# Changed only logo.jsx
npm run test  # ❌ Runs all 135 tests unnecessarily

# Better approach:
npm run test:headed -- src/components/ui/logo/__tests__/logo.spec.js  # ✅ Runs 4 relevant tests
```

## Decision Tree

```
Code Changed?
├─ Single Component
│  └─ Run: Component's __tests__ folder only
├─ Multiple Related Components (same module)
│  └─ Run: Module's __tests__ folders
├─ Shared Hook/Utility
│  └─ Run: Hook tests + Components using it
├─ Route/Layout
│  └─ Run: Route tests + Layout tests
└─ Before Commit/PR
   └─ Run: Full test suite (npm run test)
```

## Pattern Mapping

| Changed File | Run These Tests |
|--------------|----------------|
| `src/components/ui/logo/logo.jsx` | `src/components/ui/logo/__tests__/` |
| `src/shared/hooks/useCategory.js` | `src/shared/hooks/__tests__/useCategory.spec.js` |
| `src/components/auth/protected-route.jsx` | `src/components/auth/__tests__/` |
| `src/routes/index.jsx` | `src/routes/__tests__/` |
| `src/components/layouts/app-layout.jsx` | `src/components/layouts/__tests__/app-layout.spec.js` |

## Commands

```bash
# Specific test file
npm run test:headed -- path/to/test.spec.js

# All tests in a directory
npm run test:headed -- path/to/directory/__tests__/

# Pattern matching
npm run test:headed -- --grep "Logo Component"

# Full suite (before commit)
npm run test
```

## When to Run Full Suite

- Before creating a commit
- Before creating a PR
- After major refactoring
- When specifically requested
- In CI/CD pipeline

## Why

**Performance**: Running 135 tests takes ~45 seconds. Running 4 relevant tests takes ~5 seconds.

**Focus**: Targeted tests show immediate feedback on the changes you made.

**Efficiency**: Fast feedback loop encourages more frequent testing during development.

**Cost**: Full test suite is valuable but expensive - use it when it matters.

## Workflow Example

```bash
# 1. Make changes to logo component
vim src/components/ui/logo/logo.jsx

# 2. Run affected tests only
npm run test:headed -- src/components/ui/logo/__tests__/logo.spec.js

# 3. Tests pass? Good! Continue development.
# Tests fail? Fix and re-run same tests.

# 4. Before committing, run full suite
npm run test

# 5. All tests pass? Create commit.
git add .
git commit -m "feat: convert logo to SVG"
```

## Integration with Workflow

Always follow this sequence after code changes:

1. **Implement** → 2. **Run relevant tests** → 3. **Fix if needed** → 4. **Run full suite before commit**

Not:
1. **Implement** → 2. **Run all tests** ❌
