# Never use hardcoded colors or spacing values

All styling values must use Tailwind CSS classes or CSS variables.

## Rule

- Never use hardcoded colors, spacing, or sizes (except `width` and `height`)
- **Exception:** `w-[120px]` and `h-[200px]` are allowed for explicit dimensions
- Use native Tailwind classes first (e.g., `bg-red-500`, `p-4`)
- Use theme variables from `src/index.css` second (e.g., `bg-primary`, `text-foreground`)
- Only add new CSS variables to `:root` in `src/index.css` as last resort
- For conditional styling, use `data-*` attributes instead of ternaries

## Example

```jsx
// WRONG
<div className="bg-[#D73035] text-[#FFFFFF] p-[16px] rounded-[8px]">

// CORRECT
<div className="bg-primary text-white p-4 rounded-md w-[120px]">
```

```jsx
// WRONG — ternary for conditional colors
<Button className={isSuccess ? "bg-white text-primary" : "bg-primary text-white"} />

// CORRECT — data attributes
<Button
  data-isSuccess={isSuccess}
  className="data-[isSuccess=true]:bg-white data-[isSuccess=true]:text-primary data-[isSuccess=false]:bg-primary data-[isSuccess=false]:text-white"
/>
```

## Why

Tailwind's design tokens ensure consistency. Hardcoded values create maintenance burden and break design system coherence.
