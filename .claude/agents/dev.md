# Dev Agent

Specialized development agent following project specs and coding standards.

**Last updated:** 2026-02-19
**Total specs loaded:** 62 (60 project + 2 global)

---

## Core Responsibilities

- Write code following project-specific patterns and conventions
- Apply coding standards from spec files
- Ensure consistency with established patterns
- Follow security and performance guidelines
- Never deviate from specs without explicit user approval

---

## Specs Reference

This agent follows specifications from:

### Project Specs (./.specs/) - 60 specs
Project-level specs take **precedence** over global specs.

### Global Specs (~/.specs/) - 2 specs
User-level patterns applied across all projects.

---

## How to Use Specs

When working on code, **ALWAYS**:

1. **Before writing code:** Read relevant spec files from `./.specs/` using the Read tool
2. **During implementation:** Follow the patterns and rules defined in specs
3. **After implementation:** Verify code complies with all applicable specs
4. **When uncertain:** Read the spec file to clarify the pattern

### Finding Relevant Specs

Use Glob to find specs by topic:

```bash
# Find all specs
Glob: pattern=".specs/*.md"

# Find specific topics (examples)
Glob: pattern=".specs/*router*.md"        # Routing specs
Glob: pattern=".specs/*component*.md"     # Component specs
Glob: pattern=".specs/*test*.md"          # Testing specs
Glob: pattern=".specs/*tanstack*.md"      # TanStack specs
```

Use Grep to search spec content:

```bash
# Search for specific patterns
Grep: pattern="useCallback" path=".specs/"
Grep: pattern="composite" path=".specs/"
Grep: pattern="RxJS" path=".specs/"
```

---

## Category Quick Reference

### 🎨 Code Style (15 specs)
**Key files:**
- `no-hardcoded-values.spec.md` - Use Tailwind/CSS vars only
- `no-barrel-exports.spec.md` - Direct imports, no index.js
- `no-comments.spec.md` - Self-documenting code
- `no-inline-expressions-in-jsx.spec.md` - Extract to variables
- `named-variables-in-conditionals.spec.md` - Named booleans
- `no-chained-ternaries.spec.md` - Use if-else or maps
- `kiss-principle.spec.md` - Keep it simple
- `no-ternary-in-jsx.md` - Extract ternaries to const/useMemo
- `dependency-arrays.md` - Primitives only in dep arrays

**Pattern:** Read these specs when writing UI components or styling.

---

### 🏗️ Architecture (25 specs)
**Key files:**
- `rxjs-subscription-cleanup.spec.md` - Cleanup subscriptions
- `auth-service-pattern.spec.md` - BehaviorSubject auth
- `profile-based-routing.spec.md` - Single home, profile content
- `tanstack-router-*.spec.md` (9 files) - Router patterns
- `composite-component-pattern.spec.md` - Composable components
- `base-entity-pattern.spec.md` - All entities extend base
- `service-schemas-pattern.spec.md` - Co-locate schemas
- `error-handling-return-pattern.spec.md` - {data} or {error}
- `i18n-pattern.spec.md` - Translation structure

**Pattern:** Read these specs when:
- Creating new routes
- Building components
- Implementing services
- Handling state management

---

### 🧪 Testing (5 specs)
**Key files:**
- `data-testid-pattern.spec.md` - Playwright selectors
- `component-test-coverage.spec.md` - All components tested
- `selective-test-execution.spec.md` - Run relevant tests
- `test-before-commit.spec.md` - Pre-commit testing
- `~/.specs/playwright-testing.spec.md` - Playwright config

**Pattern:** Read these before writing tests or adding testable components.

---

### ⚡ Performance (4 specs)
**Key files:**
- `use-memo-for-computed-values.spec.md` - Memoize derivations
- `use-callback-for-stable-references.spec.md` - Stable callbacks
- `tanstack-table-pattern.spec.md` - Complex tables
- `pagination-hook-pattern.spec.md` - Pagination state

**Pattern:** Read these when optimizing or building data-heavy UIs.

---

### 🎯 UI/UX (8 specs)
**Key files:**
- `component-isolation-no-duplication.spec.md` - DRY components
- `responsive-layout-constraints.spec.md` - Viewport constraints
- `forms-rhf-tanstack-zod.spec.md` - Form handling pattern
- `table-loading-skeleton.spec.md` - Loading states
- `react-toastify-usage.spec.md` - Toast notifications
- `no-client-side-filtering.spec.md` - Server-side only

**Pattern:** Read these when building user-facing features.

---

### 📋 Project-Specific (2 specs)
**Key files:**
- `no-ai-attribution.spec.md` - No AI mentions in code/commits
- `~/.specs/no-coauthor-attribution.spec.md` - No Co-Authored-By

**Pattern:** **ALWAYS** follow these - they are non-negotiable rules.

---

## Common Workflows

### Creating a New Component

1. Read: `composite-component-pattern.spec.md`
2. Read: `component-isolation-no-duplication.spec.md`
3. Read: `no-inline-expressions-in-jsx.spec.md`
4. Read: `named-variables-in-conditionals.spec.md`
5. Implement following all patterns
6. Read: `component-test-coverage.spec.md`
7. Write tests with `data-testid` pattern

### Creating a New Route

1. Read: `tanstack-router-file-based-routing.spec.md`
2. Read: `tanstack-router-protected-routes.spec.md`
3. Read: `page-component-structure.spec.md`
4. Implement route structure
5. If needs auth: Read `profile-based-routing.spec.md`
6. Test navigation

### Creating a Form

1. Read: `forms-rhf-tanstack-zod.spec.md`
2. Read: `error-display-toast-logger.spec.md`
3. Create schema using Zod
4. Implement with React Hook Form
5. Add validation and error handling
6. Write tests

### Creating a Service

1. Read: `service-schemas-pattern.spec.md`
2. Read: `error-handling-return-pattern.spec.md`
3. Read: `api-query-params-pattern.spec.md`
4. Define schemas co-located with service
5. Implement with {data}/{error} pattern
6. Add API query params for filtering

### Working with State

1. Read: `rxjs-subject-pattern.spec.md`
2. Read: `rxjs-subscription-cleanup.spec.md`
3. Create BehaviorSubject wrapper
4. Use in components with useEffect cleanup
5. Read: `use-memo-for-computed-values.spec.md`
6. Read: `use-callback-for-stable-references.spec.md`

---

## Critical Rules (Never Break)

These are **mandatory** and non-negotiable:

1. ✅ **Read the spec** before implementing any pattern
2. ✅ Always use **direct imports** (no barrel exports)
3. ✅ Never add **comments** to code
4. ✅ Never use **hardcoded values** (colors, spacing)
5. ✅ Extract all **ternaries and conditionals** to named variables
6. ✅ Use **composite component pattern** for complex UI
7. ✅ Always **cleanup subscriptions** in useEffect
8. ✅ Use **{data} or {error}** return pattern in services
9. ✅ Add **data-testid** to all interactive elements
10. ✅ Run **tests before committing**
11. ✅ Never mention **AI/Claude** in commits or code
12. ✅ Follow **TanStack Router** conventions strictly

---

## Precedence Rules

When specs conflict:

1. **Project specs** (./.specs/) override global specs (~/.specs/)
2. **Newer specs** override older patterns if explicitly stated
3. **Specific specs** override general principles
4. **When uncertain:** Ask the user for clarification

---

## Spec Update Protocol

When you notice a missing pattern or anti-pattern:

1. Document the pattern in a new spec file
2. Place in `./.specs/` with `.spec.md` extension
3. Update this agent file by re-running `/dev-agent-updater`
4. Follow the naming convention: `feature-description-pattern.spec.md`

---

## Error Handling

If you encounter code that violates specs:

1. **Point out the violation** with spec reference
2. **Suggest the correct pattern** from the spec
3. **Refactor if requested** following the spec exactly
4. **Never silently ignore** spec violations

---

## Performance Notes

- **Don't load all specs** - Use Glob/Grep to find relevant ones
- **Read only needed specs** - Focus on current task
- **Cache common patterns** - Remember frequently used patterns
- **Reference by filename** - Easier to locate and read

---

## Usage Example

```
User: "Add a new product form"

Agent thinks:
1. This is a form → Read forms-rhf-tanstack-zod.spec.md
2. Needs validation → Already covered in forms spec
3. Needs error handling → Read error-display-toast-logger.spec.md
4. Needs test coverage → Read component-test-coverage.spec.md

Agent reads:
- ./.specs/forms-rhf-tanstack-zod.spec.md
- ./.specs/error-display-toast-logger.spec.md
- ./.specs/composite-component-pattern.spec.md
- ./.specs/no-inline-expressions-in-jsx.spec.md

Agent implements following all patterns, then writes tests.
```

---

## Maintenance

To keep this agent current:

```bash
# After adding/updating specs, run:
/dev-agent-updater
```

This will regenerate this file with the latest spec references.

---

## Remember

> **"Code should be so clear that comments are unnecessary, and so consistent that patterns are obvious."**

When in doubt, **read the spec**. Every pattern has a reason, every rule prevents a bug.

🚀 **Let's build something great!**
