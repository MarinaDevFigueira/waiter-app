---
name: spec:custom-scrollbar-theme
description: "Custom Scrollbar Theme"
---

# Custom Scrollbar Theme

Custom scrollbar styling must use theme variables and avoid hardcoded values.

## Rule

When customizing scrollbar appearance:

1. **Define variables in theme** - Add scrollbar-specific CSS variables to `:root` and `.dark`
2. **Use theme colors** - Reference existing theme colors (border, muted, etc.)
3. **No hardcoded sizes** - Use rem units stored in CSS variables
4. **Apply globally** - Use `@layer base` for consistent scrollbar across the app

## Implementation

### Step 1: Define Variables

Add to both `:root` and `.dark` in `src/index.css`:

```css
:root {
  /* ... other variables */
  --scrollbar-size: 0.25rem;
  --scrollbar-thumb: oklch(from var(--border) l c h / 0.5);
  --scrollbar-thumb-hover: oklch(from var(--border) l c h / 0.8);
}

.dark {
  /* ... other variables */
  --scrollbar-size: 0.25rem;
  --scrollbar-thumb: oklch(from var(--border) l c h / 0.5);
  --scrollbar-thumb-hover: oklch(from var(--border) l c h / 0.8);
}
```

### Step 2: Apply Styles

Add to `@layer base` in `src/index.css`:

```css
@layer base {
  /* WebKit browsers (Chrome, Safari, Edge) */
  *::-webkit-scrollbar {
    width: var(--scrollbar-size);
    height: var(--scrollbar-size);
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: calc(var(--scrollbar-size) / 2);
  }

  *::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent;
  }
}
```

## Why

- **Theme consistency** - Scrollbars match the overall design system
- **Dark mode support** - Automatically adapts to theme changes
- **Maintainability** - Single source of truth for scrollbar styling
- **No hardcoded values** - Follows the no-hardcoded-values spec

## Related Patterns

### Scroll Snap

When adding scrollable containers with discrete items, use scroll snap:

```jsx
// Container
<div className="overflow-y-auto snap-y snap-mandatory">
  {items.map(item => (
    <div className="snap-start">{item}</div>
  ))}
</div>
```

**Benefits:**
- Better UX for scrolling through lists
- Prevents items from being cut off mid-scroll
- Works well with touch gestures on mobile

## Anti-Patterns

```css
/* WRONG - hardcoded values */
*::-webkit-scrollbar {
  width: 6px;
  background: #ccc;
}

/* WRONG - not using theme colors */
*::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5);
}

/* CORRECT - uses theme variables */
*::-webkit-scrollbar {
  width: var(--scrollbar-size);
}

*::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
}
```
