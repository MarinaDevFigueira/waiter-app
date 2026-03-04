# All components must have tests

Every component must have corresponding test coverage.

## Rule

- **EVERY** component in `src/components/` must have a `__tests__/` directory with test files
- Test files must be named `{component-name}.spec.js`
- Use Playwright for E2E component testing
- Tests must verify:
  - Component renders correctly
  - Props work as expected
  - User interactions function properly
  - Styling/classes are applied correctly
  - Edge cases and error states
- Minimum 3-5 test cases per component
- Follow existing test patterns in the codebase

## Structure

```
src/components/
├── ui/
│   ├── button/
│   │   ├── button.jsx
│   │   └── __tests__/
│   │       └── button.spec.js
│   ├── input/
│   │   ├── input.jsx
│   │   └── __tests__/
│   │       └── input.spec.js
```

## Example

```javascript
// CORRECT — button.spec.js
import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("renders and is clickable", async ({ page }) => {
    await page.goto("/login");
    const button = page.getByTestId("login-submit-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test("shows loading state", async ({ page }) => {
    await page.goto("/login");
    const button = page.getByTestId("login-submit-button");
    await button.click();
    await expect(button).toContainText("Loading");
  });

  test("can be disabled", async ({ page }) => {
    await page.goto("/login");
    const button = page.getByTestId("disabled-button");
    await expect(button).toBeDisabled();
  });
});
```

## When to create tests

- Immediately after creating a new component
- Before submitting PR with new component
- When modifying existing component behavior

## Why

- Ensures all components work as expected
- Prevents regressions when refactoring
- Documents component usage and behavior
- Catches bugs early in development
- Maintains high code quality across the project
