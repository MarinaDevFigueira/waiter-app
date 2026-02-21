# Inaccessible Element Styling

Visual pattern for non-interactive or disabled elements.

## Rule

Elements that are non-interactive, disabled, or represent the current state should have visual indicators:

1. **Faded color** - Use `text-muted-foreground` instead of `text-foreground`
2. **Prevent selection** - Add `select-none` to prevent text selection
3. **No pointer cursor** - Ensure no hover effects that suggest interactivity

## Examples

### Breadcrumb - Current Page

```jsx
// WRONG - looks interactive
<span className="text-foreground font-medium">
  {crumb.label}
</span>

// CORRECT - visually indicates non-interactive
<span className="text-muted-foreground font-medium select-none">
  {crumb.label}
</span>
```

### Disabled Navigation Item

```jsx
// WRONG
<button className="text-foreground" disabled>
  Item
</button>

// CORRECT
<button className="text-muted-foreground select-none cursor-not-allowed" disabled>
  Item
</button>
```

### Current Tab

```jsx
// WRONG - same appearance as clickable tabs
<span className="text-foreground font-semibold">
  Active Tab
</span>

// CORRECT - visually distinct
<span className="text-muted-foreground font-semibold select-none">
  Active Tab
</span>
```

## Why

- **Faded color** - Provides clear visual feedback that the element cannot be interacted with
- **Prevent selection** - Improves UX by preventing accidental text selection on non-text content
- **Consistency** - Users learn that muted color = non-interactive across the application

## When to Apply

Apply this pattern when:
- Current page in breadcrumbs or navigation
- Disabled form controls or buttons
- Read-only status indicators
- Active/current tab in tab navigation
- Any element that looks like it could be interactive but isn't
