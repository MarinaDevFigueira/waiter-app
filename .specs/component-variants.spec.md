# Always evaluate and use variants in components

All components should use variant props for styling or behavioral variations instead of conditional className logic or boolean flags.

## Rule

- **EVALUATE**: When creating ANY component, assess if it needs variants (visual styles, sizes, states, types)
- **UI components** (`src/components/ui/`) MUST use variants for styling variations
- **All other components** should use variants when they have multiple visual or behavioral modes
- Use `data-*` attributes for variant state in className conditionals
- Variants should cover common use cases: visual styles, sizes, states, types
- Never use ternary operators or conditional logic directly in className prop
- Never use multiple boolean props when a single variant prop would suffice
- Follow shadcn/ui pattern with CVA (Class Variance Authority) when complexity grows

## When to Use Variants

✅ **Use variants for:**
- Visual variations (colors, styles, appearances)
- Size variations (sm, md, lg)
- State variations (active, disabled, loading)
- Type variations (menu items, card types, list modes)
- Behavioral modes (expanded/collapsed, view modes)

❌ **Don't use variants for:**
- One-off conditional rendering
- Content changes (different text or children)
- Feature flags or permissions

## Examples

### Example 1: UI Button Component

```jsx
// WRONG — boolean props and ternaries
export function Button({ isPrimary, isSmall, children }) {
  return (
    <button className={`
      ${isPrimary ? "bg-primary text-white" : "bg-secondary text-foreground"}
      ${isSmall ? "px-3 py-1" : "px-4 py-2"}
    `}>
      {children}
    </button>
  )
}

// CORRECT — variant props with data-attributes
export function Button({ variant = "default", size = "md", children }) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      className="
        data-[variant=default]:bg-secondary data-[variant=default]:text-foreground
        data-[variant=primary]:bg-primary data-[variant=primary]:text-white
        data-[variant=ghost]:bg-transparent data-[variant=ghost]:hover:bg-secondary
        data-[size=sm]:px-3 data-[size=sm]:py-1 data-[size=sm]:text-sm
        data-[size=md]:px-4 data-[size=md]:py-2
        data-[size=lg]:px-6 data-[size=lg]:py-3 data-[size=lg]:text-lg
      "
    >
      {children}
    </button>
  )
}

// Usage
<Button variant="primary" size="lg">Submit</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

### Example 2: MenuItem Component (Non-UI)

```jsx
// WRONG — boolean flags and conditional styling
export function MenuItem({ icon, label, isActive, isDisabled, onClick }) {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2
        ${isActive ? "bg-primary text-white" : "bg-transparent text-foreground"}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// CORRECT — variant prop for state
export function MenuItem({ icon, label, state = "default", onClick }) {
  return (
    <button
      disabled={state === "disabled"}
      onClick={onClick}
      data-state={state}
      className="
        flex items-center gap-2 px-4 py-2
        data-[state=default]:bg-transparent data-[state=default]:text-foreground data-[state=default]:hover:bg-secondary
        data-[state=active]:bg-primary data-[state=active]:text-white
        data-[state=disabled]:opacity-50 data-[state=disabled]:cursor-not-allowed
      "
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// Usage
<MenuItem icon={<HomeIcon />} label="Home" state="active" />
<MenuItem icon={<SettingsIcon />} label="Settings" state="default" />
<MenuItem icon={<LogoutIcon />} label="Logout" state="disabled" />
```

### Example 3: Card Component with Type Variants

```jsx
// WRONG — multiple boolean flags
export function Card({ title, children, isPrimary, hasIcon, isFeatured }) {
  return (
    <div className={`
      border rounded-lg p-4
      ${isPrimary ? "border-primary" : "border-border"}
      ${hasIcon ? "flex items-start gap-3" : ""}
      ${isFeatured ? "shadow-lg" : "shadow-sm"}
    `}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}

// CORRECT — variant for card type
export function Card({ title, children, variant = "default" }) {
  return (
    <div
      data-variant={variant}
      className="
        border rounded-lg p-4
        data-[variant=default]:border-border data-[variant=default]:shadow-sm
        data-[variant=primary]:border-primary data-[variant=primary]:shadow-md
        data-[variant=featured]:border-primary data-[variant=featured]:shadow-lg
      "
    >
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}

// Usage
<Card variant="default" title="Regular Card">Content</Card>
<Card variant="primary" title="Primary Card">Important</Card>
<Card variant="featured" title="Featured Card">Highlight</Card>
```

## Common Variant Props

- `variant`: Visual style variations (default, primary, secondary, ghost, outline, destructive)
- `size`: Size variations (sm, md, lg, icon-sm, icon-md, icon-lg)
- `state`: State variations (default, active, disabled, loading, error, success)
- `type`: Type/mode variations (card, list, grid, compact, expanded)

## Why

Variants make components:
- **More maintainable**: All styling in one place, clear intent
- **More predictable**: Consistent API across all components
- **Easier to extend**: Add new variants without changing logic
- **Type-safe**: When using TypeScript, variants provide autocomplete
- **Self-documenting**: Variants show available options at a glance
- **Cleaner code**: No boolean soup, no ternary hell

Using `data-*` attributes instead of ternaries follows CLAUDE.md guidelines and keeps className clean and declarative.

## Decision Process

When creating a component, ask:
1. Will this component have different visual appearances? → Use `variant`
2. Will this component come in different sizes? → Use `size`
3. Will this component have different states (active/disabled/loading)? → Use `state`
4. Will this component have different types or modes? → Use `type` or custom variant

If yes to any, implement variants from the start.
