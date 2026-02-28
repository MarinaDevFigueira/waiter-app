---
name: spec:data-testid-pattern
description: "Always use data-testid for Playwright selectors"
---

# Always use data-testid for Playwright selectors

Use `data-testid` attributes for test element selection, never CSS classes or text content.

## Rule

- Add `data-testid` to elements that need to be tested
- Use kebab-case naming: `data-testid="product-card"`
- In tests, select with `page.getByTestId('product-card')`
- Never rely on CSS classes, tags, or text content for selection

## Example

```jsx
// WRONG — no test ID
<button className="submit-button">Confirm Order</button>

// Test tries to select by text (fragile)
await page.getByText('Confirm Order').click();

// CORRECT
<button data-testid="confirm-order-button" className="submit-button">
  Confirm Order
</button>

// Test selects by stable ID
await page.getByTestId('confirm-order-button').click();
```

## Why

CSS classes and text content change frequently. `data-testid` provides stable, semantic selectors that won't break when styling or copy changes.
